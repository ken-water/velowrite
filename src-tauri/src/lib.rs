use std::fs;
use std::hash::{DefaultHasher, Hash, Hasher};
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};

use base64::{engine::general_purpose, Engine as _};
use serde::{Deserialize, Serialize};
use tauri::menu::{MenuBuilder, MenuItemBuilder, PredefinedMenuItem, SubmenuBuilder};
use tauri::{AppHandle, Emitter, Manager, Runtime, State};

const FREE_HISTORY_SNAPSHOT_LIMIT: usize = 3;
const GLOBAL_HISTORY_INDEX_LIMIT: usize = 120;
const MAX_MARKDOWN_BYTES: usize = 10 * 1024 * 1024;
const MAX_HTML_EXPORT_BYTES: usize = 20 * 1024 * 1024;
const MAX_PDF_EXPORT_BYTES: usize = 30 * 1024 * 1024;
static SNAPSHOT_SEQUENCE: AtomicU64 = AtomicU64::new(0);

#[derive(Serialize)]
struct MarkdownFile {
    path: String,
    name: String,
    contents: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct FileStamp {
    modified_at: u128,
    size: u64,
}

#[derive(Deserialize, Serialize, Clone)]
struct HistoryEntry {
    id: String,
    file_path: String,
    file_name: String,
    snapshot_path: String,
    created_at: u128,
    size: usize,
}

#[derive(Serialize)]
struct HistorySnapshot {
    entry: HistoryEntry,
    contents: String,
}

#[derive(Default)]
struct RecentMenuState(Mutex<Vec<String>>);

#[derive(Deserialize)]
struct RecentMenuFile {
    path: String,
}

fn normalize_display_path_string(value: &str) -> String {
    value
        .strip_prefix(r"\\?\UNC\")
        .map(|path| format!(r"\\{}", path))
        .or_else(|| value.strip_prefix(r"\\?\").map(ToString::to_string))
        .unwrap_or_else(|| value.to_string())
}

#[tauri::command]
fn app_ready() -> &'static str {
    "velowrite-ready"
}

#[tauri::command]
fn force_close_app(app: AppHandle) {
    app.exit(0);
}

#[tauri::command]
fn set_window_fullscreen(app: AppHandle, fullscreen: bool) -> Result<(), String> {
    let window = app
        .get_webview_window("main")
        .ok_or_else(|| "Main window not found".to_string())?;
    window
        .set_fullscreen(fullscreen)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn sync_recent_menu(
    app: AppHandle,
    state: State<'_, RecentMenuState>,
    files: Vec<RecentMenuFile>,
) -> Result<(), String> {
    let paths = files
        .iter()
        .map(|file| file.path.clone())
        .collect::<Vec<_>>();
    *state
        .0
        .lock()
        .map_err(|_| "Recent menu state unavailable".to_string())? = paths;

    let Some(root_menu) = app.menu() else {
        return Ok(());
    };
    let Some(file_menu) = root_menu
        .get("file_menu")
        .and_then(|item| item.as_submenu().cloned())
    else {
        return Ok(());
    };
    let Some(recent_menu) = file_menu
        .get("recent_files")
        .and_then(|item| item.as_submenu().cloned())
    else {
        return Ok(());
    };

    for item in recent_menu.items().map_err(|error| error.to_string())? {
        recent_menu
            .remove(&item)
            .map_err(|error| error.to_string())?;
    }

    if files.is_empty() {
        let empty = MenuItemBuilder::with_id("recent_empty", "No recent files")
            .enabled(false)
            .build(&app)
            .map_err(|error| error.to_string())?;
        recent_menu
            .append(&empty)
            .map_err(|error| error.to_string())?;
    } else {
        for (index, file) in files.iter().enumerate() {
            let item = MenuItemBuilder::with_id(
                format!("recent_open_{index}"),
                normalize_display_path_string(&file.path),
            )
            .build(&app)
            .map_err(|error| error.to_string())?;
            recent_menu
                .append(&item)
                .map_err(|error| error.to_string())?;
        }
        let separator = PredefinedMenuItem::separator(&app).map_err(|error| error.to_string())?;
        recent_menu
            .append(&separator)
            .map_err(|error| error.to_string())?;
        let clear = MenuItemBuilder::with_id("clear_recent", "Clear Recent Files")
            .build(&app)
            .map_err(|error| error.to_string())?;
        recent_menu
            .append(&clear)
            .map_err(|error| error.to_string())?;
    }

    Ok(())
}

#[tauri::command]
fn read_markdown_file(path: String) -> Result<MarkdownFile, String> {
    read_markdown_file_from_path(path)
}

#[tauri::command]
fn get_launch_files() -> Vec<String> {
    markdown_paths_from_args(std::env::args().collect::<Vec<_>>())
}

#[tauri::command]
fn read_recent_markdown_file(path: String) -> Result<MarkdownFile, String> {
    read_markdown_file_from_path(path)
}

#[tauri::command]
fn get_markdown_file_stamp(path: String) -> Result<Option<FileStamp>, String> {
    let path = PathBuf::from(path);
    if !path.is_file() || !is_markdown_path(&path) {
        return Ok(None);
    }

    let metadata = fs::metadata(&path).map_err(|error| error.to_string())?;
    let modified_at = metadata
        .modified()
        .ok()
        .and_then(|time| time.duration_since(UNIX_EPOCH).ok())
        .map(|duration| duration.as_millis())
        .unwrap_or_default();

    Ok(Some(FileStamp {
        modified_at,
        size: metadata.len(),
    }))
}

fn read_markdown_file_from_path(path: String) -> Result<MarkdownFile, String> {
    let path = canonical_markdown_path(&path)?;
    ensure_file_size(&path, MAX_MARKDOWN_BYTES as u64)?;
    let contents = fs::read_to_string(&path).map_err(|error| error.to_string())?;
    let name = path
        .file_name()
        .and_then(|value| value.to_str())
        .unwrap_or("Untitled.md")
        .to_string();

    Ok(MarkdownFile {
        path: display_path(&path),
        name,
        contents,
    })
}

#[tauri::command]
fn write_markdown_file(path: String, contents: String) -> Result<String, String> {
    write_text_file(
        path,
        contents,
        is_markdown_path,
        MAX_MARKDOWN_BYTES,
        "Markdown",
    )
}

#[tauri::command]
fn write_html_file(path: String, contents: String) -> Result<String, String> {
    write_text_file(path, contents, is_html_path, MAX_HTML_EXPORT_BYTES, "HTML")
}

#[tauri::command]
fn write_pdf_file(path: String, contents_base64: String) -> Result<String, String> {
    let path = PathBuf::from(path);
    if !is_pdf_path(&path) {
        return Err("Only PDF files can be saved".to_string());
    }
    if contents_base64.len() > MAX_PDF_EXPORT_BYTES * 2 {
        return Err("PDF data is too large to export".to_string());
    }
    if let Some(parent) = path.parent() {
        if !parent.is_dir() {
            return Err("The selected folder is not available".to_string());
        }
    }

    let bytes = general_purpose::STANDARD
        .decode(contents_base64)
        .map_err(|error| format!("PDF data could not be decoded: {error}"))?;
    if bytes.len() > MAX_PDF_EXPORT_BYTES {
        return Err("The generated PDF is too large to save".to_string());
    }
    if !bytes.starts_with(b"%PDF-") {
        return Err("Generated data is not a valid PDF".to_string());
    }

    fs::write(&path, bytes).map_err(|error| error.to_string())?;
    Ok(display_path(&path))
}

fn canonical_markdown_path(path: &str) -> Result<PathBuf, String> {
    let path = PathBuf::from(path);
    if !path.is_file() {
        return Err("Markdown file not found".to_string());
    }
    if !is_markdown_path(&path) {
        return Err("Only Markdown files can be opened".to_string());
    }
    fs::canonicalize(path).map_err(|error| error.to_string())
}

fn write_text_file(
    path: String,
    contents: String,
    allowed_path: fn(&Path) -> bool,
    max_bytes: usize,
    label: &str,
) -> Result<String, String> {
    let path = PathBuf::from(path);
    if !allowed_path(&path) {
        return Err(format!("Only {label} files can be saved"));
    }
    if contents.len() > max_bytes {
        return Err(format!(
            "{label} files must be smaller than {} MB",
            max_bytes / (1024 * 1024)
        ));
    }
    if let Some(parent) = path.parent() {
        if !parent.is_dir() {
            return Err("The selected folder is not available".to_string());
        }
    }

    fs::write(&path, contents).map_err(|error| error.to_string())?;
    Ok(display_path(&path))
}

fn display_path(path: &Path) -> String {
    let value = path.to_string_lossy().to_string();
    value
        .strip_prefix(r"\\?\UNC\")
        .map(|path| format!(r"\\{}", path))
        .or_else(|| value.strip_prefix(r"\\?\").map(ToString::to_string))
        .unwrap_or(value)
}

fn ensure_file_size(path: &Path, max_bytes: u64) -> Result<(), String> {
    let size = fs::metadata(path).map_err(|error| error.to_string())?.len();
    if size > max_bytes {
        return Err(format!(
            "Markdown files must be smaller than {} MB",
            max_bytes / (1024 * 1024)
        ));
    }
    Ok(())
}

fn is_markdown_path(path: &Path) -> bool {
    matches!(
        path.extension()
            .and_then(|extension| extension.to_str())
            .map(|extension| extension.to_ascii_lowercase())
            .as_deref(),
        Some("md" | "markdown" | "mdown")
    )
}

fn is_html_path(path: &Path) -> bool {
    matches!(
        path.extension()
            .and_then(|extension| extension.to_str())
            .map(|extension| extension.to_ascii_lowercase())
            .as_deref(),
        Some("html" | "htm")
    )
}

fn is_pdf_path(path: &Path) -> bool {
    matches!(
        path.extension()
            .and_then(|extension| extension.to_str())
            .map(|extension| extension.to_ascii_lowercase())
            .as_deref(),
        Some("pdf")
    )
}

fn markdown_paths_from_args(args: Vec<String>) -> Vec<String> {
    args.into_iter()
        .filter_map(|arg| markdown_path_from_arg(&arg))
        .collect()
}

fn markdown_path_from_arg(arg: &str) -> Option<String> {
    if arg.starts_with('-') || arg.starts_with("velowrite://") {
        return None;
    }

    let path = PathBuf::from(arg);
    if !path.is_file() {
        return None;
    }

    if !is_markdown_path(&path) {
        return None;
    }

    let canonical_path = fs::canonicalize(&path).unwrap_or(path);
    Some(display_path(&canonical_path))
}

#[tauri::command]
fn create_history_snapshot(
    app: AppHandle,
    file_path: String,
    file_name: String,
    contents: String,
) -> Result<HistoryEntry, String> {
    let created_at = now_ms();
    let id = new_snapshot_id(&file_path, created_at);
    let history_dir = history_dir(&app)?;
    fs::create_dir_all(&history_dir).map_err(|error| error.to_string())?;

    let snapshot_path = history_dir.join(format!("{}.md", id));
    write_file_atomically(&snapshot_path, &contents)?;

    let entry = HistoryEntry {
        id,
        file_path,
        file_name,
        snapshot_path: snapshot_path.to_string_lossy().to_string(),
        created_at,
        size: contents.len(),
    };

    let mut entries = read_history_index(&app)?;
    entries.insert(0, entry.clone());
    let removed_global_entries = entries.split_off(GLOBAL_HISTORY_INDEX_LIMIT);
    remove_snapshot_files(&removed_global_entries);
    prune_file_history(&mut entries, &entry.file_path);
    write_history_index(&app, &entries)?;

    Ok(entry)
}

#[tauri::command]
fn list_history_snapshots(app: AppHandle, file_path: String) -> Result<Vec<HistoryEntry>, String> {
    let entries = read_history_index(&app)?;
    Ok(entries
        .into_iter()
        .filter(|entry| entry.file_path == file_path)
        .take(FREE_HISTORY_SNAPSHOT_LIMIT)
        .collect())
}

#[tauri::command]
fn read_history_snapshot(app: AppHandle, id: String) -> Result<HistorySnapshot, String> {
    let entries = read_history_index(&app)?;
    let entry = entries
        .into_iter()
        .find(|entry| entry.id == id)
        .ok_or_else(|| "Snapshot not found".to_string())?;
    let contents = fs::read_to_string(&entry.snapshot_path).map_err(|error| error.to_string())?;
    Ok(HistorySnapshot { entry, contents })
}

#[tauri::command]
fn delete_history_snapshot(app: AppHandle, id: String) -> Result<(), String> {
    let mut entries = read_history_index(&app)?;
    let snapshot_path = entries
        .iter()
        .find(|entry| entry.id == id)
        .map(|entry| entry.snapshot_path.clone());

    entries.retain(|entry| entry.id != id);
    if let Some(path) = snapshot_path {
        let _ = fs::remove_file(path);
    }
    write_history_index(&app, &entries)
}

fn prune_file_history(entries: &mut Vec<HistoryEntry>, file_path: &str) {
    let mut seen_for_file = 0;
    let mut remove_paths = Vec::new();

    entries.retain(|entry| {
        if entry.file_path != file_path {
            return true;
        }

        seen_for_file += 1;
        if seen_for_file <= FREE_HISTORY_SNAPSHOT_LIMIT {
            true
        } else {
            remove_paths.push(entry.snapshot_path.clone());
            false
        }
    });

    remove_snapshot_paths(remove_paths);
}

fn history_dir(app: &AppHandle) -> Result<std::path::PathBuf, String> {
    Ok(app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?
        .join("history"))
}

fn history_index_path(app: &AppHandle) -> Result<std::path::PathBuf, String> {
    Ok(history_dir(app)?.join("index.json"))
}

fn read_history_index(app: &AppHandle) -> Result<Vec<HistoryEntry>, String> {
    let path = history_index_path(app)?;
    if !path.exists() {
        return Ok(Vec::new());
    }

    let contents = fs::read_to_string(path).map_err(|error| error.to_string())?;
    serde_json::from_str(&contents).map_err(|error| error.to_string())
}

fn write_history_index(app: &AppHandle, entries: &[HistoryEntry]) -> Result<(), String> {
    let path = history_index_path(app)?;
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|error| error.to_string())?;
    }
    let contents = serde_json::to_string_pretty(entries).map_err(|error| error.to_string())?;
    write_file_atomically(&path, &contents)
}

fn write_file_atomically(path: &Path, contents: &str) -> Result<(), String> {
    let parent = path
        .parent()
        .ok_or_else(|| "Unable to determine output folder".to_string())?;
    fs::create_dir_all(parent).map_err(|error| error.to_string())?;
    let temporary_path = parent.join(format!(
        ".{}.{}.tmp",
        path.file_name()
            .and_then(|name| name.to_str())
            .unwrap_or("velowrite"),
        SNAPSHOT_SEQUENCE.fetch_add(1, Ordering::Relaxed)
    ));

    fs::write(&temporary_path, contents).map_err(|error| error.to_string())?;

    if let Err(error) = fs::rename(&temporary_path, path) {
        if path.exists() {
            fs::remove_file(path).map_err(|remove_error| remove_error.to_string())?;
            fs::rename(&temporary_path, path).map_err(|rename_error| rename_error.to_string())?;
        } else {
            let _ = fs::remove_file(&temporary_path);
            return Err(error.to_string());
        }
    }

    Ok(())
}

fn remove_snapshot_files(entries: &[HistoryEntry]) {
    remove_snapshot_paths(entries.iter().map(|entry| entry.snapshot_path.clone()));
}

fn remove_snapshot_paths(paths: impl IntoIterator<Item = String>) {
    for path in paths {
        let _ = fs::remove_file(path);
    }
}

fn hash_string(value: &str) -> u64 {
    let mut hasher = DefaultHasher::new();
    value.hash(&mut hasher);
    hasher.finish()
}

fn new_snapshot_id(file_path: &str, created_at: u128) -> String {
    format!(
        "{}-{}-{}",
        hash_string(file_path),
        created_at,
        SNAPSHOT_SEQUENCE.fetch_add(1, Ordering::Relaxed)
    )
}

fn now_ms() -> u128 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_millis())
        .unwrap_or_default()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn recent_menu_labels_hide_windows_extended_path_prefixes() {
        assert_eq!(
            normalize_display_path_string(r"\\?\C:\Users\dell\Notes\plan.md"),
            r"C:\Users\dell\Notes\plan.md"
        );
        assert_eq!(
            normalize_display_path_string(r"\\?\UNC\server\share\plan.md"),
            r"\\server\share\plan.md"
        );
        assert_eq!(
            normalize_display_path_string("/home/rich/Notes/plan.md"),
            "/home/rich/Notes/plan.md"
        );
    }

    fn history_entry(id: &str, file_path: &str, snapshot_path: &Path) -> HistoryEntry {
        HistoryEntry {
            id: id.to_string(),
            file_path: file_path.to_string(),
            file_name: "Notes.md".to_string(),
            snapshot_path: snapshot_path.to_string_lossy().to_string(),
            created_at: 1,
            size: 10,
        }
    }

    #[test]
    fn prunes_file_history_to_the_free_snapshot_limit() {
        let dir = std::env::temp_dir().join(format!("velowrite-history-test-{}", now_ms()));
        fs::create_dir_all(&dir).expect("create temp history dir");

        let paths: Vec<_> = (1..=5)
            .map(|index| {
                let path = dir.join(format!("snapshot-{index}.md"));
                fs::write(&path, format!("snapshot {index}")).expect("write snapshot");
                path
            })
            .collect();
        let unrelated_path = dir.join("unrelated.md");
        fs::write(&unrelated_path, "unrelated").expect("write unrelated snapshot");

        let mut entries = vec![
            history_entry("target-5", "/docs/notes.md", &paths[4]),
            history_entry("target-4", "/docs/notes.md", &paths[3]),
            history_entry("target-3", "/docs/notes.md", &paths[2]),
            history_entry("other-1", "/docs/other.md", &unrelated_path),
            history_entry("target-2", "/docs/notes.md", &paths[1]),
            history_entry("target-1", "/docs/notes.md", &paths[0]),
        ];

        prune_file_history(&mut entries, "/docs/notes.md");

        let ids: Vec<_> = entries.iter().map(|entry| entry.id.as_str()).collect();
        assert_eq!(ids, vec!["target-5", "target-4", "target-3", "other-1"]);
        assert!(paths[4].exists());
        assert!(paths[3].exists());
        assert!(paths[2].exists());
        assert!(unrelated_path.exists());
        assert!(!paths[1].exists());
        assert!(!paths[0].exists());

        let _ = fs::remove_dir_all(dir);
    }

    #[test]
    fn launch_file_parser_keeps_existing_markdown_files_only() {
        let dir = std::env::temp_dir().join(format!("velowrite-launch-test-{}", now_ms()));
        fs::create_dir_all(&dir).expect("create temp launch dir");

        let markdown_path = dir.join("notes.md");
        let uppercase_path = dir.join("README.MARKDOWN");
        let text_path = dir.join("notes.txt");
        fs::write(&markdown_path, "# Notes").expect("write markdown");
        fs::write(&uppercase_path, "# Readme").expect("write uppercase markdown");
        fs::write(&text_path, "not markdown").expect("write text");

        let paths = markdown_paths_from_args(vec![
            "velowrite.exe".to_string(),
            "--flag".to_string(),
            "velowrite://import?payload=abc".to_string(),
            text_path.to_string_lossy().to_string(),
            markdown_path.to_string_lossy().to_string(),
            uppercase_path.to_string_lossy().to_string(),
            dir.join("missing.md").to_string_lossy().to_string(),
        ]);

        assert_eq!(paths.len(), 2);
        assert!(paths.iter().any(|path| path.ends_with("notes.md")));
        assert!(paths.iter().any(|path| path.ends_with("README.MARKDOWN")));

        let _ = fs::remove_dir_all(dir);
    }

    #[test]
    fn native_file_helpers_only_accept_expected_extensions_and_sizes() {
        let dir = std::env::temp_dir().join(format!("velowrite-file-test-{}", now_ms()));
        fs::create_dir_all(&dir).expect("create temp directory");
        let markdown_path = dir.join("notes.md");
        let text_path = dir.join("notes.txt");
        let html_path = dir.join("notes.html");

        write_text_file(
            markdown_path.to_string_lossy().to_string(),
            "notes".to_string(),
            is_markdown_path,
            MAX_MARKDOWN_BYTES,
            "Markdown",
        )
        .expect("write markdown file");
        assert!(markdown_path.exists());
        assert!(write_text_file(
            text_path.to_string_lossy().to_string(),
            "notes".to_string(),
            is_markdown_path,
            MAX_MARKDOWN_BYTES,
            "Markdown",
        )
        .is_err());
        assert!(write_text_file(
            html_path.to_string_lossy().to_string(),
            "export".to_string(),
            is_html_path,
            MAX_HTML_EXPORT_BYTES,
            "HTML",
        )
        .is_ok());
        assert!(write_text_file(
            markdown_path.to_string_lossy().to_string(),
            "x".repeat(MAX_MARKDOWN_BYTES + 1),
            is_markdown_path,
            MAX_MARKDOWN_BYTES,
            "Markdown",
        )
        .is_err());

        let _ = fs::remove_dir_all(dir);
    }

    #[test]
    fn native_pdf_helper_writes_valid_pdf_bytes_only() {
        let dir = std::env::temp_dir().join(format!("velowrite-pdf-test-{}", now_ms()));
        fs::create_dir_all(&dir).expect("create temp directory");
        let pdf_path = dir.join("notes.pdf");
        let text_path = dir.join("notes.txt");
        let pdf_base64 = general_purpose::STANDARD.encode(b"%PDF-1.4\n% VeloWrite test\n");

        write_pdf_file(pdf_path.to_string_lossy().to_string(), pdf_base64.clone())
            .expect("write pdf file");
        assert!(pdf_path.exists());
        assert!(write_pdf_file(text_path.to_string_lossy().to_string(), pdf_base64).is_err());
        assert!(write_pdf_file(
            pdf_path.to_string_lossy().to_string(),
            general_purpose::STANDARD.encode(b"not a pdf"),
        )
        .is_err());

        let _ = fs::remove_dir_all(dir);
    }

    #[test]
    fn snapshot_ids_do_not_collide_within_the_same_millisecond() {
        let first = new_snapshot_id("/docs/notes.md", 1);
        let second = new_snapshot_id("/docs/notes.md", 1);

        assert_ne!(first, second);
    }
}

fn build_menu<R: Runtime, M: Manager<R>>(manager: &M) -> tauri::Result<tauri::menu::Menu<R>> {
    let new_file = MenuItemBuilder::with_id("new_file", "New")
        .accelerator("CmdOrCtrl+N")
        .build(manager)?;
    let open_file = MenuItemBuilder::with_id("open_file", "Open...")
        .accelerator("CmdOrCtrl+O")
        .build(manager)?;
    let save_file = MenuItemBuilder::with_id("save_file", "Save")
        .accelerator("CmdOrCtrl+S")
        .build(manager)?;
    let export_html = MenuItemBuilder::with_id("export_html", "Export HTML...")
        .accelerator("CmdOrCtrl+Shift+E")
        .build(manager)?;
    let export_pdf = MenuItemBuilder::with_id("export_pdf", "Export PDF...")
        .accelerator("CmdOrCtrl+Shift+P")
        .build(manager)?;
    let recent_files = SubmenuBuilder::with_id(manager, "recent_files", "Recent Files").build()?;
    let show_history = MenuItemBuilder::with_id("show_history", "History...")
        .accelerator("CmdOrCtrl+Shift+H")
        .build(manager)?;
    let exit_app = MenuItemBuilder::with_id("exit_app", "Exit")
        .accelerator("CmdOrCtrl+Q")
        .build(manager)?;

    let write_mode = MenuItemBuilder::with_id("view_write", "Writing Mode")
        .accelerator("CmdOrCtrl+1")
        .build(manager)?;
    let split_mode = MenuItemBuilder::with_id("view_split", "Split Mode")
        .accelerator("CmdOrCtrl+2")
        .build(manager)?;
    let preview_mode = MenuItemBuilder::with_id("view_preview", "Preview Mode")
        .accelerator("CmdOrCtrl+3")
        .build(manager)?;

    let file_menu = SubmenuBuilder::with_id(manager, "file_menu", "File")
        .item(&new_file)
        .item(&open_file)
        .item(&save_file)
        .separator()
        .item(&export_html)
        .item(&export_pdf)
        .separator()
        .item(&recent_files)
        .item(&show_history)
        .separator()
        .item(&exit_app)
        .build()?;

    let edit_menu = SubmenuBuilder::new(manager, "Edit")
        .undo()
        .redo()
        .separator()
        .cut()
        .copy()
        .paste()
        .select_all()
        .build()?;

    let view_menu = SubmenuBuilder::new(manager, "View")
        .item(&write_mode)
        .item(&split_mode)
        .item(&preview_mode)
        .separator()
        .text("reload", "Reload")
        .build()?;

    MenuBuilder::new(manager)
        .item(&file_menu)
        .item(&edit_menu)
        .item(&view_menu)
        .build()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(RecentMenuState::default())
        .plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
            let paths = markdown_paths_from_args(args);
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
            }
            if !paths.is_empty() {
                let _ = app.emit("velowrite-open-files", paths);
            }
        }))
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let menu = build_menu(app.handle())?;
            app.set_menu(menu)?;
            app.on_menu_event(|app, event| {
                let id = event.id().0.as_str();
                let command = match id {
                    "new_file" => Some("new".to_string()),
                    "open_file" => Some("open".to_string()),
                    "save_file" => Some("save".to_string()),
                    "export_html" => Some("export-html".to_string()),
                    "export_pdf" => Some("export-pdf".to_string()),
                    id if id.strip_prefix("recent_open_").is_some() => Some(format!(
                        "open-recent:{}",
                        id.strip_prefix("recent_open_").unwrap()
                    )),
                    "clear_recent" => Some("clear-recent".to_string()),
                    "recent_files" => None,
                    "show_history" => Some("show-history".to_string()),
                    "view_write" => Some("view-write".to_string()),
                    "view_split" => Some("view-split".to_string()),
                    "view_preview" => Some("view-preview".to_string()),
                    "exit_app" => Some("exit".to_string()),
                    "reload" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.eval("window.location.reload()");
                        }
                        None
                    }
                    _ => None,
                };

                if let Some(command) = command {
                    let _ = app.emit("velowrite-menu", command);
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            app_ready,
            force_close_app,
            get_launch_files,
            sync_recent_menu,
            get_markdown_file_stamp,
            read_markdown_file,
            read_recent_markdown_file,
            write_markdown_file,
            write_html_file,
            write_pdf_file,
            set_window_fullscreen,
            create_history_snapshot,
            list_history_snapshots,
            read_history_snapshot,
            delete_history_snapshot
        ])
        .run(tauri::generate_context!())
        .expect("error while running VeloWrite");
}
