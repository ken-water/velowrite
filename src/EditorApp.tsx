import React from "react";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { markdown as markdownLanguage } from "@codemirror/lang-markdown";
import {
  bracketMatching,
  defaultHighlightStyle,
  foldGutter,
  indentOnInput,
  syntaxHighlighting,
} from "@codemirror/language";
import { search, searchKeymap } from "@codemirror/search";
import { EditorState, Extension } from "@codemirror/state";
import {
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from "@codemirror/view";
import {
  Bot,
  Braces,
  Check,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileText,
  FolderOpen,
  GitBranch,
  Rocket,
  Save,
  Search,
  Settings,
  Info,
  Trash2,
  UploadCloud,
  MonitorDown,
  FolderPlus,
  PanelLeftClose,
  PanelLeftOpen,
  Maximize2,
  Minimize2,
} from "lucide-react";
import {
  buildHtmlDocument,
  extractHeadings,
  getMetrics,
  renderMarkdown,
  slugify,
} from "./markdown";
import { complexDemoMarkdown } from "./sampleMarkdown";
import {
  appVersion,
  autoSaveFileKey,
  buildFocusedLineDiff,
  buildLineDiff,
  createBrowserHistorySnapshot,
  createDesktopHandoffUrl,
  createDraftHistorySnapshot,
  compareSemver,
  defaultViewModeKey,
  draftKey,
  draftNameKey,
  editorFontSizeKey,
  freeHistorySnapshotLimit,
  getInitialViewMode,
  getStoredEditorFontSize,
  getStoredLastLocalFile,
  getStoredPdfExportStyle,
  getStoredReadingFont,
  getStoredReadingPalette,
  getStoredRecentFiles,
  getRecentFileContext,
  normalizeDisplayedPath,
  pdfExportStyleKey,
  readingFontKey,
  readingPaletteKey,
  getStoredThemeMode,
  parseDesktopHandoffUrl,
  readBrowserHistory,
  readDraftHistory,
  storeLastLocalFile,
  storeRecentFiles,
  themeModeKey,
  writeBrowserHistory,
  writeDraftHistory,
  type DiffLine,
  type EditorSurface,
  type HandoffDraft,
  type HistoryEntry,
  type HistoryScope,
  type HistorySnapshot,
  type NativeFile,
  type PdfExportStyle,
  type ReadingFont,
  type ReadingPalette,
  type RecentFile,
  type ThemeMode,
  type ViewMode,
} from "./editorCore";

type NativeApi = {
  openMarkdownFile: () => Promise<NativeFile | null>;
  openRecentMarkdownFile: (path: string) => Promise<NativeFile>;
  saveMarkdownFile: (path: string | null, contents: string) => Promise<string | null>;
  exportHtmlFile: (defaultName: string, html: string) => Promise<string | null>;
  exportPdfFile: (defaultName: string, contentsBase64: string) => Promise<string | null>;
  getMarkdownFileStamp: (path: string) => Promise<FileStamp | null>;
  createHistorySnapshot: (
    filePath: string,
    fileName: string,
    contents: string,
  ) => Promise<HistoryEntry>;
  listHistorySnapshots: (filePath: string) => Promise<HistoryEntry[]>;
  readHistorySnapshot: (id: string) => Promise<HistorySnapshot>;
  deleteHistorySnapshot: (id: string) => Promise<void>;
  getInitialDeepLinks: () => Promise<string[]>;
  listenDeepLinks: (handler: (urls: string[]) => void) => Promise<() => void>;
  getLaunchFiles: () => Promise<string[]>;
  listenLaunchFiles: (handler: (paths: string[]) => void) => Promise<() => void>;
  listenMenuCommand: (handler: (command: string) => void) => Promise<() => void>;
  listenCloseRequested: (handler: () => Promise<boolean>) => Promise<() => void>;
  listenPathDrop: (handler: (paths: string[]) => void) => Promise<() => void>;
  closeWindow: () => Promise<void>;
  setWindowFullscreen: (fullscreen: boolean) => Promise<void>;
  setWindowTitle: (title: string) => Promise<void>;
};

type FileStamp = {
  modifiedAt: number;
  size: number;
};

type UpdateNotice =
  | { state: "checking" }
  | { state: "current" }
  | { state: "available"; latestVersion: string; releaseDate: string; releaseUrl: string }
  | { state: "error"; message: string };

function FormatIcon({ label }: { label: "HTML" | "PDF" }) {
  return (
    <span className={`format-icon format-icon-${label.toLowerCase()}`} aria-hidden="true">
      <span>{label}</span>
    </span>
  );
}

function getMarkdownBasePath(filePath: string | null) {
  if (!filePath) return undefined;
  const normalized = filePath.replace(/\\/g, "/");
  const index = normalized.lastIndexOf("/");
  if (index < 0) return undefined;
  return normalized.slice(0, index + 1);
}

type EditorTemplate = {
  label: string;
  description: string;
  fileName: string;
  markdown: string;
};

const desktopDownloadHref = "/download?utm_source=web_editor&utm_medium=cta";
const desktopHandoffHref = "/download?utm_source=web_handoff&utm_medium=cta";
const friendlyDefaultMarkdown = `## Start Writing

Use this page as a quick Markdown draft. Write on the left, then switch to Preview when you want to read the result.

## A simple note

- Capture the main idea
- Add useful details
- Mark the next action

## Example checklist

- [ ] Draft the note
- [ ] Review the preview
- [ ] Save a Markdown copy

> Tip: keep quick drafts in the browser. Move important files to VeloWrite Desktop for native save, offline work, and local history.
`;
const editorTemplates: EditorTemplate[] = [
  {
    label: "Quick Note",
    description: "A small scratchpad for ideas, todos, or meeting follow-up.",
    fileName: "Quick Note.md",
    markdown:
      "# Quick Note\n\n## Summary\n\nWrite the main idea in one or two sentences.\n\n## Notes\n\n- First point\n- Second point\n\n## Next Actions\n\n- [ ] Follow up\n",
  },
  {
    label: "Meeting Notes",
    description: "Agenda, decisions, owners, and action items on one page.",
    fileName: "Meeting Notes.md",
    markdown:
      "# Meeting Notes\n\n**Date:** Today  \n**Attendees:** \n\n## Agenda\n\n1. Topic one\n2. Topic two\n\n## Decisions\n\n- Decision one\n\n## Action Items\n\n- [ ] Owner: next step\n",
  },
  {
    label: "README",
    description: "A project README with install, usage, and roadmap sections.",
    fileName: "README.md",
    markdown:
      "# Project Name\n\nA short description of what this project does and who it helps.\n\n## Install\n\n```bash\nnpm install\n```\n\n## Usage\n\n```bash\nnpm run dev\n```\n\n## Roadmap\n\n- [ ] First milestone\n- [ ] Next milestone\n",
  },
  {
    label: "Article Draft",
    description: "A simple outline for tutorials, product notes, and essays.",
    fileName: "Article Draft.md",
    markdown:
      "# Article Title\n\nStart with the reader's problem, then show the path forward.\n\n## Why this matters\n\nExplain the context in plain language.\n\n## Practical workflow\n\n1. Step one\n2. Step two\n3. Step three\n\n## Final notes\n\nSummarize what changed for the reader.\n",
  },
];

function createEditorTheme(fontSize: number) {
  return EditorView.theme({
  "&": {
    height: "100%",
    backgroundColor: "transparent",
    color: "var(--editor-text)",
    fontSize: `${fontSize}px`,
  },
  ".cm-scroller": {
    fontFamily:
      'ui-monospace, "SFMono-Regular", "Cascadia Code", "Liberation Mono", Menlo, monospace',
    lineHeight: "1.86",
  },
  ".cm-content": {
    padding: "0 0 48px",
    caretColor: "var(--accent)",
  },
  ".cm-line": {
    padding: "0 8px",
  },
  ".cm-gutters": {
    backgroundColor: "transparent",
    borderRight: "1px solid var(--border-soft)",
    color: "var(--muted)",
  },
  ".cm-activeLine": {
    backgroundColor: "transparent",
    boxShadow: "inset 2px 0 0 var(--accent-soft)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "var(--active-line)",
    color: "var(--accent-strong)",
  },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
    backgroundColor: "var(--selection)",
  },
  "&.cm-focused": {
    outline: "none",
  },
  });
}

