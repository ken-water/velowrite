export type ViewMode = "split" | "write" | "preview";
export type ThemeMode = "light" | "dark" | "system";
export type ReadingPalette = "focus" | "paper" | "mist" | "night" | "contrast";
export type ReadingFont = "system" | "serif" | "mono";
export type EditorSurface = "desktop" | "web" | "embedded";
export type TableExportStyle = {
  header: "tinted" | "plain";
  rows: "striped" | "plain";
  borders: "strong" | "light";
  color: "green" | "blue" | "gray";
};

export type PdfPageSize = "a4" | "letter";
export type PdfPageNumberFormat = "fraction" | "simple" | "label";
export type PdfPageNumberAnchor = "left" | "center" | "right";
export type PdfMarginPreset = "comfortable" | "compact";
export type PdfExportStyle = {
  previewMark: boolean;
  pageNumbers: boolean;
  pageNumberFormat: PdfPageNumberFormat;
  pageNumberAnchor: PdfPageNumberAnchor;
  pageSize: PdfPageSize;
  margins: PdfMarginPreset;
  table: TableExportStyle;
};

export type NativeFile = {
  path: string;
  name: string;
  contents: string;
};

export type RecentFile = {
  path: string;
  name: string;
};

export type HistoryEntry = {
  id: string;
  file_path: string;
  file_name: string;
  snapshot_path: string;
  created_at: number;
  size: number;
};

export type HistorySnapshot = {
  entry: HistoryEntry;
  contents: string;
};

export type HistoryScope = "desktop" | "browser" | "draft";

export type BrowserHistoryRecord = {
  id: string;
  fileName: string;
  createdAt: number;
  contents: string;
};

export type HandoffDraft = {
  name: string;
  markdown: string;
};

export type DiffLine = {
  type: "added" | "removed" | "unchanged" | "separator";
  text: string;
  currentLine?: number;
  snapshotLine?: number;
};

export const draftKey = "velowrite:draft";
export const draftNameKey = "velowrite:draft-name";
export const recentFilesKey = "velowrite:recent-files";
export const autoSaveFileKey = "velowrite:auto-save-file";
export const themeModeKey = "velowrite:theme-mode";
export const readingPaletteKey = "velowrite:reading-palette";
export const readingFontKey = "velowrite:reading-font";
export const editorFontSizeKey = "velowrite:editor-font-size";
export const defaultViewModeKey = "velowrite:default-view-mode";
export const tableExportStyleKey = "velowrite:table-export-style";
export const pdfExportStyleKey = "velowrite:pdf-export-style";
export const browserHistoryKey = "velowrite:browser-history";
export const draftHistoryKey = "velowrite:draft-history";
export const appVersion = "0.2.6";
export const freeHistorySnapshotLimit = 3;
export const defaultTableExportStyle: TableExportStyle = {
  header: "tinted",
  rows: "striped",
  borders: "strong",
  color: "green",
};

export const defaultPdfExportStyle: PdfExportStyle = {
  previewMark: true,
  pageNumbers: true,
  pageNumberFormat: "fraction",
  pageNumberAnchor: "right",
  pageSize: "a4",
  margins: "comfortable",
  table: defaultTableExportStyle,
};

const lastLocalFileKey = "velowrite:last-local-file";
const desktopHandoffUrlLimit = 12000;

export function compareSemver(left: string, right: string) {
  const parse = (value: string) => value.split("-")[0].split(".").map((part) => Number.parseInt(part, 10) || 0);
  const [leftMajor, leftMinor, leftPatch] = parse(left);
  const [rightMajor, rightMinor, rightPatch] = parse(right);

  if (leftMajor !== rightMajor) return leftMajor - rightMajor;
  if (leftMinor !== rightMinor) return leftMinor - rightMinor;
  return leftPatch - rightPatch;
}

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

