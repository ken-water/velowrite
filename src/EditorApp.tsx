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
} from "lucide-react";
import {
  buildHtmlDocument,
  extractHeadings,
  getMetrics,
  renderMarkdown,
  slugify,
} from "./markdown";
import { complexDemoMarkdown } from "./sampleMarkdown";

type ViewMode = "split" | "write" | "preview";
type ThemeMode = "light" | "dark" | "system";
type EditorSurface = "desktop" | "web" | "embedded";

type NativeApi = {
  openMarkdownFile: () => Promise<NativeFile | null>;
  openRecentMarkdownFile: (path: string) => Promise<NativeFile>;
  saveMarkdownFile: (path: string | null, contents: string) => Promise<string | null>;
  exportHtmlFile: (defaultName: string, html: string) => Promise<string | null>;
  createHistorySnapshot: (
    filePath: string,
    fileName: string,
    contents: string,
  ) => Promise<HistoryEntry>;
  listHistorySnapshots: (filePath: string) => Promise<HistoryEntry[]>;
  readHistorySnapshot: (id: string) => Promise<HistorySnapshot>;
  deleteHistorySnapshot: (id: string) => Promise<void>;
  listenMenuCommand: (handler: (command: string) => void) => Promise<() => void>;
  listenCloseRequested: (handler: () => Promise<boolean>) => Promise<() => void>;
  listenPathDrop: (handler: (paths: string[]) => void) => Promise<() => void>;
  closeWindow: () => Promise<void>;
  setWindowTitle: (title: string) => Promise<void>;
};

type NativeFile = {
  path: string;
  name: string;
  contents: string;
};

type RecentFile = {
  path: string;
  name: string;
};

type HistoryEntry = {
  id: string;
  file_path: string;
  file_name: string;
  snapshot_path: string;
  created_at: number;
  size: number;
};

type HistorySnapshot = {
  entry: HistoryEntry;
  contents: string;
};

const draftKey = "velowrite:draft";
const draftNameKey = "velowrite:draft-name";
const recentFilesKey = "velowrite:recent-files";
const autoSaveFileKey = "velowrite:auto-save-file";
const themeModeKey = "velowrite:theme-mode";
const editorFontSizeKey = "velowrite:editor-font-size";
const defaultViewModeKey = "velowrite:default-view-mode";
const desktopDownloadHref = "/download?utm_source=web_editor&utm_medium=cta";