function createEditorExtensions(fontSize: number): Extension[] {
  return [
  lineNumbers(),
  foldGutter(),
  EditorView.lineWrapping,
  highlightSpecialChars(),
  history(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  bracketMatching(),
  rectangularSelection(),
  highlightActiveLine(),
  search(),
  markdownLanguage(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  keymap.of([...defaultKeymap, ...historyKeymap, ...searchKeymap, indentWithTab]),
  createEditorTheme(fontSize),
  ];
}

const defaultMarkdown = friendlyDefaultMarkdown;

function useNativeApi(): NativeApi | null {
  const [api, setApi] = React.useState<NativeApi | null>(null);

  React.useEffect(() => {
    const isTauri = "__TAURI_INTERNALS__" in window;
    if (!isTauri) return;

    let cancelled = false;
    async function loadApi() {
      const [{ invoke }, dialog, windowApi, eventApi, deepLink] = await Promise.all([
        import("@tauri-apps/api/core"),
        import("@tauri-apps/plugin-dialog"),
        import("@tauri-apps/api/window"),
        import("@tauri-apps/api/event"),
        import("@tauri-apps/plugin-deep-link"),
      ]);
      const appWindow = windowApi.getCurrentWindow();

      if (cancelled) return;

      setApi({
        async openMarkdownFile() {
          const selected = await dialog.open({
            multiple: false,
            filters: [{ name: "Markdown", extensions: ["md", "markdown", "mdown"] }],
          });
          if (typeof selected !== "string") return null;
          return invoke<NativeFile>("read_markdown_file", { path: selected });
        },
        async openRecentMarkdownFile(path) {
          return invoke<NativeFile>("read_recent_markdown_file", { path });
        },
        async saveMarkdownFile(path, contents) {
          const target =
            path ??
            (await dialog.save({
              defaultPath: "Untitled.md",
              filters: [{ name: "Markdown", extensions: ["md"] }],
            }));
          if (!target) return null;
          return invoke<string>("write_markdown_file", { path: target, contents });
        },
        async exportHtmlFile(defaultName, html) {
          const target = await dialog.save({
            defaultPath: defaultName,
            filters: [{ name: "HTML", extensions: ["html", "htm"] }],
          });
          if (!target) return null;
          return invoke<string>("write_html_file", { path: target, contents: html });
        },
        async exportPdfFile(defaultName, contentsBase64) {
          const target = await dialog.save({
            defaultPath: defaultName,
            filters: [{ name: "PDF", extensions: ["pdf"] }],
          });
          if (!target) return null;
          return invoke<string>("write_pdf_file", { path: target, contentsBase64 });
        },
        async getMarkdownFileStamp(path) {
          return invoke<FileStamp | null>("get_markdown_file_stamp", { path });
        },
        async createHistorySnapshot(filePath, fileName, contents) {
          return invoke<HistoryEntry>("create_history_snapshot", {
            filePath,
            fileName,
            contents,
          });
        },
        async listHistorySnapshots(filePath) {
          return invoke<HistoryEntry[]>("list_history_snapshots", { filePath });
        },
        async readHistorySnapshot(id) {
          return invoke<HistorySnapshot>("read_history_snapshot", { id });
        },
        async deleteHistorySnapshot(id) {
          return invoke<void>("delete_history_snapshot", { id });
        },
        async getInitialDeepLinks() {
          return (await deepLink.getCurrent()) ?? [];
        },
        async listenDeepLinks(handler) {
          return deepLink.onOpenUrl(handler);
        },
        async getLaunchFiles() {
          return invoke<string[]>("get_launch_files");
        },
        async listenLaunchFiles(handler) {
          const unlisten = await eventApi.listen<string[]>("velowrite-open-files", (event) => {
            handler(event.payload);
          });
          return unlisten;
        },
        async listenMenuCommand(handler) {
          const unlisten = await eventApi.listen<string>("velowrite-menu", (event) => {
            handler(event.payload);
          });
          return unlisten;
        },
        async listenCloseRequested(handler) {
          return appWindow.onCloseRequested((event) => {
            event.preventDefault();
            void handler()
              .then((shouldClose) => {
                if (shouldClose) {
                  return invoke<void>("force_close_app");
                }
                return undefined;
              })
              .catch(console.error);
          });
        },
        async listenPathDrop(handler) {
          return appWindow.onDragDropEvent((event) => {
            if (event.payload.type === "drop") {
              handler(event.payload.paths);
            }
          });
        },
        async closeWindow() {
          await invoke<void>("force_close_app");
        },
        async setWindowFullscreen(fullscreen) {
          await invoke<void>("set_window_fullscreen", { fullscreen });
        },
        async setWindowTitle(title) {
          await appWindow.setTitle(title);
        },
      });
    }

    loadApi().catch(console.error);
    return () => {
      cancelled = true;
    };
  }, []);

  return api;
}

function MarkdownEditor({
  value,
  onChange,
  onScroll,
  fontSize,
  scrollTarget,
  scrollRatio,
}: {
  value: string;
  onChange: (value: string) => void;
  onScroll: (ratio: number) => void;
  fontSize: number;
  scrollTarget: { line: number; nonce: number } | null;
  scrollRatio: number | null;
}) {
  const container = React.useRef<HTMLDivElement>(null);
  const view = React.useRef<EditorView | null>(null);
  const onChangeRef = React.useRef(onChange);
  const onScrollRef = React.useRef(onScroll);
  const suppressScrollRef = React.useRef(false);

  React.useEffect(() => {
    onChangeRef.current = onChange;
    onScrollRef.current = onScroll;
  }, [onChange, onScroll]);

  React.useEffect(() => {
    onScrollRef.current = onScroll;
  }, [onScroll]);

  React.useEffect(() => {
    if (!container.current) return;

    const nextView = new EditorView({
      parent: container.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          ...createEditorExtensions(fontSize),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current(update.state.doc.toString());
            }
          }),
        ],
      }),
    });

    function handleScroll() {
      const scrollElement = nextView.scrollDOM;
      const scrollRange = scrollElement.scrollHeight - scrollElement.clientHeight;
      if (suppressScrollRef.current) {
        suppressScrollRef.current = false;
        return;
      }
      onScrollRef.current(scrollRange > 0 ? scrollElement.scrollTop / scrollRange : 0);
    }

    nextView.scrollDOM.addEventListener("scroll", handleScroll, { passive: true });
    view.current = nextView;
    return () => {
      nextView.scrollDOM.removeEventListener("scroll", handleScroll);
      nextView.destroy();
      view.current = null;
    };
  }, [fontSize]);

  React.useEffect(() => {
    const currentView = view.current;
    if (!currentView || scrollRatio === null) return;

    const scrollElement = currentView.scrollDOM;
    const scrollRange = scrollElement.scrollHeight - scrollElement.clientHeight;
    suppressScrollRef.current = true;
    scrollElement.scrollTop = scrollRange > 0 ? scrollRange * scrollRatio : 0;
    window.requestAnimationFrame(() => {
      suppressScrollRef.current = false;
    });
  }, [scrollRatio]);

  React.useEffect(() => {
    const currentView = view.current;
    if (!currentView) return;

    const currentValue = currentView.state.doc.toString();
    if (currentValue === value) return;

    currentView.dispatch({
      changes: {
        from: 0,
        to: currentView.state.doc.length,
        insert: value,
      },
    });
  }, [value]);

  React.useEffect(() => {
    const currentView = view.current;
    if (!currentView || !scrollTarget) return;

    const targetLine = Math.min(scrollTarget.line, currentView.state.doc.lines);
    const line = currentView.state.doc.line(targetLine);
    currentView.dispatch({
      selection: { anchor: line.from },
      effects: EditorView.scrollIntoView(line.from, { y: "start" }),
    });
    window.requestAnimationFrame(() => {
      const block = currentView.lineBlockAt(line.from);
      currentView.scrollDOM.scrollTop = Math.max(0, block.top - 12);
      currentView.focus();
    });
  }, [scrollTarget]);

  return <div ref={container} className="code-editor" aria-label="Markdown content" />;
}

