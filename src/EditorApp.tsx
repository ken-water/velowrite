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
  ClipboardCopy,
  Code2,
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
  getInitialDeepLinks: () => Promise<string[]>;
  listenDeepLinks: (handler: (urls: string[]) => void) => Promise<() => void>;
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

type HistoryScope = "desktop" | "browser" | "draft";

type BrowserHistoryRecord = {
  id: string;
  fileName: string;
  createdAt: number;
  contents: string;
};

type HandoffDraft = {
  name: string;
  markdown: string;
};

type EditorTemplate = {
  label: string;
  description: string;
  fileName: string;
  markdown: string;
};

type DiffLine = {
  type: "added" | "removed" | "unchanged" | "separator";
  text: string;
  currentLine?: number;
  snapshotLine?: number;
};

const draftKey = "velowrite:draft";
const draftNameKey = "velowrite:draft-name";
const recentFilesKey = "velowrite:recent-files";
const autoSaveFileKey = "velowrite:auto-save-file";
const themeModeKey = "velowrite:theme-mode";
const editorFontSizeKey = "velowrite:editor-font-size";
const defaultViewModeKey = "velowrite:default-view-mode";
const browserHistoryKey = "velowrite:browser-history";
const draftHistoryKey = "velowrite:draft-history";
export const freeHistorySnapshotLimit = 3;
const desktopDownloadHref = "/download?utm_source=web_editor&utm_medium=cta";
const desktopHandoffHref = "/download?utm_source=web_handoff&utm_medium=cta";
const desktopHandoffUrlLimit = 12000;
const friendlyDefaultMarkdown = `# Start Writing

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
    description: "A clean scratchpad for ideas, todos, or meeting follow-up.",
    fileName: "Quick Note.md",
    markdown:
      "# Quick Note\n\n## Summary\n\nWrite the main idea in one or two sentences.\n\n## Notes\n\n- First point\n- Second point\n\n## Next Actions\n\n- [ ] Follow up\n",
  },
  {
    label: "Meeting Notes",
    description: "Agenda, decisions, owners, and action items in one page.",
    fileName: "Meeting Notes.md",
    markdown:
      "# Meeting Notes\n\n**Date:** Today  \n**Attendees:** \n\n## Agenda\n\n1. Topic one\n2. Topic two\n\n## Decisions\n\n- Decision one\n\n## Action Items\n\n- [ ] Owner: next step\n",
  },
  {
    label: "README",
    description: "A practical project README with install, usage, and roadmap sections.",
    fileName: "README.md",
    markdown:
      "# Project Name\n\nA short description of what this project does and who it helps.\n\n## Install\n\n```bash\nnpm install\n```\n\n## Usage\n\n```bash\nnpm run dev\n```\n\n## Roadmap\n\n- [ ] First milestone\n- [ ] Next milestone\n",
  },
  {
    label: "Article Draft",
    description: "A lightweight outline for tutorials, product notes, and essays.",
    fileName: "Article Draft.md",
    markdown:
      "# Article Title\n\nStart with the reader's problem, then show the path forward.\n\n## Why this matters\n\nExplain the context in plain language.\n\n## Practical workflow\n\n1. Step one\n2. Step two\n3. Step three\n\n## Final notes\n\nSummarize what changed for the reader.\n",
  },
];

function encodeBase64Url(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.slice(index, index + chunkSize));
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new TextDecoder().decode(bytes);
}

function normalizeMarkdownFileName(name: string) {
  const fallback = "Web Draft.md";
  const cleaned = name
    .replace(/[\\/]/g, "-")
    .replace(/[^\p{L}\p{N}._ -]/gu, "")
    .trim()
    .slice(0, 120);
  const nextName = cleaned || fallback;
  return /\.(md|markdown|mdown)$/i.test(nextName) ? nextName : `${nextName}.md`;
}

export function createDesktopHandoffUrl(name: string, markdown: string) {
  const payload = encodeBase64Url(
    JSON.stringify({
      name: normalizeMarkdownFileName(name),
      markdown,
      source: "web",
      createdAt: Date.now(),
    }),
  );
  const url = `velowrite://import?payload=${payload}`;
  return url.length <= desktopHandoffUrlLimit ? url : null;
}