function createEditorTheme(fontSize: number) {
  return EditorView.theme({
  "&": {
    height: "100%",
    backgroundColor: "transparent",
    color: "var(--editor-text)",
    fontSize: `${fontSize}px`,
  },
  ".cm-scroller": {
    fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
    lineHeight: "1.78",
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
    backgroundColor: "var(--active-line)",
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

const defaultMarkdown = complexDemoMarkdown;

function useNativeApi(): NativeApi | null {
  const [api, setApi] = React.useState<NativeApi | null>(null);

  React.useEffect(() => {
    const isTauri = "__TAURI_INTERNALS__" in window;
    if (!isTauri) return;

    let cancelled = false;
    async function loadApi() {
      const [{ invoke }, dialog, windowApi, eventApi] = await Promise.all([
        import("@tauri-apps/api/core"),
        import("@tauri-apps/plugin-dialog"),
        import("@tauri-apps/api/window"),
        import("@tauri-apps/api/event"),
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
          return invoke<string>("write_markdown_file", { path: target, contents: html });
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

function getStoredRecentFiles(): RecentFile[] {
  try {
    const value = localStorage.getItem(recentFilesKey);
    if (!value) return [];
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is RecentFile => {
        return (
          item &&
          typeof item.path === "string" &&
          item.path.length > 0 &&
          typeof item.name === "string"
        );
      })
      .slice(0, 8);
  } catch {
    return [];
  }
}

function storeRecentFiles(files: RecentFile[]) {
  localStorage.setItem(recentFilesKey, JSON.stringify(files.slice(0, 8)));
}

function getStoredViewMode(): ViewMode {
  const value = localStorage.getItem(defaultViewModeKey);
  return value === "write" || value === "preview" || value === "split" ? value : "split";
}

function getStoredThemeMode(): ThemeMode {
  const value = localStorage.getItem(themeModeKey);
  return value === "dark" || value === "system" || value === "light" ? value : "system";
}

function getStoredEditorFontSize() {
  const value = Number(localStorage.getItem(editorFontSizeKey));
  if (!Number.isFinite(value)) return 15;
  return Math.min(22, Math.max(12, value));
}

function MarkdownEditor({
  value,
  onChange,
  onScroll,
  fontSize,
  scrollTarget,
}: {
  value: string;
  onChange: (value: string) => void;
  onScroll: (ratio: number) => void;
  fontSize: number;
  scrollTarget: { line: number; nonce: number } | null;
}) {
  const container = React.useRef<HTMLDivElement>(null);
  const view = React.useRef<EditorView | null>(null);
  const onChangeRef = React.useRef(onChange);
  const onScrollRef = React.useRef(onScroll);

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
  editorFontSize,
  defaultViewMode,
  onThemeModeChange,
  onEditorFontSizeChange,
  onDefaultViewModeChange,
  onClose,
}: {
  themeMode: ThemeMode;
  editorFontSize: number;
  defaultViewMode: ViewMode;
  onThemeModeChange: (mode: ThemeMode) => void;
  onEditorFontSizeChange: (size: number) => void;
  onDefaultViewModeChange: (mode: ViewMode) => void;
  onClose: () => void;
}) {
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

        <div className="settings-group">
          <label>Theme</label>
          <div className="settings-segment">
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
          <div className="settings-segment">
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
      </section>
    </div>
  );
}

function HistoryPanel({
  entries,
  selectedSnapshot,
  onPreview,
  onRestore,
  onDelete,
  onRefresh,
  onClose,
}: {
  entries: HistoryEntry[];
  selectedSnapshot: HistorySnapshot | null;
  onPreview: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  onClose: () => void;
}) {
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
            <pre className="history-preview">
              {selectedSnapshot?.contents || "Select a snapshot to preview."}
            </pre>
          </div>
        ) : (
          <p className="empty-state">No snapshots yet. Save changes to create history.</p>
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
          A lightweight, local-first Markdown editor built with Tauri. Current
          focus: fast editing, clean preview, reliable local files, and
          recoverable history.
        </p>

        <div className="about-links">
          {links.map(([label, href]) => (
            <a key={href} href={href} target="_blank" rel="noreferrer">
              <span>{label}</span>
              <ExternalLink size={14} />
            </a>
          ))}
        </div>

        <div className="about-note">
          <strong>Feedback wanted</strong>
          <span>
            If a Markdown workflow feels slow, fragile, or confusing, please
            send feedback. Real usage reports will shape the next release.
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
}: {
  nativeReady: boolean;
  hasRecentFiles: boolean;
  onNew: () => void;
  onOpen: () => void;
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
      {!nativeReady && (
        <p>Browser preview mode can import and download files. Desktop mode enables native save dialogs and history.</p>
      )}
      {nativeReady && !hasRecentFiles && <p>Recent files will appear here after your first desktop save.</p>}
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
  const autoSaveTimer = React.useRef<number | null>(null);
  const menuHandlerRef = React.useRef<(command: string) => void>(() => undefined);
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
  const [viewMode, setViewMode] = React.useState<ViewMode>(() => {
    return initialViewMode ?? getStoredViewMode();
  });
  const [themeMode, setThemeMode] = React.useState<ThemeMode>(getStoredThemeMode);
  const [systemDark, setSystemDark] = React.useState(() => {
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  });
  const [editorFontSize, setEditorFontSize] = React.useState(getStoredEditorFontSize);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [historyEntries, setHistoryEntries] = React.useState<HistoryEntry[]>([]);
  const [selectedHistory, setSelectedHistory] = React.useState<HistorySnapshot | null>(null);
  const [editorScrollTarget, setEditorScrollTarget] = React.useState<{ line: number; nonce: number } | null>(null);
  const [autoSaveFile, setAutoSaveFile] = React.useState(() => {
    return localStorage.getItem(autoSaveFileKey) === "true";
  });
  const [dragActive, setDragActive] = React.useState(false);
  const headings = React.useMemo(() => extractHeadings(markdown), [markdown]);
  const metrics = React.useMemo(() => getMetrics(markdown), [markdown]);
  const rendered = React.useMemo(() => renderMarkdown(markdown, headings), [headings, markdown]);
  const dirty = markdown !== savedMarkdown;
  const browserMode = !nativeApi;
  const webSurface = surface === "web";
  const resolvedTheme = themeMode === "system" ? (systemDark ? "dark" : "light") : themeMode;

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
    localStorage.setItem(editorFontSizeKey, String(editorFontSize));
  }, [editorFontSize]);

  React.useEffect(() => {
    localStorage.setItem(defaultViewModeKey, viewMode);
  }, [viewMode]);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      localStorage.setItem(draftKey, markdown);
      localStorage.setItem(draftNameKey, fileName);
      setStatus(dirty ? "Draft autosaved" : "Saved");
    }, 350);

    return () => window.clearTimeout(timer);
  }, [dirty, fileName, markdown]);

  React.useEffect(() => {
    localStorage.setItem(autoSaveFileKey, String(autoSaveFile));
  }, [autoSaveFile]);

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
      if (command === "clear-recent") clearRecentFiles();
      if (command === "view-write") setViewMode("write");
      if (command === "view-split") setViewMode("split");
      if (command === "view-preview") setViewMode("preview");
      if (command === "exit") void closeAppWithGuard();
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
      if (path) void openDroppedPath(path);
    }).then((cleanup) => {
      unlistenDrop = cleanup;
    });

    return () => {
      unlistenClose?.();
      unlistenDrop?.();
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

  function loadDocument(nextFile: NativeFile) {
    setMarkdown(nextFile.contents);
    setSavedMarkdown(nextFile.contents);
    setFilePath(nextFile.path);
    setFileName(nextFile.name || "Untitled.md");
    setStatus("Opened");
    rememberRecentFile(nextFile.path, nextFile.name || "Untitled.md");
    void refreshHistory(nextFile.path);
  }

  async function refreshHistory(path = filePath) {
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

  async function saveFile(options?: { silent?: boolean }) {
    if (nativeApi) {
      try {
        if (filePath && savedMarkdown && savedMarkdown !== markdown) {
          await nativeApi.createHistorySnapshot(filePath, fileName, savedMarkdown);
        }
        const savedPath = await nativeApi.saveMarkdownFile(filePath, markdown);
        if (!savedPath) return;
        setFilePath(savedPath);
        setFileName(savedPath.split(/[\\/]/).pop() || fileName);
        setSavedMarkdown(markdown);
        setStatus(options?.silent ? "Autosaved to file" : "Saved");
        rememberRecentFile(savedPath, savedPath.split(/[\\/]/).pop() || fileName);
        await refreshHistory(savedPath);
      } catch (error) {
        setErrorStatus("Save", error);
      }
      return;
    }

    downloadMarkdown();
    setSavedMarkdown(markdown);
    setStatus("Downloaded Markdown copy");
  }

  function downloadMarkdown() {
    downloadTextFile(
      fileName.endsWith(".md") ? fileName : `${fileName}.md`,
      markdown,
      "text/markdown;charset=utf-8",
    );
  }

  async function exportHtml() {
    const baseName = fileName.replace(/\.(md|markdown|mdown)$/i, "") || "Untitled";
    const html = buildHtmlDocument(baseName, rendered);

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

  async function newFileWithGuard() {
    if (!(await confirmDiscardChanges())) return;
    newFile();
  }

  function newFile() {
    const blankDocument = "# Untitled\n\nStart writing...\n";
    setMarkdown(blankDocument);
    setSavedMarkdown(blankDocument);
    setFilePath(null);
    setFileName("Untitled.md");
    setHistoryEntries([]);
    setStatus("New file");
  }

  async function restoreHistorySnapshot(id: string) {
    if (!nativeApi) return;
    if (!(await confirmDiscardChanges())) return;

    try {
      const snapshot = await nativeApi.readHistorySnapshot(id);
      setMarkdown(snapshot.contents);
      setSavedMarkdown(snapshot.contents);
      setFilePath(snapshot.entry.file_path);
      setFileName(snapshot.entry.file_name);
      setStatus("History restored");
      setHistoryOpen(false);
      await refreshHistory(snapshot.entry.file_path);
    } catch (error) {
      setErrorStatus("Restore history", error);
    }
  }

  async function previewHistorySnapshot(id: string) {
    if (!nativeApi) return;

    try {
      const snapshot = await nativeApi.readHistorySnapshot(id);
      setSelectedHistory(snapshot);
    } catch (error) {
      setErrorStatus("Preview history", error);
    }
  }

  async function deleteHistorySnapshot(id: string) {
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

  async function openDroppedPath(path: string) {
    if (!nativeApi) return;
    if (!(await confirmDiscardChanges())) return;

    try {
      const nextFile = await nativeApi.openRecentMarkdownFile(path);
      loadDocument(nextFile);
      setStatus("Dropped file opened");
    } catch (error) {
      setErrorStatus("Drop open", error);
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
    if (previewScrollFrame.current) {
      window.cancelAnimationFrame(previewScrollFrame.current);
    }

    previewScrollFrame.current = window.requestAnimationFrame(() => {
      const preview = previewRef.current;
      if (!preview) return;

      const scrollRange = preview.scrollHeight - preview.clientHeight;
      preview.scrollTop = scrollRange > 0 ? scrollRange * ratio : 0;
    });
  }

  function scrollToHeading(id: string) {
    const line = findHeadingLine(markdown, id);
    if (viewMode !== "split") {
      setViewMode("split");
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const preview = previewRef.current;
        const target = preview?.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
        target?.scrollIntoView({ block: "start", behavior: "auto" });

        if (line) {
          setEditorScrollTarget((current) => ({
            line,
            nonce: (current?.nonce ?? 0) + 1,
          }));
        }
      });
    });
  }

  return (
    <main
      className={`app-shell theme-${resolvedTheme}${dragActive ? " drag-active" : ""}`}
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
        <div className="brand">
          <div className="brand-mark">V</div>
          <div>
            <strong>VeloWrite</strong>
            <span>{nativeApi ? "Desktop workspace" : webSurface ? "Web editor" : "Browser preview"}</span>
          </div>
        </div>

        {browserMode && (
          <section className="browser-panel" aria-label="Browser mode">
            <strong>{webSurface ? "Web editor" : "Browser mode"}</strong>
            <span>Your Markdown stays in this browser and drafts autosave locally. Desktop adds native folders, direct save, offline work, and history.</span>
            <a href={desktopDownloadHref}>
              <MonitorDown size={14} />
              Get desktop
            </a>
          </section>
        )}

        <nav className="nav-list" aria-label="Documents">
          <button className="nav-item active" onClick={() => void newFileWithGuard()}>
            <FileText size={16} />
            {fileName}
          </button>
          <button className="nav-item muted" disabled>
            <Braces size={16} />
            AI commands soon
          </button>
          {browserMode && (
            <button
              className="nav-item muted"
              onClick={() =>
                setStatus("Folder vaults need VeloWrite Desktop for native file access")
              }
            >
              <FolderPlus size={16} />
              Open folder
            </button>
          )}
          <button
            className={historyEntries.length > 0 ? "nav-item" : "nav-item muted"}
            disabled={!nativeApi || !filePath}
            onClick={() => {
              void refreshHistory();
              setHistoryOpen(true);
            }}
          >
            <GitBranch size={16} />
            {historyEntries.length} snapshots
          </button>
        </nav>

        {nativeApi && recentFiles.length > 0 && (
          <section className="recent-panel" aria-label="Recent files">
            <div className="outline-title">Recent</div>
            <div className="recent-list">
              {recentFiles.map((file) => (
                <button
                  key={file.path}
                  className="recent-item"
                  title={file.path}
                  onClick={() => void openRecentFile(file.path)}
                >
                  <FileText size={14} />
                  <span>{file.name}</span>
                </button>
              ))}
              <button className="recent-clear" onClick={clearRecentFiles}>
                <Trash2 size={14} />
                <span>Clear recent</span>
              </button>
            </div>
          </section>
        )}

        {recentFiles.length === 0 && (
          <WelcomePanel
            nativeReady={Boolean(nativeApi)}
            hasRecentFiles={recentFiles.length > 0}
            onNew={() => void newFileWithGuard()}
            onOpen={() => void openFileWithGuard()}
          />
        )}

        <section className="outline-panel" aria-label="Document outline">
          <div className="outline-title">Outline</div>
          {headings.length > 0 ? (
            <div className="outline-list">
              {headings.map((heading) => (
                <button
                  key={heading.id}
                  className="outline-item"
                  data-level={heading.level}
                  onClick={() => scrollToHeading(heading.id)}
                >
                  {heading.text}
                </button>
              ))}
            </div>
          ) : (
            <p>No headings yet</p>
          )}
        </section>

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
            <span>{browserMode ? "Native history in desktop" : "Private sync planned"}</span>
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="traffic" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="search">
            <Search size={15} />
            <span>{filePath || fileName}</span>
          </div>
          <div className="actions">
            {browserMode && (
              <a className="desktop-cta" href={desktopDownloadHref}>
                <MonitorDown size={16} />
                Desktop
              </a>
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
            <button
              aria-label="New file"
              title="New file"
              onClick={() => void newFileWithGuard()}
            >
              <FileText size={17} />
            </button>
            <button
              aria-label="Open file"
              title="Open file"
              onClick={() => void openFileWithGuard()}
            >
              <FolderOpen size={17} />
            </button>
            <button
              aria-label={browserMode ? "Download Markdown copy" : "Save file"}
              title={browserMode ? "Download Markdown copy" : "Save file"}
              onClick={() => void saveFile()}
            >
              <Save size={17} />
            </button>
            <button
              aria-label="Export HTML"
              title="Export HTML"
              onClick={() => void exportHtml()}
            >
              <Download size={17} />
            </button>
            <button aria-label="AI assist" title="AI assist coming soon" disabled>
              <Bot size={17} />
            </button>
            <button
              aria-label="History"
              title="History"
              disabled={!nativeApi || !filePath}
              onClick={() => {
                void refreshHistory();
                setHistoryOpen(true);
              }}
            >
              <GitBranch size={17} />
            </button>
            <button aria-label="Publish" title="Publish coming soon" disabled>
              <Rocket size={17} />
            </button>
            <button
              aria-label="Settings"
              title="Settings"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings size={17} />
            </button>
            <button aria-label="About" title="About" onClick={() => setAboutOpen(true)}>
              <Info size={17} />
            </button>
          </div>
        </header>

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
            />
          </section>

          <section className="preview-pane" aria-label="Rendered preview">
            <div className="pane-title">
              <span>Live Preview</span>
            </div>
            <article
              ref={previewRef}
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: rendered }}
            />
          </section>
        </div>

        <footer className="statusbar">
          <span className="shortcut-hint">Ctrl/Cmd O open</span>
          <span className="shortcut-hint">{browserMode ? "Ctrl/Cmd S download .md" : "Ctrl/Cmd S save"}</span>
          <span>{metrics.words} words</span>
          <span>{metrics.characters} chars</span>
          <span>{metrics.lines} lines</span>
          <span>{metrics.readingMinutes} min read</span>
        </footer>
        {dragActive && <div className="drop-overlay">Drop Markdown file to open</div>}
        {settingsOpen && (
          <SettingsPanel
            themeMode={themeMode}
            editorFontSize={editorFontSize}
            defaultViewMode={viewMode}
            onThemeModeChange={setThemeMode}
            onEditorFontSizeChange={setEditorFontSize}
            onDefaultViewModeChange={setViewMode}
            onClose={() => setSettingsOpen(false)}
          />
        )}
        {historyOpen && (
          <HistoryPanel
            entries={historyEntries}
            selectedSnapshot={selectedHistory}
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