function SettingsPanel({
  themeMode,
  readingPalette,
  readingFont,
  editorFontSize,
  defaultViewMode,
  pdfExportStyle,
  onThemeModeChange,
  onReadingPaletteChange,
  onReadingFontChange,
  onEditorFontSizeChange,
  onDefaultViewModeChange,
  onPdfExportStyleChange,
  onClose,
}: {
  themeMode: ThemeMode;
  readingPalette: ReadingPalette;
  readingFont: ReadingFont;
  editorFontSize: number;
  defaultViewMode: ViewMode;
  pdfExportStyle: PdfExportStyle;
  onThemeModeChange: (mode: ThemeMode) => void;
  onReadingPaletteChange: (mode: ReadingPalette) => void;
  onReadingFontChange: (mode: ReadingFont) => void;
  onEditorFontSizeChange: (size: number) => void;
  onDefaultViewModeChange: (mode: ViewMode) => void;
  onPdfExportStyleChange: (style: PdfExportStyle) => void;
  onClose: () => void;
}) {
  const tableExportStyle = pdfExportStyle.table;
  const [activePane, setActivePane] = React.useState<"writing" | "reading" | "pdf" | "tables">("writing");

  function updatePdfExportStyle(partial: Partial<PdfExportStyle>) {
    onPdfExportStyleChange({ ...pdfExportStyle, ...partial });
  }

  function updateTableExportStyle(table: PdfExportStyle["table"]) {
    onPdfExportStyleChange({ ...pdfExportStyle, table });
  }

  return (
    <div className="settings-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="settings-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <h2 id="settings-title">Settings</h2>
          <button onClick={onClose} aria-label="Close settings">
            Close
          </button>
        </header>

        <div className="settings-tabs" role="tablist" aria-label="Settings sections">
          {([
            ["writing", "Writing"],
            ["reading", "Reading"],
            ["pdf", "PDF"],
            ["tables", "Tables"],
          ] as const).map(([pane, label]) => (
            <button
              key={pane}
              className={activePane === pane ? "active" : ""}
              onClick={() => setActivePane(pane)}
              role="tab"
              aria-selected={activePane === pane}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        {activePane === "writing" && (
          <div className="settings-pane" role="tabpanel">
            <p className="settings-section-note">Choose how the editor opens and how text feels while typing.</p>
            <div className="settings-group">
              <label htmlFor="font-size">Editor font size</label>
              <div className="range-row">
                <input
                  id="font-size"
                  type="range"
                  min="12"
                  max="22"
                  step="1"
                  value={editorFontSize}
                  onChange={(event) => onEditorFontSizeChange(Number(event.target.value))}
                />
                <span>{editorFontSize}px</span>
              </div>
            </div>

            <div className="settings-group">
              <label>Default view</label>
              <div className="settings-segment" aria-label="Default view">
                {(["write", "split", "preview"] as const).map((mode) => (
                  <button
                    key={mode}
                    className={defaultViewMode === mode ? "active" : ""}
                    onClick={() => onDefaultViewModeChange(mode)}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activePane === "reading" && (
          <div className="settings-pane" role="tabpanel">
            <p className="settings-section-note">Tune the reading surface for long sessions.</p>
            <div className="settings-group">
              <label>Theme</label>
              <div className="settings-segment" aria-label="Theme">
                {(["system", "light", "dark"] as const).map((mode) => (
                  <button
                    key={mode}
                    className={themeMode === mode ? "active" : ""}
                    onClick={() => onThemeModeChange(mode)}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-group">
              <label>Reading palette</label>
              <div className="settings-segment wrap" aria-label="Reading palette">
                {(["focus", "paper", "mist", "night", "contrast"] as const).map((mode) => (
                  <button
                    key={mode}
                    className={readingPalette === mode ? "active" : ""}
                    onClick={() => onReadingPaletteChange(mode)}
                    type="button"
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-group">
              <label>Reading font</label>
              <div className="settings-segment" aria-label="Reading font">
                {(["system", "serif", "mono"] as const).map((mode) => (
                  <button
                    key={mode}
                    className={readingFont === mode ? "active" : ""}
                    onClick={() => onReadingFontChange(mode)}
                    type="button"
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activePane === "pdf" && (
          <div className="settings-pane" role="tabpanel">
            <p className="settings-section-note">PDF choices are remembered and reused on the next export.</p>
            <div className="settings-group">
              <label>PDF paper</label>
              <div className="settings-segment" aria-label="PDF paper">
                {(["a4", "letter"] as const).map((mode) => (
                  <button
                    key={mode}
                    className={pdfExportStyle.pageSize === mode ? "active" : ""}
                    onClick={() => updatePdfExportStyle({ pageSize: mode })}
                    type="button"
                  >
                    {mode.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-group">
              <label>PDF margins</label>
              <div className="settings-segment" aria-label="PDF margins">
                {(["comfortable", "compact"] as const).map((mode) => (
                  <button
                    key={mode}
                    className={pdfExportStyle.margins === mode ? "active" : ""}
                    onClick={() => updatePdfExportStyle({ margins: mode })}
                    type="button"
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-group">
              <label>PDF page numbers</label>
              <div className="settings-segment" aria-label="PDF page numbers">
                {([true, false] as const).map((enabled) => (
                  <button
                    key={String(enabled)}
                    className={pdfExportStyle.pageNumbers === enabled ? "active" : ""}
                    onClick={() => updatePdfExportStyle({ pageNumbers: enabled })}
                    type="button"
                  >
                    {enabled ? "show" : "hide"}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-group">
              <label>Page number anchor</label>
              <div className="settings-segment" aria-label="Page number anchor">
                {(["left", "center", "right"] as const).map((mode) => (
                  <button
                    key={mode}
                    className={pdfExportStyle.pageNumberAnchor === mode ? "active" : ""}
                    onClick={() => updatePdfExportStyle({ pageNumberAnchor: mode })}
                    type="button"
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-group">
              <label>Page number format</label>
              <div className="settings-segment" aria-label="Page number format">
                {([
                  ["fraction", "Page 1 / 9"],
                  ["label", "Page 1"],
                  ["simple", "1"],
                ] as const).map(([mode, label]) => (
                  <button
                    key={mode}
                    className={pdfExportStyle.pageNumberFormat === mode ? "active" : ""}
                    onClick={() => updatePdfExportStyle({ pageNumberFormat: mode })}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-group">
              <label>Preview watermark</label>
              <div className="settings-segment" aria-label="Preview watermark">
                {([true, false] as const).map((enabled) => (
                  <button
                    key={String(enabled)}
                    className={pdfExportStyle.previewMark === enabled ? "active" : ""}
                    onClick={() => updatePdfExportStyle({ previewMark: enabled })}
                    type="button"
                  >
                    {enabled ? "show" : "hide"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activePane === "tables" && (
          <div className="settings-pane" role="tabpanel">
            <p className="settings-section-note">These options affect tables in PDF exports.</p>
            <div className="settings-group">
              <label>Export table header</label>
              <div className="settings-segment" aria-label="Export table header">
                {(["tinted", "plain"] as const).map((mode) => (
                  <button
                    key={mode}
                    className={tableExportStyle.header === mode ? "active" : ""}
                    onClick={() => updateTableExportStyle({ ...tableExportStyle, header: mode })}
                    type="button"
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-group">
              <label>Export table rows</label>
              <div className="settings-segment" aria-label="Export table rows">
                {(["striped", "plain"] as const).map((mode) => (
                  <button
                    key={mode}
                    className={tableExportStyle.rows === mode ? "active" : ""}
                    onClick={() => updateTableExportStyle({ ...tableExportStyle, rows: mode })}
                    type="button"
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-group">
              <label>Export table borders</label>
              <div className="settings-segment" aria-label="Export table borders">
                {(["strong", "light"] as const).map((mode) => (
                  <button
                    key={mode}
                    className={tableExportStyle.borders === mode ? "active" : ""}
                    onClick={() => updateTableExportStyle({ ...tableExportStyle, borders: mode })}
                    type="button"
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-group">
              <label>Export table color</label>
              <div className="settings-segment" aria-label="Export table color">
                {(["green", "blue", "gray"] as const).map((mode) => (
                  <button
                    key={mode}
                    className={tableExportStyle.color === mode ? "active" : ""}
                    onClick={() => updateTableExportStyle({ ...tableExportStyle, color: mode })}
                    type="button"
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function HistoryPanel({
  entries,
  selectedSnapshot,
  currentMarkdown,
  hasLocalFile,
  scope,
  onPreview,
  onRestore,
  onDelete,
  onRefresh,
  onClose,
}: {
  entries: HistoryEntry[];
  selectedSnapshot: HistorySnapshot | null;
  currentMarkdown: string;
  hasLocalFile: boolean;
  scope: HistoryScope;
  onPreview: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  onClose: () => void;
}) {
  const [diffMode, setDiffMode] = React.useState<"focused" | "full">("focused");
  const firstChangeRef = React.useRef<HTMLDivElement | null>(null);
  const diff = selectedSnapshot
    ? buildLineDiff(currentMarkdown, selectedSnapshot.contents)
    : [];
  const addedCount = diff.filter((line) => line.type === "added").length;
  const removedCount = diff.filter((line) => line.type === "removed").length;
  const changeCount = addedCount + removedCount;
  const visibleDiff = diffMode === "focused" ? buildFocusedLineDiff(diff) : diff;
  const firstVisibleChangeIndex = visibleDiff.findIndex(
    (line) => line.type === "added" || line.type === "removed",
  );

  function jumpToFirstChange() {
    firstChangeRef.current?.scrollIntoView({ block: "center" });
  }

  return (
    <div className="settings-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="settings-panel history-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <h2 id="history-title">History</h2>
          <div className="panel-actions">
            <button onClick={onRefresh}>Refresh</button>
            <button onClick={onClose}>Close</button>
          </div>
        </header>

        {entries.length > 0 ? (
          <div className="history-layout">
            <div className="history-list">
              <p className="history-limit-note">
                Free preview keeps the latest {freeHistorySnapshotLimit} local snapshots.
              </p>
              {entries.map((entry) => (
                <div
                  className={
                    selectedSnapshot?.entry.id === entry.id
                      ? "history-item selected"
                      : "history-item"
                  }
                  key={entry.id}
                >
                  <button className="history-summary" onClick={() => onPreview(entry.id)}>
                    <strong>{formatTimestamp(entry.created_at)}</strong>
                    <span>{formatSize(entry.size)}</span>
                  </button>
                  <div className="history-actions">
                    <button onClick={() => onRestore(entry.id)}>Restore</button>
                    <button className="danger" onClick={() => onDelete(entry.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="history-preview">
              {selectedSnapshot ? (
                <>
                  <div className="history-diff-summary">
                    <div>
                      <strong>Restore preview</strong>
                      <p>
                        {changeCount
                          ? "Restore will replace the document you are editing with this older snapshot."
                          : "This snapshot matches the current document."}
                      </p>
                      {changeCount > 0 && (
                        <small>Green lines will be restored. Red lines will be replaced.</small>
                      )}
                    </div>
                    <span>{addedCount} restored</span>
                    <span>{removedCount} replaced</span>
                    {changeCount > 0 && (
                      <button className="history-jump-button" onClick={jumpToFirstChange}>
                        Jump to first change
                      </button>
                    )}
                    <div className="history-diff-toggle" aria-label="Diff view mode">
                      <button
                        className={diffMode === "focused" ? "active" : ""}
                        onClick={() => setDiffMode("focused")}
                      >
                        Changes
                      </button>
                      <button
                        className={diffMode === "full" ? "active" : ""}
                        onClick={() => setDiffMode("full")}
                      >
                        Full file
                      </button>
                    </div>
                  </div>
                  {visibleDiff.length > 0 ? (
                    <div className="history-diff-lines" aria-label="Snapshot diff preview">
                      {visibleDiff.map((line, index) =>
                        line.type === "separator" ? (
                          <div className="history-diff-separator" key={`${line.type}-${index}`}>
                            {line.text}
                          </div>
                        ) : (
                          <div
                            ref={index === firstVisibleChangeIndex ? firstChangeRef : undefined}
                            className={`history-diff-line ${line.type}`}
                            key={`${line.type}-${index}`}
                          >
                            <span className="history-diff-sign">
                              {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                            </span>
                            <span className="history-diff-line-number">
                              {line.type === "added"
                                ? line.snapshotLine
                                : line.currentLine ?? line.snapshotLine}
                            </span>
                            <code>{line.text || " "}</code>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="history-diff-empty" aria-label="Snapshot diff preview">
                      <GitBranch size={22} />
                      <strong>No differences</strong>
                      <p>
                        This snapshot matches the document you are editing. Choose another
                        snapshot, or switch to Full file to read the saved copy.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p>Select a snapshot to compare it with the document you are editing now.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="history-empty">
            <GitBranch size={24} />
            <h3>
              {scope === "browser"
                ? "No browser history yet"
                : hasLocalFile
                  ? "No history snapshots yet"
                  : "No draft history yet"}
            </h3>
            <p>
              {scope === "browser"
                ? `Web history is stored only in this browser. The free preview keeps the latest ${freeHistorySnapshotLimit} local snapshots for compare and restore.`
                : hasLocalFile
                  ? `This file is ready for history. After you edit it and save again, VeloWrite keeps the latest ${freeHistorySnapshotLimit} versions from before each save.`
                  : `Unsaved desktop drafts keep local recovery points on this device. The free preview keeps the latest ${freeHistorySnapshotLimit} draft snapshots before the file has a path.`}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function AboutPanel({ onClose }: { onClose: () => void }) {
  const links = [
    ["Feedback", "https://velowrite.app/feedback?utm_source=desktop_about&utm_medium=cta"],
    ["GitHub", "https://github.com/ken-water/velowrite"],
    ["Issues", "https://github.com/ken-water/velowrite/issues"],
    ["Roadmap", "https://github.com/ken-water/velowrite/blob/main/ROADMAP.md"],
    ["Releases", "https://github.com/ken-water/velowrite/releases"],
  ];

  return (
    <div className="settings-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="settings-panel about-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <h2 id="about-title">VeloWrite</h2>
          <button onClick={onClose} aria-label="Close about">
            Close
          </button>
        </header>

        <p>
          A lightweight Markdown editor built with Tauri. It supports local files,
          live preview, PDF export, and history recovery.
        </p>

        <div className="about-version">
          <span>Version</span>
          <strong>{appVersion}</strong>
        </div>

        <div className="about-contact">
          <span>Author contact</span>
          <a href="mailto:kenwater89@gmail.com">kenwater89@gmail.com</a>
        </div>

        <div className="about-links">
          {links.map(([label, href]) => (
            <a key={href} href={href} target="_blank" rel="noreferrer">
              <span>{label}</span>
              <ExternalLink size={14} />
            </a>
          ))}
        </div>

        <div className="about-note">
          <strong>Send feedback</strong>
          <span>
            Tell us when editing feels slow, fragile, or confusing. Usage reports
            help us decide what to fix next.
          </span>
        </div>
      </section>
    </div>
  );
}

function WelcomePanel({
  nativeReady,
  hasRecentFiles,
  onNew,
  onOpen,
  onTemplate,
}: {
  nativeReady: boolean;
  hasRecentFiles: boolean;
  onNew: () => void;
  onOpen: () => void;
  onTemplate: (template: EditorTemplate) => void;
}) {
  return (
    <section className="welcome-panel" aria-label="Getting started">
      <div>
        <strong>Getting started</strong>
        <span>
          Open a Markdown file, create a new note, or drag a document into VeloWrite.
        </span>
      </div>
      <div className="welcome-actions">
        <button onClick={onOpen}>
          <FolderOpen size={15} />
          Open
        </button>
        <button onClick={onNew}>
          <FileText size={15} />
          New
        </button>
      </div>
      <div className="welcome-templates" aria-label="Start from a template">
        {editorTemplates.map((template) => (
          <button key={template.label} onClick={() => onTemplate(template)} type="button">
            <strong>{template.label}</strong>
            <span>{template.description}</span>
          </button>
        ))}
      </div>
      {!nativeReady && (
        <p>The browser can import and download files. Desktop adds direct save and local history.</p>
      )}
      {nativeReady && !hasRecentFiles && <p>Recent files appear here after your first desktop save.</p>}
    </section>
  );
}

function ExportReadinessPanel({
  readiness,
  onDownloadMarkdown,
  onExportHtml,
  onPrintPdf,
  showPrint,
}: {
  readiness: {
    ready: boolean;
    items: Array<{ label: string; done: boolean; value: string }>;
  };
  onDownloadMarkdown: () => void;
  onExportHtml: () => void;
  onPrintPdf: () => void;
  showPrint: boolean;
}) {
  const missing = readiness.items.filter((item) => !item.done).map((item) => item.label);
  const nextHint = readiness.ready
    ? "The draft has a title and section structure."
    : `Add ${missing.slice(0, 2).join(" and ").toLowerCase()} before sharing.`;

  return (
    <section className="export-readiness-panel" aria-label="Export readiness">
      <div className="outline-title">Export readiness</div>
      <div className={readiness.ready ? "export-readiness-state ready" : "export-readiness-state"}>
        <Check size={14} />
        <span>{readiness.ready ? "Ready baseline" : "Draft baseline"}</span>
      </div>
      <p className="export-readiness-hint">{nextHint}</p>
      <div className="export-readiness-list">
        {readiness.items.map((item) => (
          <div key={item.label} data-ready={item.done ? "true" : undefined}>
            <span>{item.label}</span>
            <strong title={item.value}>{item.value}</strong>
          </div>
        ))}
      </div>
      <div className="export-readiness-actions" aria-label="Export actions">
        <button
          aria-label="Download Markdown file"
          title="Download Markdown file"
          onClick={onDownloadMarkdown}
          type="button"
        >
          <FileText size={13} />
          MD
        </button>
        <button
          aria-label="Export HTML file"
          title="Export HTML file"
          onClick={onExportHtml}
          type="button"
        >
          <FormatIcon label="HTML" />
          HTML
        </button>
        {showPrint && (
          <button
            aria-label="Export PDF file"
            title="Export PDF file"
            onClick={onPrintPdf}
            type="button"
          >
            <FormatIcon label="PDF" />
            PDF
          </button>
        )}
      </div>
    </section>
  );
}

function DesktopStartPanel({
  recentFiles,
  historyCount,
  currentDraftName,
  onOpen,
  onNew,
  onContinue,
  onTemplate,
  onRecent,
  onHistory,
}: {
  recentFiles: RecentFile[];
  historyCount: number;
  currentDraftName: string;
  onOpen: () => void;
  onNew: () => void;
  onContinue: () => void;
  onTemplate: (template: EditorTemplate) => void;
  onRecent: (path: string) => void;
  onHistory: () => void;
}) {
  const historyLabel = `${Math.min(historyCount, freeHistorySnapshotLimit)} / ${freeHistorySnapshotLimit}`;

  return (
    <section className="desktop-start-panel" aria-label="Desktop start">
      <div className="desktop-start-copy">
        <span>Continue writing</span>
        <strong>Resume this draft, open a recent file, or start from a template.</strong>
        <small>{currentDraftName} · {historyLabel} recovery snapshots</small>
      </div>
      <div className="desktop-start-actions">
        <button onClick={onContinue} type="button">
          <PanelLeftClose size={15} />
          Continue Draft
        </button>
        <button onClick={onOpen} type="button">
          <FolderOpen size={15} />
          Open File
        </button>
        <button onClick={onNew} type="button">
          <FileText size={15} />
          New Note
        </button>
        <button onClick={onHistory} type="button">
          <GitBranch size={15} />
          History ({historyLabel})
        </button>
      </div>
      <div className="desktop-start-grid">
        {recentFiles.slice(0, 3).map((file) => (
          <button key={file.path} title={file.path} onClick={() => onRecent(file.path)} type="button">
            <FileText size={14} />
            <span>{file.name}</span>
            <small>Recent file</small>
          </button>
        ))}
        {recentFiles.length === 0 &&
          editorTemplates.slice(0, 3).map((template) => (
            <button key={template.label} onClick={() => onTemplate(template)} type="button">
              <FileText size={14} />
              <span>{template.label}</span>
              <small>{template.description}</small>
            </button>
          ))}
      </div>
    </section>
  );
}

function formatTimestamp(value: number) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatSize(value: number) {
  if (value < 1024) return `${value} B`;
  return `${(value / 1024).toFixed(1)} KB`;
}

function findHeadingLine(markdown: string, id: string) {
  const seen = new Map<string, number>();
  const lines = markdown.split("\n");

  for (const [index, line] of lines.entries()) {
    const match = /^(#{1,3})\s+(.+?)\s*#*$/.exec(line);
    if (!match) continue;

    const baseId = slugify(match[2].trim(), index);
    const count = seen.get(baseId) ?? 0;
    seen.set(baseId, count + 1);
    const currentId = count > 0 ? `${baseId}-${count + 1}` : baseId;
    if (currentId === id) {
      return index + 1;
    }
  }

  return null;
}

function afterNextPaint(callback: () => void) {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(callback);
  });
}

export default function EditorApp({
  surface = "desktop",
  initialMarkdown,
  initialViewMode,
}: {
  surface?: EditorSurface;
  initialMarkdown?: string;
  initialViewMode?: ViewMode;
}) {
  const nativeApi = useNativeApi();
  const fileInput = React.useRef<HTMLInputElement>(null);
  const previewRef = React.useRef<HTMLElement>(null);
  const previewScrollFrame = React.useRef<number | null>(null);
  const suppressPreviewSync = React.useRef(false);
  const scrollSource = React.useRef<"editor" | "preview" | null>(null);
  const suppressBeforeUnload = React.useRef(false);
  const fileStampRef = React.useRef<FileStamp | null>(null);
  const autoSaveTimer = React.useRef<number | null>(null);
  const browserHistoryTimer = React.useRef<number | null>(null);
  const browserHistoryBaseline = React.useRef<string | null>(null);
  const draftHistoryTimer = React.useRef<number | null>(null);
  const draftHistoryBaseline = React.useRef<string | null>(null);
  const menuHandlerRef = React.useRef<(command: string) => void>(() => undefined);
  const handoffImportRef = React.useRef<(draft: HandoffDraft) => void>(() => undefined);
  const launchFileHandled = React.useRef(false);
  const lastSessionRestoreTried = React.useRef(false);
  const [markdown, setMarkdown] = React.useState(() => {
    return initialMarkdown ?? localStorage.getItem(draftKey) ?? defaultMarkdown;
  });
  const [filePath, setFilePath] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState(() => {
    return localStorage.getItem(draftNameKey) ?? "Untitled.md";
  });
  const [recentFiles, setRecentFiles] = React.useState(getStoredRecentFiles);
  const [savedMarkdown, setSavedMarkdown] = React.useState(markdown);
  const [status, setStatus] = React.useState("Draft restored");
  const [statusToast, setStatusToast] = React.useState("");
  const [launchFilesChecked, setLaunchFilesChecked] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<ViewMode>(() => {
    return getInitialViewMode(surface, initialViewMode);
  });
  const [themeMode, setThemeMode] = React.useState<ThemeMode>(getStoredThemeMode);
  const [readingPalette, setReadingPalette] = React.useState<ReadingPalette>(
    getStoredReadingPalette,
  );
  const [readingFont, setReadingFont] = React.useState<ReadingFont>(getStoredReadingFont);
  const [systemDark, setSystemDark] = React.useState(() => {
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  });
  const [editorFontSize, setEditorFontSize] = React.useState(getStoredEditorFontSize);
  const [pdfExportStyle, setPdfExportStyle] = React.useState<PdfExportStyle>(
    getStoredPdfExportStyle,
  );
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [historyEntries, setHistoryEntries] = React.useState<HistoryEntry[]>([]);
  const [selectedHistory, setSelectedHistory] = React.useState<HistorySnapshot | null>(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(() => surface !== "desktop");
  const [startPanelDismissed, setStartPanelDismissed] = React.useState(false);
  const [editorScrollTarget, setEditorScrollTarget] = React.useState<{ line: number; nonce: number } | null>(null);
  const [editorScrollRatio, setEditorScrollRatio] = React.useState<number | null>(null);
  const [activeHeadingId, setActiveHeadingId] = React.useState<string | null>(null);
  const [desktopPrompt, setDesktopPrompt] = React.useState<string | null>(null);
  const [desktopHandoffUrl, setDesktopHandoffUrl] = React.useState<string | null>(null);
  const [fileChangeNotice, setFileChangeNotice] = React.useState<string | null>(null);
  const [updateNotice, setUpdateNotice] = React.useState<UpdateNotice>({ state: "checking" });
  const [focusMode, setFocusMode] = React.useState(false);
  const [autoSaveFile, setAutoSaveFile] = React.useState(() => {
    return localStorage.getItem(autoSaveFileKey) === "true";
  });
  const [dragActive, setDragActive] = React.useState(false);
  const recentNameCounts = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const file of recentFiles) {
      counts.set(file.name, (counts.get(file.name) ?? 0) + 1);
    }
    return counts;
  }, [recentFiles]);
  const headings = React.useMemo(() => extractHeadings(markdown), [markdown]);
  const headingSummary = React.useMemo(() => {
    const counts = headings.reduce(
      (summary, heading) => {
        if (heading.level === 1) summary.h1 += 1;
        if (heading.level === 2) summary.h2 += 1;
        if (heading.level === 3) summary.h3 += 1;
        return summary;
      },
      { h1: 0, h2: 0, h3: 0 },
    );

    return {
      ...counts,
      total: headings.length,
    };
  }, [headings]);
  const metrics = React.useMemo(() => getMetrics(markdown), [markdown]);
  const rendered = React.useMemo(
    () => renderMarkdown(markdown, headings, 0, { basePath: getMarkdownBasePath(filePath) }),
    [filePath, headings, markdown],
  );
  const tableExportStyle = pdfExportStyle.table;
  const exportReadiness = React.useMemo(() => {
    const title = headings.find((heading) => heading.level === 1)?.text ?? "";
    const links = (markdown.match(/(?<!!)\[[^\]]+\]\([^)]+\)/g) ?? []).length;
    const images = (markdown.match(/!\[[^\]]*\]\([^)]+\)/g) ?? []).length;
    const codeBlocks = Math.floor((markdown.match(/^```/gm) ?? []).length / 2);
    const hasStructure = headings.length >= 2;
    const ready = Boolean(title) && hasStructure;

    return {
      title,
      links,
      images,
      codeBlocks,
      ready,
      items: [
        { label: "H1 title", done: Boolean(title), value: title || "Missing" },
        { label: "Sections", done: hasStructure, value: String(headings.length) },
        { label: "Links", done: links > 0, value: String(links) },
        { label: "Images", done: images > 0, value: String(images) },
        { label: "Code blocks", done: codeBlocks > 0, value: String(codeBlocks) },
      ],
    };
  }, [headings, markdown]);
  const dirty = markdown !== savedMarkdown;
  const desktopSurface = surface === "desktop";
  const browserMode = !nativeApi && !desktopSurface;
  const webSurface = surface === "web";
  const draftHistoryMode = !browserMode && !filePath;
  const resolvedTheme = themeMode === "system" ? (systemDark ? "dark" : "light") : themeMode;
  const showDesktopStart = false;
  const fileTrustLabel = browserMode
    ? "Browser-local draft"
    : filePath
      ? "Native local file"
      : "Unsaved local draft";
  const saveTrustLabel = dirty ? "Unsaved changes" : browserMode ? "Browser draft saved" : "Saved";
  const historyCountLabel = `${Math.min(historyEntries.length, freeHistorySnapshotLimit)} / ${freeHistorySnapshotLimit}`;
  const historyTrustLabel = browserMode
    ? `${historyCountLabel} browser snapshots`
    : filePath
      ? `${historyCountLabel} file snapshots`
      : `${historyCountLabel} draft snapshots`;
  const desktopPathLabel = filePath
    ? normalizeDisplayedPath(filePath)
    : "Draft has not been saved to a local file yet";

  React.useEffect(() => {
    if (!browserMode) return;
    const snapshots = readBrowserHistory();
    setHistoryEntries(snapshots.map((snapshot) => snapshot.entry));
    if (browserHistoryBaseline.current === null) {
      browserHistoryBaseline.current = markdown;
    }
  }, [browserMode, markdown]);

  React.useEffect(() => {
    if (!draftHistoryMode) return;
    const snapshots = readDraftHistory();
    setHistoryEntries(snapshots.map((snapshot) => snapshot.entry));
    if (draftHistoryBaseline.current === null) {
      draftHistoryBaseline.current = markdown;
    }
  }, [draftHistoryMode, markdown]);

  React.useEffect(() => {
    const windowTitle = `${dirty ? "*" : ""}${fileName} - VeloWrite`;

    if (nativeApi || surface === "desktop") {
      document.title = windowTitle;
    }

    void nativeApi?.setWindowTitle(windowTitle);
  }, [dirty, fileName, nativeApi, surface]);

  React.useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return;

    function updateTheme(event: MediaQueryListEvent) {
      setSystemDark(event.matches);
    }

    media.addEventListener("change", updateTheme);
    return () => media.removeEventListener("change", updateTheme);
  }, []);

  React.useEffect(() => {
    localStorage.setItem(themeModeKey, themeMode);
  }, [themeMode]);

  React.useEffect(() => {
    localStorage.setItem(readingPaletteKey, readingPalette);
  }, [readingPalette]);

  React.useEffect(() => {
    localStorage.setItem(readingFontKey, readingFont);
  }, [readingFont]);

  React.useEffect(() => {
    localStorage.setItem(editorFontSizeKey, String(editorFontSize));
  }, [editorFontSize]);

  React.useEffect(() => {
    localStorage.setItem(pdfExportStyleKey, JSON.stringify(pdfExportStyle));
  }, [pdfExportStyle]);

  React.useEffect(() => {
    localStorage.setItem(defaultViewModeKey, viewMode);
  }, [viewMode]);

  React.useEffect(() => {
    const quietStatuses = new Set(["Draft restored", "Draft autosaved", "Saved"]);
    if (quietStatuses.has(status)) return undefined;

    setStatusToast(status);
    const timer = window.setTimeout(() => setStatusToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [status]);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      localStorage.setItem(draftKey, markdown);
      localStorage.setItem(draftNameKey, fileName);
      setStatus(dirty ? "Draft autosaved" : "Saved");
    }, 350);

    return () => window.clearTimeout(timer);
  }, [dirty, fileName, markdown]);

  React.useEffect(() => {
    if (!browserMode) return;

    if (browserHistoryBaseline.current === null) {
      browserHistoryBaseline.current = markdown;
      return;
    }

    if (browserHistoryTimer.current) {
      window.clearTimeout(browserHistoryTimer.current);
    }

    browserHistoryTimer.current = window.setTimeout(() => {
      const baseline = browserHistoryBaseline.current;
      if (!baseline || baseline === markdown) return;

      const snapshots = createBrowserHistorySnapshot(fileName, baseline);
      setHistoryEntries(snapshots.map((snapshot) => snapshot.entry));
      browserHistoryBaseline.current = markdown;
    }, 1600);

    return () => {
      if (browserHistoryTimer.current) {
        window.clearTimeout(browserHistoryTimer.current);
      }
    };
  }, [browserMode, fileName, markdown]);

  React.useEffect(() => {
    if (!draftHistoryMode) return;

    if (draftHistoryBaseline.current === null) {
      draftHistoryBaseline.current = markdown;
      return;
    }

    if (draftHistoryTimer.current) {
      window.clearTimeout(draftHistoryTimer.current);
    }

    draftHistoryTimer.current = window.setTimeout(() => {
      const baseline = draftHistoryBaseline.current;
      if (!baseline || baseline === markdown) return;

      const snapshots = createDraftHistorySnapshot(fileName, baseline);
      setHistoryEntries(snapshots.map((snapshot) => snapshot.entry));
      draftHistoryBaseline.current = markdown;
    }, 1600);

    return () => {
      if (draftHistoryTimer.current) {
        window.clearTimeout(draftHistoryTimer.current);
      }
    };
  }, [draftHistoryMode, fileName, markdown]);

  React.useEffect(() => {
    localStorage.setItem(autoSaveFileKey, String(autoSaveFile));
  }, [autoSaveFile]);

  React.useEffect(() => {
    if (!nativeApi || !desktopSurface) return;

    let cancelled = false;

    async function checkUpdate() {
      try {
        const response = await fetch(
          "https://api.github.com/repos/ken-water/velowrite/releases/latest",
          { headers: { Accept: "application/vnd.github+json" } },
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const release = (await response.json()) as {
          tag_name?: string;
          html_url?: string;
          published_at?: string;
        };
        if (cancelled) return;

        const latestVersion = String(release.tag_name ?? "").replace(/^v/i, "");
        if (latestVersion && compareSemver(latestVersion, appVersion) > 0) {
          const releaseDate = release.published_at
            ? new Intl.DateTimeFormat(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              }).format(new Date(release.published_at))
            : "Recently";
          setUpdateNotice({
            state: "available",
            latestVersion,
            releaseDate,
            releaseUrl: release.html_url || "https://github.com/ken-water/velowrite/releases",
          });
        } else {
          setUpdateNotice({ state: "current" });
        }
      } catch (error) {
        if (cancelled) return;
        setUpdateNotice({
          state: "error",
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }

    void checkUpdate();
    return () => {
      cancelled = true;
    };
  }, [desktopSurface, nativeApi]);

  React.useEffect(() => {
    if (!nativeApi || !desktopSurface || !filePath) {
      setFileChangeNotice(null);
      return undefined;
    }

    const activeNativeApi = nativeApi;
    const activeFilePath = filePath;
    let cancelled = false;
    let pending = false;

    async function checkFileChange() {
      if (pending) return;
      pending = true;
      try {
        const stamp = await activeNativeApi.getMarkdownFileStamp(activeFilePath);
        if (cancelled || !stamp) return;

        const previous = fileStampRef.current;
        fileStampRef.current = stamp;
        if (previous && (previous.modifiedAt !== stamp.modifiedAt || previous.size !== stamp.size)) {
          setFileChangeNotice(
            `${normalizeDisplayedPath(activeFilePath)} changed on disk. Reload to get the latest content.`,
          );
        }
      } catch {
        // Ignore transient read failures.
      } finally {
        pending = false;
      }
    }

    void checkFileChange();
    const timer = window.setInterval(() => {
      void checkFileChange();
    }, 4000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [desktopSurface, filePath, nativeApi]);

  React.useEffect(() => {
    if (!nativeApi || !desktopSurface) return undefined;
    void nativeApi.setWindowFullscreen(focusMode).catch((error) => {
      setErrorStatus("Fullscreen", error);
    });

    return () => {
      if (focusMode) {
        void nativeApi.setWindowFullscreen(false).catch((error) => {
          setErrorStatus("Fullscreen", error);
        });
      }
    };
  }, [desktopSurface, focusMode, nativeApi]);

  React.useEffect(() => {
    if (!nativeApi || !autoSaveFile || !filePath || !dirty) return;

    if (autoSaveTimer.current) {
      window.clearTimeout(autoSaveTimer.current);
    }

    autoSaveTimer.current = window.setTimeout(() => {
      void saveFile({ silent: true });
    }, 1200);

    return () => {
      if (autoSaveTimer.current) {
        window.clearTimeout(autoSaveTimer.current);
      }
    };
  }, [autoSaveFile, dirty, filePath, markdown, nativeApi]);

  React.useEffect(() => {
    function beforeUnload(event: BeforeUnloadEvent) {
      if (suppressBeforeUnload.current) return;
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const command = event.metaKey || event.ctrlKey;
      if (!command) return;

      if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        void saveFile();
      }

      if (event.key.toLowerCase() === "o") {
        event.preventDefault();
        void openFileWithGuard();
      }

      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        void newFileWithGuard();
      }

      if (event.shiftKey && event.key.toLowerCase() === "e") {
        event.preventDefault();
        void exportHtml();
      }

      if (event.shiftKey && event.key.toLowerCase() === "p") {
        event.preventDefault();
        void printOrSavePdf();
      }

      if (event.key === "1") {
        event.preventDefault();
        setViewMode("write");
      }

      if (event.key === "2") {
        event.preventDefault();
        setViewMode("split");
      }

      if (event.key === "3") {
        event.preventDefault();
        setViewMode("preview");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  menuHandlerRef.current = (command: string) => {
      if (command === "new") void newFileWithGuard();
      if (command === "open") void openFileWithGuard();
      if (command === "save") void saveFile();
      if (command === "export-html") void exportHtml();
      if (command === "export-pdf") void printOrSavePdf();
      if (command === "clear-recent") clearRecentFiles();
      if (command === "show-history") void openHistoryPanel();
      if (command === "view-write") setViewMode("write");
      if (command === "view-split") setViewMode("split");
      if (command === "view-preview") setViewMode("preview");
      if (command === "exit") void closeAppWithGuard();
  };

  handoffImportRef.current = (draft: HandoffDraft) => {
    void importHandoffDraft(draft);
  };

  React.useEffect(() => {
    if (!nativeApi) return;

    let unlisten: (() => void) | undefined;
    void nativeApi.listenMenuCommand((command) => {
      menuHandlerRef.current(command);
    }).then((cleanup) => {
      unlisten = cleanup;
    });

    return () => {
      unlisten?.();
    };
  }, [nativeApi]);

  React.useEffect(() => {
    if (!nativeApi) return;

    let unlistenClose: (() => void) | undefined;
    let unlistenDrop: (() => void) | undefined;

    void nativeApi.listenCloseRequested(async () => {
      return confirmDiscardChanges();
    }).then((cleanup) => {
      unlistenClose = cleanup;
    });

    void nativeApi.listenPathDrop((paths) => {
      const [path] = paths;
      if (path) void openNativePath(path, "Dropped file opened", "Drop open");
    }).then((cleanup) => {
      unlistenDrop = cleanup;
    });

    return () => {
      unlistenClose?.();
      unlistenDrop?.();
    };
  }, [nativeApi]);

  React.useEffect(() => {
    if (!nativeApi) return;

    let cancelled = false;
    let unlisten: (() => void) | undefined;

    function openFirstPath(paths: string[]) {
      const [path] = paths.filter(Boolean);
      if (path) {
        launchFileHandled.current = true;
        void openNativePath(path, "Opened from system", "Open with");
      }
    }

    void nativeApi
      .getLaunchFiles()
      .then((paths) => {
        if (!cancelled) openFirstPath(paths);
        if (!cancelled) setLaunchFilesChecked(true);
      })
      .catch((error) => {
        setErrorStatus("Open with", error);
        if (!cancelled) setLaunchFilesChecked(true);
      });

    void nativeApi
      .listenLaunchFiles(openFirstPath)
      .then((cleanup) => {
        unlisten = cleanup;
      })
      .catch((error) => setErrorStatus("Open with", error));

    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, [nativeApi]);

  React.useEffect(() => {
    if (!nativeApi || !desktopSurface || !launchFilesChecked || lastSessionRestoreTried.current) return;

    lastSessionRestoreTried.current = true;
    const lastFile = getStoredLastLocalFile();
    if (!lastFile || launchFileHandled.current) return;

    void nativeApi
      .openRecentMarkdownFile(lastFile.path)
      .then((nextFile) => {
        if (launchFileHandled.current || dirty || filePath) return;
        loadDocument(nextFile, "Restored last session");
      })
      .catch(() => {
        setStatus("Draft restored");
      });
  }, [desktopSurface, dirty, filePath, launchFilesChecked, nativeApi]);

  React.useEffect(() => {
    if (!nativeApi) return;

    let cancelled = false;
    let unlisten: (() => void) | undefined;

    function importFirstValidUrl(urls: string[]) {
      const draft = urls.map(parseDesktopHandoffUrl).find(Boolean);
      if (draft) handoffImportRef.current(draft);
    }

    void nativeApi
      .getInitialDeepLinks()
      .then((urls) => {
        if (!cancelled) importFirstValidUrl(urls);
      })
      .catch((error) => setErrorStatus("Desktop handoff", error));

    void nativeApi
      .listenDeepLinks(importFirstValidUrl)
      .then((cleanup) => {
        unlisten = cleanup;
      })
      .catch((error) => setErrorStatus("Desktop handoff", error));

    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, [nativeApi]);

  function rememberRecentFile(path: string, name: string) {
    if (!path) return;

    setRecentFiles((current) => {
      const next = [{ path, name }, ...current.filter((file) => file.path !== path)].slice(
        0,
        8,
      );
      storeRecentFiles(next);
      return next;
    });
  }

  function getRecentFileLabel(file: RecentFile) {
    if ((recentNameCounts.get(file.name) ?? 0) <= 1) return file.name;
    return `${file.name} · ${getRecentFileContext(file.path)}`;
  }

  function loadDocument(nextFile: NativeFile, nextStatus = "Opened") {
    setMarkdown(nextFile.contents);
    setSavedMarkdown(nextFile.contents);
    setFilePath(nextFile.path);
    setFileName(nextFile.name || "Untitled.md");
    setStartPanelDismissed(true);
    setStatus(nextStatus);
    if (!nativeApi) browserHistoryBaseline.current = nextFile.contents;
    storeLastLocalFile({ path: nextFile.path, name: nextFile.name || "Untitled.md" });
    rememberRecentFile(nextFile.path, nextFile.name || "Untitled.md");
    setFileChangeNotice(null);
    void refreshHistory(nextFile.path);
    void refreshFileStamp(nextFile.path);
  }

  async function refreshFileStamp(path: string) {
    if (!nativeApi) return;
    try {
      const stamp = await nativeApi.getMarkdownFileStamp(path);
      fileStampRef.current = stamp;
    } catch (error) {
      setErrorStatus("Check file status", error);
    }
  }

  async function reloadFileFromDisk() {
    if (!nativeApi || !filePath) return;
    if (!(await confirmDiscardChanges())) return;

    try {
      const nextFile = await nativeApi.openRecentMarkdownFile(filePath);
      loadDocument(nextFile, "Reloaded from disk");
      setFileChangeNotice(null);
    } catch (error) {
      setErrorStatus("Reload", error);
    }
  }

  async function importHandoffDraft(draft: HandoffDraft) {
    if (!(await confirmDiscardChanges())) return;

    setMarkdown(draft.markdown);
    setSavedMarkdown(draft.markdown);
    setFilePath(null);
    setFileName(draft.name);
    setHistoryEntries([]);
    setSelectedHistory(null);
    setFileChangeNotice(null);
    fileStampRef.current = null;
    setHistoryOpen(false);
    setStartPanelDismissed(true);
    browserHistoryBaseline.current = draft.markdown;
    draftHistoryBaseline.current = draft.markdown;
    setStatus("Imported web draft");
  }

  async function refreshHistory(path = filePath) {
    if (browserMode) {
      const snapshots = readBrowserHistory();
      setHistoryEntries(snapshots.map((snapshot) => snapshot.entry));
      setSelectedHistory((current) => {
        if (!current) return current;
        return snapshots.some((snapshot) => snapshot.entry.id === current.entry.id)
          ? current
          : null;
      });
      return;
    }

    if (draftHistoryMode) {
      const snapshots = readDraftHistory();
      setHistoryEntries(snapshots.map((snapshot) => snapshot.entry));
      setSelectedHistory((current) => {
        if (!current) return current;
        return snapshots.some((snapshot) => snapshot.entry.id === current.entry.id)
          ? current
          : null;
      });
      return;
    }

    if (!nativeApi || !path) {
      setHistoryEntries([]);
      return;
    }

    try {
      const entries = await nativeApi.listHistorySnapshots(path);
      setHistoryEntries(entries);
      setSelectedHistory((current) => {
        if (!current) return current;
        return entries.some((entry) => entry.id === current.entry.id) ? current : null;
      });
    } catch (error) {
      setErrorStatus("Load history", error);
    }
  }

  function setErrorStatus(action: string, error: unknown) {
    const message = error instanceof Error ? error.message : String(error || "Unknown error");
    setStatus(`${action} failed: ${message}`);
  }

  async function confirmDiscardChanges() {
    if (!dirty) return true;
    if (nativeApi) {
      const dialog = await import("@tauri-apps/plugin-dialog");
      return dialog.confirm("Discard unsaved changes?", {
        title: "Unsaved changes",
        kind: "warning",
        okLabel: "Discard",
        cancelLabel: "Cancel",
      });
    }

    return window.confirm("Discard unsaved changes?");
  }

  async function closeAppWithGuard() {
    if (!nativeApi) return;
    if (!(await confirmDiscardChanges())) return;
    await nativeApi.closeWindow();
  }

  async function confirmRestoreSnapshot() {
    const message =
      "Restore this snapshot? The current document will be replaced with the selected older version.";
    if (nativeApi) {
      const dialog = await import("@tauri-apps/plugin-dialog");
      return dialog.confirm(message, {
        title: "Restore history",
        kind: "warning",
        okLabel: "Restore",
        cancelLabel: "Cancel",
      });
    }

    return window.confirm(message);
  }

  async function openFileWithGuard() {
    if (!(await confirmDiscardChanges())) return;
    await openFile();
  }

  async function openFile() {
    if (nativeApi) {
      try {
        const nextFile = await nativeApi.openMarkdownFile();
        if (nextFile) loadDocument(nextFile);
      } catch (error) {
        setErrorStatus("Open", error);
      }
      return;
    }

    fileInput.current?.click();
  }

  function openBrowserFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const contents = String(reader.result ?? "");
      loadDocument({ path: "", name: file.name, contents });
      setFilePath(null);
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function saveBrowserDraft() {
    downloadMarkdown();
    setSavedMarkdown(markdown);
    setStatus("Downloaded Markdown copy");
    setDesktopHandoffUrl(createDesktopHandoffUrl(fileName, markdown));
    setDesktopPrompt("Keep this Markdown backup, then continue in Desktop for native files, local history, and offline work.");
  }

  function getSaveStatus(keptPreviousVersion: boolean, historyWasFull: boolean, silent: boolean) {
    if (silent) {
      return keptPreviousVersion ? "Autosaved. Previous version kept in History." : "Autosaved to file";
    }
    if (!keptPreviousVersion) return "Saved";
    return historyWasFull ? "Saved. Oldest snapshot rotated out." : "Saved. Previous version kept in History.";
  }

  async function saveNativeFile(options?: { silent?: boolean }) {
    if (!nativeApi) return;

    try {
      const previous = {
        markdown: savedMarkdown,
        fileName,
        filePath,
      };
      const historyWasFull = historyEntries.length >= freeHistorySnapshotLimit;
      let keptPreviousVersion = false;

      if (previous.filePath && previous.markdown && previous.markdown !== markdown) {
        await nativeApi.createHistorySnapshot(previous.filePath, previous.fileName, previous.markdown);
        keptPreviousVersion = true;
      }

      const savedPath = await nativeApi.saveMarkdownFile(filePath, markdown);
      if (!savedPath) return;

      if (!previous.filePath && previous.markdown && previous.markdown !== markdown) {
        await nativeApi.createHistorySnapshot(savedPath, previous.fileName, previous.markdown);
        keptPreviousVersion = true;
      }

      const savedName = savedPath.split(/[\\/]/).pop() || fileName;
      setFilePath(savedPath);
      setFileName(savedName);
      setSavedMarkdown(markdown);
      setStatus(getSaveStatus(keptPreviousVersion, historyWasFull, Boolean(options?.silent)));
      setFileChangeNotice(null);
      rememberRecentFile(savedPath, savedName);
      await refreshHistory(savedPath);
      await refreshFileStamp(savedPath);
    } catch (error) {
      setErrorStatus("Save", error);
    }
  }

  async function saveFile(options?: { silent?: boolean }) {
    if (nativeApi) {
      await saveNativeFile(options);
      return;
    }
    saveBrowserDraft();
  }

  function downloadMarkdown() {
    downloadTextFile(
      fileName.endsWith(".md") ? fileName : `${fileName}.md`,
      markdown,
      "text/markdown;charset=utf-8",
    );
  }

  function handoffToDesktop() {
    const handoffUrl = createDesktopHandoffUrl(fileName, markdown);
    setDesktopHandoffUrl(handoffUrl);
    if (!handoffUrl) {
      downloadMarkdown();
      setSavedMarkdown(markdown);
      setStatus("Draft is too large for direct handoff; downloaded Markdown copy");
      setDesktopPrompt("The Markdown copy is saved. Desktop gives this draft native file access and recovery history.");
      suppressBeforeUnload.current = true;
      window.setTimeout(() => {
        window.location.href = desktopHandoffHref;
      }, 250);
      return;
    }

    setStatus("Opening draft in VeloWrite Desktop");
    setDesktopPrompt("If Desktop is installed, this draft can open there. Otherwise download the app and keep the Markdown copy.");
    suppressBeforeUnload.current = true;
    window.location.href = handoffUrl;
    window.setTimeout(() => {
      suppressBeforeUnload.current = false;
      setStatus("If Desktop did not open, download the app or save a Markdown copy");
    }, 1600);
  }

  async function exportHtml() {
    const baseName = fileName.replace(/\.(md|markdown|mdown)$/i, "") || "Untitled";
    const html = buildHtmlDocument(baseName, rendered, tableExportStyle);

    if (nativeApi) {
      try {
        const savedPath = await nativeApi.exportHtmlFile(`${baseName}.html`, html);
        if (savedPath) setStatus("Exported HTML");
      } catch (error) {
        setErrorStatus("Export HTML", error);
      }
      return;
    }

    downloadTextFile(`${baseName}.html`, html, "text/html;charset=utf-8");
    setStatus("Downloaded HTML export");
    setDesktopPrompt("Desktop is better for repeated export work because it can keep files, drafts, and history together.");
  }

  async function printOrSavePdf() {
    const baseName = fileName.replace(/\.(md|markdown|mdown)$/i, "") || "VeloWrite Document";
    try {
      const { createMarkdownPdf, pdfBytesToBase64, savePdfInBrowser } = await import("./pdfExport");
      const pdfBytes = await createMarkdownPdf({
        markdown,
        title: baseName,
        exportStyle: pdfExportStyle,
      });

      if (nativeApi) {
        const savedPath = await nativeApi.exportPdfFile(
          `${baseName}.pdf`,
          pdfBytesToBase64(pdfBytes),
        );
        if (savedPath) setStatus("Exported PDF");
        return;
      }

      savePdfInBrowser(`${baseName}.pdf`, pdfBytes);
      setStatus("Downloaded PDF export");
      setDesktopPrompt("Desktop can save PDFs directly beside your local Markdown files.");
    } catch (error) {
      setErrorStatus("Export PDF", error);
    }
  }

  async function copyText(label: string, contents: string) {
    if (!navigator.clipboard?.writeText) {
      setStatus(`${label} copy is not available in this browser`);
      return;
    }

    try {
      await navigator.clipboard.writeText(contents);
      setStatus(`${label} copied to clipboard`);
    } catch (error) {
      setErrorStatus(`Copy ${label}`, error);
    }
  }

  function copyMarkdown() {
    void copyText("Markdown", markdown);
  }

  function copyRenderedHtml() {
    void copyText("Rendered HTML", rendered);
  }

  function downloadTextFile(name: string, contents: string, type: string) {
    const blob = new Blob([contents], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function openRecentFile(path: string) {
    if (!nativeApi) return;
    if (!(await confirmDiscardChanges())) return;

    try {
      const nextFile = await nativeApi.openRecentMarkdownFile(path);
      loadDocument(nextFile);
    } catch (error) {
      setErrorStatus("Open recent", error);
      setRecentFiles((current) => {
        const next = current.filter((file) => file.path !== path);
        storeRecentFiles(next);
        return next;
      });
    }
  }

  function clearRecentFiles() {
    setRecentFiles([]);
    storeRecentFiles([]);
    setStatus("Recent files cleared");
  }

  async function openHistoryPanel() {
    if (browserMode) {
      const baseline = browserHistoryBaseline.current;
      if (baseline && baseline !== markdown) {
        const historyWasFull = readBrowserHistory().length >= freeHistorySnapshotLimit;
        const snapshots = createBrowserHistorySnapshot(fileName, baseline);
        setHistoryEntries(snapshots.map((snapshot) => snapshot.entry));
        browserHistoryBaseline.current = markdown;
        setStatus(
          historyWasFull
            ? "History updated. Oldest snapshot rotated out."
            : "History snapshot kept locally.",
        );
      } else {
        await refreshHistory();
      }
      setHistoryOpen(true);
      return;
    }

    if (draftHistoryMode) {
      const baseline = draftHistoryBaseline.current;
      if (baseline && baseline !== markdown) {
        const historyWasFull = readDraftHistory().length >= freeHistorySnapshotLimit;
        const snapshots = createDraftHistorySnapshot(fileName, baseline);
        setHistoryEntries(snapshots.map((snapshot) => snapshot.entry));
        draftHistoryBaseline.current = markdown;
        setStatus(
          historyWasFull
            ? "History updated. Oldest snapshot rotated out."
            : "Draft history snapshot kept locally.",
        );
      } else {
        await refreshHistory();
      }
      setHistoryOpen(true);
      return;
    }

    if (!nativeApi) {
      setStatus("Desktop history is loading");
      return;
    }

    await refreshHistory();
    setHistoryOpen(true);
  }

  async function newFileWithGuard() {
    if (!(await confirmDiscardChanges())) return;
    newFile();
  }

  function newFile() {
    const blankDocument = editorTemplates[0].markdown;
    setMarkdown(blankDocument);
    setSavedMarkdown(blankDocument);
    setFilePath(null);
    setFileName(editorTemplates[0].fileName);
    setHistoryEntries([]);
    setSelectedHistory(null);
    setFileChangeNotice(null);
    fileStampRef.current = null;
    setStartPanelDismissed(true);
    browserHistoryBaseline.current = blankDocument;
    draftHistoryBaseline.current = blankDocument;
    setStatus("New file");
  }

  async function startFromTemplate(template: EditorTemplate) {
    if (!(await confirmDiscardChanges())) return;
    setMarkdown(template.markdown);
    setSavedMarkdown(template.markdown);
    setFilePath(null);
    setFileName(template.fileName);
    setHistoryEntries([]);
    setSelectedHistory(null);
    setFileChangeNotice(null);
    fileStampRef.current = null;
    setStartPanelDismissed(true);
    browserHistoryBaseline.current = template.markdown;
    draftHistoryBaseline.current = template.markdown;
    setStatus(`${template.label} template loaded`);
  }

  async function restoreHistorySnapshot(id: string) {
    if (browserMode) {
      const snapshot = readBrowserHistory().find((item) => item.entry.id === id);
      if (!snapshot) {
        setStatus("History snapshot not found");
        return;
      }
      if (!(await confirmRestoreSnapshot())) return;

      setMarkdown(snapshot.contents);
      setSavedMarkdown(snapshot.contents);
      setFileName(snapshot.entry.file_name);
      setSelectedHistory(null);
      setFileChangeNotice(null);
      setHistoryOpen(false);
      browserHistoryBaseline.current = snapshot.contents;
      setStatus("Browser history restored");
      await refreshHistory();
      return;
    }

    if (id.startsWith("draft-")) {
      const snapshot = readDraftHistory().find((item) => item.entry.id === id);
      if (!snapshot) {
        setStatus("History snapshot not found");
        return;
      }
      if (!(await confirmRestoreSnapshot())) return;

      setMarkdown(snapshot.contents);
      setSavedMarkdown(snapshot.contents);
      setFilePath(null);
      setFileName(snapshot.entry.file_name);
      setSelectedHistory(null);
      setFileChangeNotice(null);
      setHistoryOpen(false);
      draftHistoryBaseline.current = snapshot.contents;
      setStatus("Draft history restored");
      await refreshHistory();
      return;
    }

    if (!nativeApi) return;

    try {
      const snapshot = await nativeApi.readHistorySnapshot(id);
      if (!(await confirmRestoreSnapshot())) return;
      setMarkdown(snapshot.contents);
      setSavedMarkdown(snapshot.contents);
      setFilePath(snapshot.entry.file_path);
      setFileName(snapshot.entry.file_name);
      setStatus("History restored");
      setFileChangeNotice(null);
      setHistoryOpen(false);
      await refreshHistory(snapshot.entry.file_path);
    } catch (error) {
      setErrorStatus("Restore history", error);
    }
  }

  async function previewHistorySnapshot(id: string) {
    if (browserMode) {
      const snapshot = readBrowserHistory().find((item) => item.entry.id === id);
      if (snapshot) {
        setSelectedHistory(snapshot);
      } else {
        setStatus("History snapshot not found");
      }
      return;
    }

    if (id.startsWith("draft-")) {
      const snapshot = readDraftHistory().find((item) => item.entry.id === id);
      if (snapshot) {
        setSelectedHistory(snapshot);
      } else {
        setStatus("History snapshot not found");
      }
      return;
    }

    if (!nativeApi) return;

    try {
      const snapshot = await nativeApi.readHistorySnapshot(id);
      setSelectedHistory(snapshot);
    } catch (error) {
      setErrorStatus("Preview history", error);
    }
  }

  async function deleteHistorySnapshot(id: string) {
    if (browserMode) {
      const snapshots = readBrowserHistory().filter((snapshot) => snapshot.entry.id !== id);
      writeBrowserHistory(snapshots);
      setHistoryEntries(snapshots.map((snapshot) => snapshot.entry));
      if (selectedHistory?.entry.id === id) {
        setSelectedHistory(null);
      }
      setStatus("Browser history snapshot deleted");
      return;
    }

    if (id.startsWith("draft-")) {
      const snapshots = readDraftHistory().filter((snapshot) => snapshot.entry.id !== id);
      writeDraftHistory(snapshots);
      setHistoryEntries(snapshots.map((snapshot) => snapshot.entry));
      if (selectedHistory?.entry.id === id) {
        setSelectedHistory(null);
      }
      setStatus("Draft history snapshot deleted");
      return;
    }

    if (!nativeApi) return;

    try {
      await nativeApi.deleteHistorySnapshot(id);
      if (selectedHistory?.entry.id === id) {
        setSelectedHistory(null);
      }
      await refreshHistory();
      setStatus("History snapshot deleted");
    } catch (error) {
      setErrorStatus("Delete history", error);
    }
  }

  async function loadDroppedFile(file: File) {
    if (!(await confirmDiscardChanges())) return;

    if (file.type.startsWith("image/")) {
      setStatus("Image attachments are a desktop feature");
      setDesktopPrompt("Local image attachments need Desktop so VeloWrite can work with files on your computer.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const contents = String(reader.result ?? "");
      loadDocument({ path: "", name: file.name, contents });
      setFilePath(null);
      setStatus("Dropped file opened");
    };
    reader.onerror = () => setStatus("Drop open failed");
    reader.readAsText(file);
  }

  async function openNativePath(path: string, successStatus: string, errorAction: string) {
    if (!nativeApi) return;
    if (!(await confirmDiscardChanges())) return;

    try {
      const nextFile = await nativeApi.openRecentMarkdownFile(path);
      loadDocument(nextFile);
      setStatus(successStatus);
    } catch (error) {
      setErrorStatus(errorAction, error);
    }
  }

  function handleDragOver(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(event: React.DragEvent<HTMLElement>) {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    setDragActive(false);
  }

  async function handleDrop(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    setDragActive(false);

    if (nativeApi) return;

    const file = event.dataTransfer.files[0];
    if (!file) return;
    await loadDroppedFile(file);
  }

  function syncPreviewScroll(ratio: number) {
    if (viewMode !== "split") return;
    if (suppressPreviewSync.current) return;
    if (scrollSource.current === "preview") {
      scrollSource.current = null;
      return;
    }

    const nextRatio = Math.min(1, Math.max(0, ratio));
    if (previewScrollFrame.current) {
      window.cancelAnimationFrame(previewScrollFrame.current);
    }

    scrollSource.current = "editor";
    previewScrollFrame.current = window.requestAnimationFrame(() => {
      const preview = previewRef.current;
      if (!preview) return;

      const scrollRange = preview.scrollHeight - preview.clientHeight;
      preview.scrollTop = scrollRange > 0 ? scrollRange * nextRatio : 0;
      window.setTimeout(() => {
        if (scrollSource.current === "editor") scrollSource.current = null;
      }, 120);
    });
  }

  function syncEditorScroll(ratio: number) {
    if (viewMode !== "split") return;
    if (scrollSource.current === "editor") {
      scrollSource.current = null;
      return;
    }

    scrollSource.current = "preview";
    setEditorScrollRatio(Math.min(1, Math.max(0, ratio)));
    window.setTimeout(() => {
      if (scrollSource.current === "preview") scrollSource.current = null;
    }, 120);
  }

  function scrollEditorToLine(line: number) {
    setEditorScrollTarget((current) => ({
      line,
      nonce: (current?.nonce ?? 0) + 1,
    }));
  }

  function scrollPreviewToHeading(id: string) {
    const preview = previewRef.current;
    const target = preview?.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    if (!preview || !target) return;

    const previewRect = preview.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    preview.scrollTop = Math.max(0, preview.scrollTop + targetRect.top - previewRect.top);
  }

  function scrollToHeading(id: string) {
    const line = findHeadingLine(markdown, id);
    setActiveHeadingId(id);
    suppressPreviewSync.current = true;
    if (viewMode !== "split") {
      setViewMode("split");
    }

    afterNextPaint(() => {
      scrollPreviewToHeading(id);

      if (line) {
        scrollEditorToLine(line);
        window.setTimeout(() => scrollEditorToLine(line), 80);
        window.setTimeout(() => {
          scrollEditorToLine(line);
          scrollPreviewToHeading(id);
        }, 220);
      }

      window.setTimeout(() => {
        suppressPreviewSync.current = false;
      }, 360);
    });
  }

  return (
    <main
      className={`app-shell theme-${resolvedTheme} reading-palette-${readingPalette} reading-font-${readingFont}${browserMode ? " browser-surface" : " desktop-surface"}${desktopSurface && !sidebarOpen ? " desktop-focus" : ""}${focusMode ? " writing-focus" : ""}${dragActive ? " drag-active" : ""}`}
      aria-label="VeloWrite editor"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(event) => void handleDrop(event)}
    >
      <input
        ref={fileInput}
        className="hidden-input"
        type="file"
        accept=".md,.markdown,.mdown,text/markdown,text/plain"
        onChange={openBrowserFile}
      />

      <aside className="sidebar">
        {browserMode ? (
          <a className="brand brand-link" href="/">
            <div className="brand-mark">V</div>
            <div>
              <strong>VeloWrite</strong>
              <span>{webSurface ? "Web editor" : "Browser preview"}</span>
            </div>
          </a>
        ) : (
          <div className="brand">
            <div className="brand-mark">V</div>
            <div>
              <strong>VeloWrite</strong>
              <span>Desktop workspace</span>
            </div>
          </div>
        )}

        {browserMode && (
          <section
            className={dirty ? "browser-panel compact" : "browser-panel"}
            aria-label="Browser mode"
          >
            <strong>{webSurface ? "Web editor" : "Browser mode"}</strong>
            <span>
              {dirty
                ? "Draft and history are stored in this browser."
                : "Your draft and browser history stay on this device. Desktop adds local folders, direct save, offline work, and file history."}
            </span>
            {!dirty && (
              <a href={desktopDownloadHref}>
                <MonitorDown size={14} />
                Get desktop
              </a>
            )}
          </section>
        )}

        {!desktopSurface && (
          <nav className="nav-list" aria-label="Documents">
            <button className="nav-item active" onClick={() => void newFileWithGuard()}>
              <FileText size={16} />
              {fileName}
            </button>
            <button className="nav-item muted" disabled>
              <Braces size={16} />
              AI commands soon
            </button>
            <button
              className="nav-item muted"
              onClick={() => {
                setStatus("Folder vaults need VeloWrite Desktop for native file access");
                setDesktopPrompt("Folder vaults need Desktop for native file access, offline work, and local history.");
              }}
            >
              <FolderPlus size={16} />
              Open folder
            </button>
            <button className="nav-item" onClick={() => void openHistoryPanel()}>
              <GitBranch size={16} />
              History
              {historyEntries.length > 0 && <span>{historyEntries.length}</span>}
            </button>
          </nav>
        )}

        {!desktopSurface && nativeApi && recentFiles.length > 0 && (
          <section className="recent-panel" aria-label="Recent files">
            <div className="outline-title">Recent</div>
            <div className="recent-list">
              {recentFiles.map((file) => (
                <button
                  key={file.path}
                  className="recent-item"
                  title={normalizeDisplayedPath(file.path)}
                  onClick={() => void openRecentFile(file.path)}
                >
                  <FileText size={14} />
                  <span>{getRecentFileLabel(file)}</span>
                </button>
              ))}
              <button className="recent-clear" onClick={clearRecentFiles}>
                <Trash2 size={14} />
                <span>Clear recent</span>
              </button>
            </div>
          </section>
        )}

        {!desktopSurface && recentFiles.length === 0 && (
          <WelcomePanel
            nativeReady={Boolean(nativeApi)}
            hasRecentFiles={recentFiles.length > 0}
            onNew={() => void newFileWithGuard()}
            onOpen={() => void openFileWithGuard()}
            onTemplate={(template) => void startFromTemplate(template)}
          />
        )}

        <section className="outline-panel" aria-label="Document outline">
          <div className="outline-title">Outline</div>
          <div className="structure-map" aria-label="Document structure map">
            <div>
              <strong>{headingSummary.total}</strong>
              <span>Headings</span>
            </div>
            <div>
              <strong>{headingSummary.h1}</strong>
              <span>H1</span>
            </div>
            <div>
              <strong>{headingSummary.h2}</strong>
              <span>H2</span>
            </div>
            <div>
              <strong>{headingSummary.h3}</strong>
              <span>H3</span>
            </div>
          </div>
          {headings.length > 0 ? (
            <div className="outline-list">
              {headings.map((heading) => (
                <button
                  key={heading.id}
                  className="outline-item"
                  data-level={heading.level}
                  data-active={activeHeadingId === heading.id ? "true" : undefined}
                  aria-current={activeHeadingId === heading.id ? "location" : undefined}
                  onClick={() => scrollToHeading(heading.id)}
                >
                  <span>H{heading.level}</span>
                  {heading.text}
                </button>
              ))}
            </div>
          ) : (
            <p>No headings yet</p>
          )}
        </section>

        {!desktopSurface && (
          <>
            <ExportReadinessPanel
              readiness={exportReadiness}
              onDownloadMarkdown={downloadMarkdown}
              onExportHtml={() => void exportHtml()}
              onPrintPdf={() => void printOrSavePdf()}
              showPrint
            />

            <div className="sync-panel">
              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={autoSaveFile}
                  disabled={!nativeApi || !filePath}
                  onChange={(event) => setAutoSaveFile(event.target.checked)}
                />
                <span>Autosave file</span>
              </label>
              <div className="sync-row">
                <Check size={16} />
                <span>{status}</span>
              </div>
              <div className="sync-row muted">
                <UploadCloud size={16} />
                <span>{browserMode ? "Browser history stays local" : "Private sync planned"}</span>
              </div>
            </div>
          </>
        )}
      </aside>

      <section className="workspace">
        {desktopSurface && focusMode && (
          <button
            className="focus-exit"
            aria-label="Exit fullscreen focus"
            title="Exit fullscreen focus"
            onClick={() => setFocusMode(false)}
            type="button"
          >
            <Minimize2 size={16} />
            Exit Focus
          </button>
        )}
        {browserMode && (
          <a className="mobile-editor-brand" href="/">
            <span className="brand-mark">V</span>
            <span>VeloWrite</span>
          </a>
        )}
        <header className="topbar">
          <div className="topbar-start">
            {desktopSurface && (
              <button
                className="sidebar-toggle"
                aria-label={sidebarOpen ? "Hide workspace" : "Show workspace"}
                title={sidebarOpen ? "Hide workspace" : "Show workspace"}
                onClick={() => setSidebarOpen((current) => !current)}
                type="button"
              >
                {sidebarOpen ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
              </button>
            )}
            {desktopSurface && (
              <button
                className="sidebar-toggle"
                aria-label={focusMode ? "Exit fullscreen focus" : "Enter fullscreen focus"}
                title={focusMode ? "Exit fullscreen focus" : "Enter fullscreen focus"}
                onClick={() => setFocusMode((current) => !current)}
                type="button"
              >
                {focusMode ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
              </button>
            )}
            <div className="traffic" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="search">
            <Search size={15} />
            <span>
              {filePath ? desktopPathLabel : fileName}
            </span>
          </div>
          <div className="actions">
            {browserMode && (
              <button className="desktop-cta" onClick={handoffToDesktop} type="button">
                <MonitorDown size={16} />
                Desktop
              </button>
            )}
            <div className="mode-toggle" aria-label="View mode">
              <button
                className={viewMode === "write" ? "active" : ""}
                onClick={() => setViewMode("write")}
              >
                Write
              </button>
              <button
                className={viewMode === "split" ? "active" : ""}
                onClick={() => setViewMode("split")}
              >
                Split
              </button>
              <button
                className={viewMode === "preview" ? "active" : ""}
                onClick={() => setViewMode("preview")}
              >
                Preview
              </button>
            </div>
            <div className="action-group file-actions" aria-label="File actions">
              <button
                aria-label="New file"
                title="New file"
                className="new-file-action"
                onClick={() => void newFileWithGuard()}
                type="button"
              >
                <FileText size={17} />
              </button>
              <button
                aria-label="Open file"
                title="Open file"
                className="open-file-action"
                onClick={() => void openFileWithGuard()}
                type="button"
              >
                <FolderOpen size={17} />
              </button>
              <button
                aria-label={browserMode ? "Download Markdown file" : "Save Markdown file"}
                title={browserMode ? "Download Markdown file" : "Save Markdown file"}
                className="save-file-action"
                onClick={() => void saveFile()}
                type="button"
              >
                <Save size={17} />
              </button>
            </div>
            <div className="action-group export-actions" aria-label="Output actions">
              <button
                aria-label={browserMode ? "Download HTML file" : "Export HTML file"}
                title={browserMode ? "Download HTML file" : "Export HTML file"}
                className="export-html-action"
                onClick={() => void exportHtml()}
                type="button"
              >
                <FormatIcon label="HTML" />
              </button>
              <button
                aria-label="Export PDF file"
                title="Export PDF file"
                className="optional-action print-pdf-action"
                onClick={() => void printOrSavePdf()}
                type="button"
              >
                <FormatIcon label="PDF" />
              </button>
              <button
                aria-label="Copy Markdown to clipboard"
                title="Copy Markdown to clipboard"
                className="optional-action copy-markdown-action"
                onClick={copyMarkdown}
                type="button"
              >
                <Copy size={17} />
              </button>
              <button
                aria-label="Copy rendered HTML to clipboard"
                title="Copy rendered HTML to clipboard"
                className="optional-action copy-html-action"
                onClick={copyRenderedHtml}
                type="button"
              >
                <Code2 size={17} />
              </button>
            </div>
            <div className="action-group workspace-actions" aria-label="Workspace actions">
              <button className="ai-action" aria-label="AI assist" title="AI assist coming soon" disabled>
                <Bot size={17} />
              </button>
              <button
                aria-label="History"
                title="History"
                className="history-action"
                onClick={() => void openHistoryPanel()}
                type="button"
              >
                <GitBranch size={17} />
              </button>
              <button className="publish-action" aria-label="Publish" title="Publish coming soon" disabled>
                <Rocket size={17} />
              </button>
              <button
                aria-label="Settings"
                title="Settings"
                className="settings-action"
                onClick={() => setSettingsOpen(true)}
                type="button"
              >
                <Settings size={17} />
              </button>
              <button className="about-action" aria-label="About" title="About" onClick={() => setAboutOpen(true)} type="button">
                <Info size={17} />
              </button>
            </div>
          </div>
        </header>

        {desktopSurface && updateNotice.state === "available" && (
          <aside className="desktop-update-banner" aria-label="Update available">
            <div>
              <strong>Update available</strong>
              <span>
                V{updateNotice.latestVersion} is out since {updateNotice.releaseDate}.
              </span>
            </div>
            <a href={updateNotice.releaseUrl} target="_blank" rel="noreferrer">
              View release
            </a>
          </aside>
        )}

        {desktopSurface && fileChangeNotice && (
          <aside className="file-change-banner" aria-label="File changed on disk">
            <div>
              <strong>File changed on disk</strong>
              <span>{fileChangeNotice}</span>
            </div>
            <div className="file-change-actions">
              <button onClick={() => void reloadFileFromDisk()} type="button">
                Reload
              </button>
              <button onClick={() => setFileChangeNotice(null)} type="button">
                Keep current
              </button>
            </div>
          </aside>
        )}

        {desktopSurface && (
          <section className="desktop-file-state" aria-label="Current file status">
            <div>
              <span>File</span>
              <strong>{fileName}</strong>
            </div>
            <div>
              <span>{filePath ? "Path" : "Draft"}</span>
              <strong title={desktopPathLabel}>{desktopPathLabel}</strong>
            </div>
            <div>
              <span>History</span>
              <strong>{historyTrustLabel}</strong>
            </div>
            <div>
              <span>Save</span>
              <strong>{saveTrustLabel}</strong>
            </div>
          </section>
        )}

        {showDesktopStart && (
          <DesktopStartPanel
            recentFiles={recentFiles}
            historyCount={historyEntries.length}
            currentDraftName={fileName}
            onOpen={() => void openFileWithGuard()}
            onNew={() => void newFileWithGuard()}
            onContinue={() => {
              setStartPanelDismissed(true);
              setStatus("Continuing current draft");
            }}
            onTemplate={(template) => void startFromTemplate(template)}
            onRecent={(path) => void openRecentFile(path)}
            onHistory={() => void openHistoryPanel()}
          />
        )}

        <div className={`editor-grid mode-${viewMode}`}>
          <section className="editor-pane" aria-label="Markdown editor">
            <div className="pane-title">
              <span>Markdown</span>
              <span className={dirty ? "status-dot dirty" : "status-dot"}>
                {dirty ? "Unsaved" : "Saved"}
              </span>
            </div>
            <MarkdownEditor
              value={markdown}
              onChange={setMarkdown}
              onScroll={syncPreviewScroll}
              fontSize={editorFontSize}
              scrollTarget={editorScrollTarget}
              scrollRatio={editorScrollRatio}
            />
          </section>

          <section className="preview-pane" aria-label="Rendered preview">
            <div className="pane-title">
              <span>Live Preview</span>
            </div>
            <article
              ref={previewRef}
              className="markdown-body"
              onScroll={(event) => {
                const preview = event.currentTarget;
                const scrollRange = preview.scrollHeight - preview.clientHeight;
                syncEditorScroll(scrollRange > 0 ? preview.scrollTop / scrollRange : 0);
              }}
              dangerouslySetInnerHTML={{ __html: rendered }}
            />
          </section>
        </div>

        <footer className="statusbar">
          <span className="trust-pill">
            <FolderOpen size={13} />
            {fileTrustLabel}
          </span>
          <span className={dirty ? "trust-pill warning" : "trust-pill"}>
            <Check size={13} />
            {saveTrustLabel}
          </span>
          <button className="trust-pill trust-button" onClick={() => void openHistoryPanel()} type="button">
            <GitBranch size={13} />
            {historyTrustLabel}
          </button>
          <span>{metrics.words} words</span>
          <span>{metrics.characters} chars</span>
          <span>{metrics.lines} lines</span>
          <span>{metrics.readingMinutes} min read</span>
        </footer>
        {statusToast && (
          <div className="status-toast" role="status" aria-live="polite">
            <Check size={14} />
            <span>{statusToast}</span>
          </div>
        )}
        {browserMode && desktopPrompt && (
          <aside className="desktop-prompt" aria-label="Desktop upgrade prompt">
            <button
              className="desktop-prompt-close"
              aria-label="Dismiss desktop prompt"
              onClick={() => setDesktopPrompt(null)}
              type="button"
            >
              x
            </button>
            <MonitorDown size={18} />
            <div>
              <strong>Continue in Desktop</strong>
              <p>{desktopPrompt}</p>
            </div>
            <div className="desktop-prompt-actions">
              {desktopHandoffUrl && (
                <a href={desktopHandoffUrl}>
                  Open in Desktop <ExternalLink size={14} />
                </a>
              )}
              <button onClick={downloadMarkdown} type="button">
                Download backup <Download size={14} />
              </button>
              <a href={desktopDownloadHref}>
                Get app <MonitorDown size={14} />
              </a>
            </div>
          </aside>
        )}
        {dragActive && <div className="drop-overlay">Drop Markdown file to open</div>}
        {settingsOpen && (
          <SettingsPanel
            themeMode={themeMode}
            readingPalette={readingPalette}
            readingFont={readingFont}
            editorFontSize={editorFontSize}
            defaultViewMode={viewMode}
            pdfExportStyle={pdfExportStyle}
            onThemeModeChange={setThemeMode}
            onReadingPaletteChange={setReadingPalette}
            onReadingFontChange={setReadingFont}
            onEditorFontSizeChange={setEditorFontSize}
            onDefaultViewModeChange={setViewMode}
            onPdfExportStyleChange={setPdfExportStyle}
            onClose={() => setSettingsOpen(false)}
          />
        )}
        {historyOpen && (
          <HistoryPanel
            entries={historyEntries}
            selectedSnapshot={selectedHistory}
            currentMarkdown={markdown}
            hasLocalFile={Boolean(filePath)}
            scope={browserMode ? "browser" : filePath ? "desktop" : "draft"}
            onPreview={(id) => void previewHistorySnapshot(id)}
            onRestore={(id) => void restoreHistorySnapshot(id)}
            onDelete={(id) => void deleteHistorySnapshot(id)}
            onRefresh={() => void refreshHistory()}
            onClose={() => setHistoryOpen(false)}
          />
        )}
        {aboutOpen && <AboutPanel onClose={() => setAboutOpen(false)} />}
      </section>
    </main>
  );
}