export function parseDesktopHandoffUrl(urlString: string): HandoffDraft | null {
  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    return null;
  }

  if (url.protocol !== "velowrite:") return null;
  const action = url.hostname || url.pathname.replace(/^\/+/, "");
  if (action !== "import") return null;

  const payload = url.searchParams.get("payload");
  if (!payload) return null;

  try {
    const parsed = JSON.parse(decodeBase64Url(payload));
    if (
      !parsed ||
      typeof parsed.markdown !== "string" ||
      typeof parsed.name !== "string"
    ) {
      return null;
    }

    return {
      name: normalizeMarkdownFileName(parsed.name),
      markdown: parsed.markdown,
    };
  } catch {
    return null;
  }
}

export function buildLineDiff(current: string, snapshot: string): DiffLine[] {
  const currentLines = current.split("\n");
  const snapshotLines = snapshot.split("\n");
  const rows = currentLines.length + 1;
  const cols = snapshotLines.length + 1;
  const table = Array.from({ length: rows }, () => Array<number>(cols).fill(0));

  for (let row = currentLines.length - 1; row >= 0; row -= 1) {
    for (let col = snapshotLines.length - 1; col >= 0; col -= 1) {
      table[row][col] =
        currentLines[row] === snapshotLines[col]
          ? table[row + 1][col + 1] + 1
          : Math.max(table[row + 1][col], table[row][col + 1]);
    }
  }

  const diff: DiffLine[] = [];
  let row = 0;
  let col = 0;

  while (row < currentLines.length && col < snapshotLines.length) {
    if (currentLines[row] === snapshotLines[col]) {
      diff.push({
        type: "unchanged",
        text: currentLines[row],
        currentLine: row + 1,
        snapshotLine: col + 1,
      });
      row += 1;
      col += 1;
    } else if (table[row + 1][col] >= table[row][col + 1]) {
      diff.push({ type: "removed", text: currentLines[row], currentLine: row + 1 });
      row += 1;
    } else {
      diff.push({ type: "added", text: snapshotLines[col], snapshotLine: col + 1 });
      col += 1;
    }
  }

  while (row < currentLines.length) {
    diff.push({ type: "removed", text: currentLines[row], currentLine: row + 1 });
    row += 1;
  }

  while (col < snapshotLines.length) {
    diff.push({ type: "added", text: snapshotLines[col], snapshotLine: col + 1 });
    col += 1;
  }

  return diff;
}

export function buildFocusedLineDiff(diff: DiffLine[], contextLines = 2): DiffLine[] {
  const changedIndexes = diff
    .map((line, index) => (line.type === "added" || line.type === "removed" ? index : -1))
    .filter((index) => index >= 0);

  if (!changedIndexes.length) return [];

  const visible = new Set<number>();
  for (const index of changedIndexes) {
    for (
      let next = Math.max(0, index - contextLines);
      next <= Math.min(diff.length - 1, index + contextLines);
      next += 1
    ) {
      visible.add(next);
    }
  }

  const result: DiffLine[] = [];
  let previousIndex = -1;
  const visibleIndexes = [...visible].sort((a, b) => a - b);
  for (const index of visibleIndexes) {
    if (previousIndex < 0 && index > 0) {
      result.push({ type: "separator", text: `${index} unchanged lines hidden` });
    } else if (previousIndex >= 0 && index > previousIndex + 1) {
      result.push({
        type: "separator",
        text: `${index - previousIndex - 1} unchanged lines hidden`,
      });
    }
    result.push(diff[index]);
    previousIndex = index;
  }

  const hiddenTail = diff.length - 1 - previousIndex;
  if (hiddenTail > 0) {
    result.push({ type: "separator", text: `${hiddenTail} unchanged lines hidden` });
  }

  return result;
}

function localHistoryRecordToSnapshot(
  record: BrowserHistoryRecord,
  storageKey: string,
  filePath: string,
): HistorySnapshot {
  return {
    entry: {
      id: record.id,
      file_path: filePath,
      file_name: record.fileName,
      snapshot_path: `localStorage:${storageKey}:${record.id}`,
      created_at: record.createdAt,
      size: new Blob([record.contents]).size,
    },
    contents: record.contents,
  };
}

export function readLocalHistory(storageKey: string, filePath: string): HistorySnapshot[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (record): record is BrowserHistoryRecord =>
          record &&
          typeof record.id === "string" &&
          typeof record.fileName === "string" &&
          typeof record.createdAt === "number" &&
          typeof record.contents === "string",
      )
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, freeHistorySnapshotLimit)
      .map((record) => localHistoryRecordToSnapshot(record, storageKey, filePath));
  } catch {
    return [];
  }
}

