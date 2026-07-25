use std::fs;
use std::hash::{DefaultHasher, Hash, Hasher};
use std::path::{Path, PathBuf};
use std::time::{SystemTime, UNIX_EPOCH};

use serde::{Deserialize, Serialize};
use tauri::menu::{MenuBuilder, MenuItemBuilder, SubmenuBuilder};
use tauri::{AppHandle, Emitter, Manager, Runtime};

const FREE_HISTORY_SNAPSHOT_LIMIT: usize = 3;
const GLOBAL_HISTORY_INDEX_LIMIT: usize = 120;

#[derive(Serialize)]
struct MarkdownFile {
    path: String,
    name: String,
    contents: String,
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

#[tauri::command]
fn app_ready() -> &'static str {
    "velowrite-ready"
}

#[tauri::command]
fn force_close_app(app: AppHandle) {
    app.exit(0);
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

fn read_markdown_file_from_path(path: String) -> Result<MarkdownFile, String> {
    let contents = fs::read_to_string(&path).map_err(|error| error.to_string())?;
    let name = Path::new(&path)
        .file_name()
        .and_then(|value| value.to_str())
        .unwrap_or("Untitled.md")
        .to_string();

    Ok(MarkdownFile {
        path,
        name,
        contents,
    })
}

#[tauri::command]
fn write_markdown_file(path: String, contents: String) -> Result<String, String> {
    fs::write(&path, contents).map_err(|error| error.to_string())?;
    Ok(path)
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

    let extension = path.extension()?.to_string_lossy().to_ascii_lowercase();
    if !matches!(extension.as_str(), "md" | "markdown" | "mdown") {
        return None;
    }

    Some(
        fs::canonicalize(&path)
            .unwrap_or(path)
            .to_string_lossy()
            .to_string(),
    )
}

#[tauri::command]
fn create_history_snapshot(
    app: AppHandle,
    file_path: String,
    file_name: String,
    contents: String,
) -> Result<HistoryEntry, String> {
    let created_at = now_ms();
    let id = format!("{}-{}", hash_string(&file_path), created_at);
    let history_dir = history_dir(&app)?;
    fs::create_dir_all(&history_dir).map_err(|error| error.to_string())?;

    let snapshot_path = history_dir.join(format!("{}.md", id));
    fs::write(&snapshot_path, &contents).map_err(|error| error.to_string())?;

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
    entries.truncate(GLOBAL_HISTORY_INDEX_LIMIT);
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

    for path in remove_paths {
        let _ = fs::remove_file(path);
    }
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
    fs::write(path, contents).map_err(|error| error.to_string())
}

fn hash_string(value: &str) -> u64 {
    let mut hasher = DefaultHasher::new();
    value.hash(&mut hasher);
    hasher.finish()
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
    let clear_recent = MenuItemBuilder::with_id("clear_recent", "Clear Recent")
        .build(manager)?;
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

    let file_menu = SubmenuBuilder::new(manager, "File")
        .item(&new_file)
        .item(&open_file)
        .item(&save_file)
        .separator()
        .item(&export_html)
        .separator()
        .item(&clear_recent)
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
                    "new_file" => Some("new"),
                    "open_file" => Some("open"),
                    "save_file" => Some("save"),
                    "export_html" => Some("export-html"),
                    "clear_recent" => Some("clear-recent"),
                    "show_history" => Some("show-history"),
                    "view_write" => Some("view-write"),
                    "view_split" => Some("view-split"),
                    "view_preview" => Some("view-preview"),
                    "exit_app" => Some("exit"),
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
            read_markdown_file,
            read_recent_markdown_file,
            write_markdown_file,
            create_history_snapshot,
            list_history_snapshots,
            read_history_snapshot,
            delete_history_snapshot
        ])
        .run(tauri::generate_context!())
        .expect("error while running VeloWrite");
}