export function normalizeMarkdownFileName(name: string) {
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

export function getStoredRecentFiles(): RecentFile[] {
  try {
    const value = localStorage.getItem(recentFilesKey);
    if (!value) return [];
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return dedupeRecentFiles(
      parsed.filter((item): item is RecentFile => {
        return (
          item &&
          typeof item.path === "string" &&
          item.path.length > 0 &&
          typeof item.name === "string"
        );
      }),
    ).slice(0, 8);
  } catch {
    return [];
  }
}

export function storeRecentFiles(files: RecentFile[]) {
  localStorage.setItem(recentFilesKey, JSON.stringify(dedupeRecentFiles(files).slice(0, 8)));
}

function dedupeRecentFiles(files: RecentFile[]) {
  const seen = new Set<string>();
  const unique: RecentFile[] = [];

  for (const file of files) {
    if (seen.has(file.path)) continue;
    seen.add(file.path);
    unique.push(file);
  }

  return unique;
}

export function getRecentFileContext(path: string) {
  const segments = path.split(/[\\/]+/).filter(Boolean);
  if (segments.length < 2) return path;
  return segments[segments.length - 2];
}

export function normalizeDisplayedPath(path: string) {
  return path
    .replace(/^\\\\\?\\UNC\\/i, "\\\\")
    .replace(/^\\\\\?\\/i, "");
}

export function getStoredLastLocalFile(): RecentFile | null {
  try {
    const value = localStorage.getItem(lastLocalFileKey);
    if (!value) return null;
    const parsed = JSON.parse(value);
    if (
      parsed &&
      typeof parsed.path === "string" &&
      parsed.path.length > 0 &&
      typeof parsed.name === "string"
    ) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

export function storeLastLocalFile(file: RecentFile) {
  if (!file.path) return;
  localStorage.setItem(lastLocalFileKey, JSON.stringify(file));
}

export function getInitialViewMode(surface: EditorSurface, initialViewMode?: ViewMode): ViewMode {
  if (initialViewMode) return initialViewMode;
  if (surface === "desktop") return "write";
  const storedMode = localStorage.getItem(defaultViewModeKey);
  if (storedMode === "write" || storedMode === "preview" || storedMode === "split") {
    return storedMode;
  }
  return window.matchMedia?.("(max-width: 760px)").matches ? "write" : "split";
}

export function getStoredThemeMode(): ThemeMode {
  const value = localStorage.getItem(themeModeKey);
  return value === "dark" || value === "system" || value === "light" ? value : "system";
}

export function getStoredReadingPalette(): ReadingPalette {
  const value = localStorage.getItem(readingPaletteKey);
  if (
    value === "focus" ||
    value === "paper" ||
    value === "mist" ||
    value === "night" ||
    value === "contrast"
  ) {
    return value;
  }
  return "focus";
}

export function getStoredReadingFont(): ReadingFont {
  const value = localStorage.getItem(readingFontKey);
  if (value === "serif" || value === "mono" || value === "system") {
    return value;
  }
  return "system";
}

export function getStoredEditorFontSize() {
  const value = Number(localStorage.getItem(editorFontSizeKey));
  if (!Number.isFinite(value)) return 15;
  return Math.min(22, Math.max(12, value));
}

export function getStoredTableExportStyle(): TableExportStyle {
  try {
    const value = localStorage.getItem(tableExportStyleKey);
    if (!value) return defaultTableExportStyle;
    const parsed = JSON.parse(value);
    return {
      header: parsed?.header === "plain" ? "plain" : "tinted",
      rows: parsed?.rows === "plain" ? "plain" : "striped",
      borders: parsed?.borders === "light" ? "light" : "strong",
      color: parsed?.color === "blue" || parsed?.color === "gray" ? parsed.color : "green",
    };
  } catch {
    return defaultTableExportStyle;
  }
}

export function getStoredPdfExportStyle(): PdfExportStyle {
  try {
    const value = localStorage.getItem(pdfExportStyleKey);
    if (!value) {
      const legacyTableValue = localStorage.getItem(tableExportStyleKey);
      if (!legacyTableValue) return defaultPdfExportStyle;
      const legacyTable = JSON.parse(legacyTableValue);
      return {
        ...defaultPdfExportStyle,
        table: {
          header: legacyTable?.header === "plain" ? "plain" : "tinted",
          rows: legacyTable?.rows === "plain" ? "plain" : "striped",
          borders: legacyTable?.borders === "light" ? "light" : "strong",
          color:
            legacyTable?.color === "blue" || legacyTable?.color === "gray"
              ? legacyTable.color
              : "green",
        },
      };
    }
    const parsed = JSON.parse(value);
    return {
      previewMark: parsed?.previewMark !== false,
      pageNumbers: parsed?.pageNumbers !== false,
      pageNumberFormat:
        parsed?.pageNumberFormat === "simple" || parsed?.pageNumberFormat === "label"
          ? parsed.pageNumberFormat
          : "fraction",
      pageNumberAnchor:
        parsed?.pageNumberAnchor === "left" || parsed?.pageNumberAnchor === "center"
          ? parsed.pageNumberAnchor
          : "right",
      pageSize: parsed?.pageSize === "letter" ? "letter" : "a4",
      margins: parsed?.margins === "compact" ? "compact" : "comfortable",
      table: {
        header: parsed?.table?.header === "plain" ? "plain" : "tinted",
        rows: parsed?.table?.rows === "plain" ? "plain" : "striped",
        borders: parsed?.table?.borders === "light" ? "light" : "strong",
        color: parsed?.table?.color === "blue" || parsed?.table?.color === "gray" ? parsed.table.color : "green",
      },
    };
  } catch {
    return defaultPdfExportStyle;
  }
}