export function limitHistorySnapshots<T>(snapshots: T[]) {
  return snapshots.slice(0, freeHistorySnapshotLimit);
}

export function writeLocalHistory(storageKey: string, snapshots: HistorySnapshot[]) {
  const records: BrowserHistoryRecord[] = snapshots
    .slice(0, freeHistorySnapshotLimit)
    .map((snapshot) => ({
      id: snapshot.entry.id,
      fileName: snapshot.entry.file_name,
      createdAt: snapshot.entry.created_at,
      contents: snapshot.contents,
    }));

  localStorage.setItem(storageKey, JSON.stringify(records));
}

export function createLocalHistorySnapshot(
  storageKey: string,
  filePath: string,
  idPrefix: string,
  fileName: string,
  contents: string,
) {
  const snapshots = readLocalHistory(storageKey, filePath);
  if (snapshots[0]?.contents === contents) return snapshots;

  const record: BrowserHistoryRecord = {
    id: `${idPrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    fileName: normalizeMarkdownFileName(fileName),
    createdAt: Date.now(),
    contents,
  };
  const nextSnapshots = [
    localHistoryRecordToSnapshot(record, storageKey, filePath),
    ...snapshots.filter((snapshot) => snapshot.contents !== contents),
  ].slice(0, freeHistorySnapshotLimit);

  writeLocalHistory(storageKey, nextSnapshots);
  return nextSnapshots;
}

export function readBrowserHistory() {
  return readLocalHistory(browserHistoryKey, "browser:draft");
}

export function writeBrowserHistory(snapshots: HistorySnapshot[]) {
  writeLocalHistory(browserHistoryKey, snapshots);
}

export function createBrowserHistorySnapshot(fileName: string, contents: string) {
  return createLocalHistorySnapshot(
    browserHistoryKey,
    "browser:draft",
    "browser",
    fileName,
    contents,
  );
}

export function readDraftHistory() {
  return readLocalHistory(draftHistoryKey, "desktop:unsaved-draft");
}

export function writeDraftHistory(snapshots: HistorySnapshot[]) {
  writeLocalHistory(draftHistoryKey, snapshots);
}

export function createDraftHistorySnapshot(fileName: string, contents: string) {
  return createLocalHistorySnapshot(
    draftHistoryKey,
    "desktop:unsaved-draft",
    "draft",
    fileName,
    contents,
  );
}

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
        async getInitialDeepLinks() {
          return (await deepLink.getCurrent()) ?? [];
        },
        async listenDeepLinks(handler) {
          return deepLink.onOpenUrl(handler);
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

function getInitialViewMode(surface: EditorSurface, initialViewMode?: ViewMode): ViewMode {
  if (initialViewMode) return initialViewMode;
  if (surface === "desktop") return "write";
  const storedMode = localStorage.getItem(defaultViewModeKey);
  if (storedMode === "write" || storedMode === "preview" || storedMode === "split") {
    return storedMode;
  }
  return window.matchMedia?.("(max-width: 760px)").matches ? "write" : "split";
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
  const diff = selectedSnapshot
    ? buildLineDiff(currentMarkdown, selectedSnapshot.contents)
    : [];
  const addedCount = diff.filter((line) => line.type === "added").length;
  const removedCount = diff.filter((line) => line.type === "removed").length;
  const changeCount = addedCount + removedCount;
  const visibleDiff = diffMode === "focused" ? buildFocusedLineDiff(diff) : diff;

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
                          ? "Restoring this snapshot will replace the current document with the older version shown below."
                          : "This snapshot matches the current document."}
                      </p>
                      {changeCount > 0 && (
                        <small>Green lines come from the snapshot. Red lines are in the current document.</small>
                      )}
                    </div>
                    <span>{addedCount} older lines</span>
                    <span>{removedCount} current lines</span>
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
                          <div className={`history-diff-line ${line.type}`} key={`${line.type}-${index}`}>
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
                        The current document already matches this snapshot. Choose another
                        snapshot to compare changes, or switch to Full file to inspect the
                        saved content.
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
        <p>Browser preview mode can import and download files. Desktop mode enables native save dialogs and history.</p>
      )}
      {nativeReady && !hasRecentFiles && <p>Recent files will appear here after your first desktop save.</p>}
    </section>
  );
}

function DesktopStartPanel({
  recentFiles,
  historyCount,
  onOpen,
  onNew,
  onTemplate,
  onRecent,
  onHistory,
}: {
  recentFiles: RecentFile[];
  historyCount: number;
  onOpen: () => void;
  onNew: () => void;
  onTemplate: (template: EditorTemplate) => void;
  onRecent: (path: string) => void;
  onHistory: () => void;
}) {
  return (
    <section className="desktop-start-panel" aria-label="Desktop start">
      <div className="desktop-start-copy">
        <span>Start locally</span>
        <strong>Open a file, continue a recent draft, or start from a template.</strong>
      </div>
      <div className="desktop-start-actions">
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
          History {historyCount > 0 ? `(${historyCount})` : ""}
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
  const suppressBeforeUnload = React.useRef(false);
  const autoSaveTimer = React.useRef<number | null>(null);
  const browserHistoryTimer = React.useRef<number | null>(null);
  const browserHistoryBaseline = React.useRef<string | null>(null);
  const draftHistoryTimer = React.useRef<number | null>(null);
  const draftHistoryBaseline = React.useRef<string | null>(null);
  const menuHandlerRef = React.useRef<(command: string) => void>(() => undefined);
  const handoffImportRef = React.useRef<(draft: HandoffDraft) => void>(() => undefined);
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
    return getInitialViewMode(surface, initialViewMode);
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
  const [sidebarOpen, setSidebarOpen] = React.useState(() => surface !== "desktop");
  const [editorScrollTarget, setEditorScrollTarget] = React.useState<{ line: number; nonce: number } | null>(null);
  const [desktopPrompt, setDesktopPrompt] = React.useState<string | null>(null);
  const [focusMode, setFocusMode] = React.useState(false);
  const [autoSaveFile, setAutoSaveFile] = React.useState(() => {
    return localStorage.getItem(autoSaveFileKey) === "true";
  });
  const [dragActive, setDragActive] = React.useState(false);
  const headings = React.useMemo(() => extractHeadings(markdown), [markdown]);
  const metrics = React.useMemo(() => getMetrics(markdown), [markdown]);
  const rendered = React.useMemo(() => renderMarkdown(markdown, headings), [headings, markdown]);
  const dirty = markdown !== savedMarkdown;
  const desktopSurface = surface === "desktop";
  const browserMode = !nativeApi && !desktopSurface;
  const webSurface = surface === "web";
  const draftHistoryMode = !browserMode && !filePath;
  const resolvedTheme = themeMode === "system" ? (systemDark ? "dark" : "light") : themeMode;
  const showDesktopStart = desktopSurface && !focusMode && !filePath;
  const fileTrustLabel = browserMode
    ? "Browser-local draft"
    : filePath
      ? "Native local file"
      : "Unsaved local draft";
  const saveTrustLabel = dirty ? "Unsaved changes" : browserMode ? "Browser draft saved" : "Saved";
  const historyTrustLabel = browserMode
    ? `${historyEntries.length} browser snapshots`
    : filePath
      ? `${historyEntries.length} file snapshots`
      : `${historyEntries.length} draft snapshots`;

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
      if (path) void openDroppedPath(path);
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

  function loadDocument(nextFile: NativeFile) {
    setMarkdown(nextFile.contents);
    setSavedMarkdown(nextFile.contents);
    setFilePath(nextFile.path);
    setFileName(nextFile.name || "Untitled.md");
    setStatus("Opened");
    if (!nativeApi) browserHistoryBaseline.current = nextFile.contents;
    rememberRecentFile(nextFile.path, nextFile.name || "Untitled.md");
    void refreshHistory(nextFile.path);
  }

  async function importHandoffDraft(draft: HandoffDraft) {
    if (!(await confirmDiscardChanges())) return;

    setMarkdown(draft.markdown);
    setSavedMarkdown(draft.markdown);
    setFilePath(null);
    setFileName(draft.name);
    setHistoryEntries([]);
    setSelectedHistory(null);
    setHistoryOpen(false);
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

  async function saveFile(options?: { silent?: boolean }) {
    if (nativeApi) {
      try {
        const previousSavedMarkdown = savedMarkdown;
        const previousFileName = fileName;
        const previousFilePath = filePath;
        if (previousFilePath && previousSavedMarkdown && previousSavedMarkdown !== markdown) {
          await nativeApi.createHistorySnapshot(previousFilePath, previousFileName, previousSavedMarkdown);
        }
        const savedPath = await nativeApi.saveMarkdownFile(filePath, markdown);
        if (!savedPath) return;
        if (!previousFilePath && previousSavedMarkdown && previousSavedMarkdown !== markdown) {
          await nativeApi.createHistorySnapshot(savedPath, previousFileName, previousSavedMarkdown);
        }
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
    setDesktopPrompt("Desktop saves directly to your local files, keeps history snapshots, and works offline.");
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
    setDesktopPrompt("Desktop is better for repeated export work because it can keep files, drafts, and history together.");
  }

  async function copyText(label: string, contents: string) {
    if (!navigator.clipboard?.writeText) {
      setStatus(`${label} copy is not available in this browser`);
      return;
    }

    try {
      await navigator.clipboard.writeText(contents);
      setStatus(`${label} copied`);
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
        const snapshots = createBrowserHistorySnapshot(fileName, baseline);
        setHistoryEntries(snapshots.map((snapshot) => snapshot.entry));
        browserHistoryBaseline.current = markdown;
      } else {
        await refreshHistory();
      }
      setHistoryOpen(true);
      return;
    }

    if (draftHistoryMode) {
      const baseline = draftHistoryBaseline.current;
      if (baseline && baseline !== markdown) {
        const snapshots = createDraftHistorySnapshot(fileName, baseline);
        setHistoryEntries(snapshots.map((snapshot) => snapshot.entry));
        draftHistoryBaseline.current = markdown;
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
    if (suppressPreviewSync.current) return;

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
      className={`app-shell theme-${resolvedTheme}${browserMode ? " browser-surface" : " desktop-surface"}${desktopSurface && !sidebarOpen ? " desktop-focus" : ""}${focusMode ? " writing-focus" : ""}${dragActive ? " drag-active" : ""}`}
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
                : "Your Markdown, autosaved draft, and browser history stay on this device. Desktop adds native folders, direct save, offline work, and file history."}
            </span>
            {!dirty && (
              <a href={desktopDownloadHref}>
                <MonitorDown size={14} />
                Get desktop
              </a>
            )}
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
              onClick={() => {
                setStatus("Folder vaults need VeloWrite Desktop for native file access");
                setDesktopPrompt("Folder vaults need Desktop for native file access, offline work, and local history.");
              }}
            >
              <FolderPlus size={16} />
              Open folder
            </button>
          )}
          <button
            className="nav-item"
            onClick={() => void openHistoryPanel()}
          >
            <GitBranch size={16} />
            History
            {historyEntries.length > 0 && <span>{historyEntries.length}</span>}
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
            onTemplate={(template) => void startFromTemplate(template)}
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
            <span>{browserMode ? "Browser history stays local" : "Private sync planned"}</span>
          </div>
        </div>
      </aside>

      <section className="workspace">
        {desktopSurface && focusMode && (
          <button
            className="focus-exit"
            aria-label="Exit focus mode"
            title="Exit focus mode"
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
                aria-label={focusMode ? "Exit focus mode" : "Enter focus mode"}
                title={focusMode ? "Exit focus mode" : "Enter focus mode"}
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
            <span>{filePath || fileName}</span>
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
            <button
              aria-label="Copy Markdown"
              title="Copy Markdown"
              className="optional-action"
              onClick={copyMarkdown}
            >
              <ClipboardCopy size={17} />
            </button>
            <button
              aria-label="Copy rendered HTML"
              title="Copy rendered HTML"
              className="optional-action"
              onClick={copyRenderedHtml}
            >
              <Code2 size={17} />
            </button>
            <button aria-label="AI assist" title="AI assist coming soon" disabled>
              <Bot size={17} />
            </button>
            <button
              aria-label="History"
              title="History"
              onClick={() => void openHistoryPanel()}
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

        {showDesktopStart && (
          <DesktopStartPanel
            recentFiles={recentFiles}
            historyCount={historyEntries.length}
            onOpen={() => void openFileWithGuard()}
            onNew={() => void newFileWithGuard()}
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
              <strong>Need native local files?</strong>
              <p>{desktopPrompt}</p>
            </div>
            <a href={desktopDownloadHref}>
              Download Desktop <Download size={14} />
            </a>
          </aside>
        )}
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
