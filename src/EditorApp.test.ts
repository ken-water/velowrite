import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildFocusedLineDiff,
  buildLineDiff,
  createBrowserHistorySnapshot,
  createDesktopHandoffUrl,
  createDraftHistorySnapshot,
  createLocalHistorySnapshot,
  freeHistorySnapshotLimit,
  getInitialViewMode,
  getStoredLastLocalFile,
  getStoredEditorFontSize,
  getStoredThemeMode,
  limitHistorySnapshots,
  normalizeMarkdownFileName,
  parseDesktopHandoffUrl,
  readBrowserHistory,
  readDraftHistory,
  readLocalHistory,
  storeLastLocalFile,
  writeLocalHistory,
} from "./EditorApp";

function createLocalStorageMock() {
  const store = new Map<string, string>();
  return {
    clear: vi.fn(() => store.clear()),
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
  };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-07-25T00:00:00Z"));
  vi.stubGlobal("localStorage", createLocalStorageMock());
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("desktop handoff URLs", () => {
  it("round-trips Markdown drafts through the VeloWrite import URL", () => {
    const markdown = "# Draft\n\n- Works with Unicode: café\n- Keeps `code` intact\n";
    const url = createDesktopHandoffUrl("../My Draft", markdown);

    expect(url).toMatch(/^velowrite:\/\/import\?payload=/);
    expect(parseDesktopHandoffUrl(url ?? "")).toEqual({
      name: "..-My Draft.md",
      markdown,
    });
  });

  it("rejects non-VeloWrite URLs", () => {
    expect(parseDesktopHandoffUrl("https://velowrite.app/web")).toBeNull();
  });

  it("rejects malformed or incomplete VeloWrite import URLs", () => {
    expect(parseDesktopHandoffUrl("velowrite://open?payload=abc")).toBeNull();
    expect(parseDesktopHandoffUrl("velowrite://import")).toBeNull();
    expect(parseDesktopHandoffUrl("velowrite://import?payload=not-json")).toBeNull();
  });

  it("returns null when the encoded draft is too large for a practical deep link", () => {
    const url = createDesktopHandoffUrl("large.md", "# Large\n\n" + "content\n".repeat(3000));

    expect(url).toBeNull();
  });

  it("normalizes unsafe draft names before creating a desktop handoff URL", () => {
    const url = createDesktopHandoffUrl("../../Unsafe<>Name", "content");

    expect(parseDesktopHandoffUrl(url ?? "")).toEqual({
      name: "..-..-UnsafeName.md",
      markdown: "content",
    });
  });
});

describe("editor preferences", () => {
  it("normalizes Markdown file names for local and handoff workflows", () => {
    expect(normalizeMarkdownFileName("Notes")).toBe("Notes.md");
    expect(normalizeMarkdownFileName("Draft.markdown")).toBe("Draft.markdown");
    expect(normalizeMarkdownFileName("folder/name?.mdown")).toBe("folder-name.mdown");
    expect(normalizeMarkdownFileName("   ")).toBe("Web Draft.md");
  });

  it("uses write mode for desktop and stored view mode for web", () => {
    expect(getInitialViewMode("desktop")).toBe("write");
    expect(getInitialViewMode("web", "preview")).toBe("preview");

    localStorage.setItem("velowrite:default-view-mode", "split");
    expect(getInitialViewMode("web")).toBe("split");

    localStorage.setItem("velowrite:default-view-mode", "invalid");
    vi.stubGlobal("window", { matchMedia: vi.fn().mockReturnValue({ matches: true }) });
    expect(getInitialViewMode("web")).toBe("write");

    vi.stubGlobal("window", { matchMedia: vi.fn().mockReturnValue({ matches: false }) });
    expect(getInitialViewMode("web")).toBe("split");
  });

  it("reads theme and clamps editor font size preferences", () => {
    expect(getStoredThemeMode()).toBe("system");

    localStorage.setItem("velowrite:theme-mode", "dark");
    expect(getStoredThemeMode()).toBe("dark");

    localStorage.setItem("velowrite:theme-mode", "unknown");
    expect(getStoredThemeMode()).toBe("system");

    localStorage.setItem("velowrite:editor-font-size", "8");
    expect(getStoredEditorFontSize()).toBe(12);

    localStorage.setItem("velowrite:editor-font-size", "26");
    expect(getStoredEditorFontSize()).toBe(22);

    localStorage.setItem("velowrite:editor-font-size", "17");
    expect(getStoredEditorFontSize()).toBe(17);

    localStorage.setItem("velowrite:editor-font-size", "bad");
    expect(getStoredEditorFontSize()).toBe(15);
  });
});

describe("history diff previews", () => {
  it("marks lines that would be restored or removed", () => {
    expect(buildLineDiff("A\ncurrent\nC", "A\nsnapshot\nC")).toEqual([
      { type: "unchanged", text: "A", currentLine: 1, snapshotLine: 1 },
      { type: "removed", text: "current", currentLine: 2 },
      { type: "added", text: "snapshot", snapshotLine: 2 },
      { type: "unchanged", text: "C", currentLine: 3, snapshotLine: 3 },
    ]);
  });

  it("handles appended snapshot lines", () => {
    expect(buildLineDiff("A", "A\nB")).toEqual([
      { type: "unchanged", text: "A", currentLine: 1, snapshotLine: 1 },
      { type: "added", text: "B", snapshotLine: 2 },
    ]);
  });

  it("focuses long diffs around changed lines", () => {
    const current = ["A", "B", "C", "current", "E", "F", "G", "H", "I"].join("\n");
    const snapshot = ["A", "B", "C", "snapshot", "E", "F", "G", "H", "I"].join("\n");
    const focused = buildFocusedLineDiff(buildLineDiff(current, snapshot), 1);

    expect(focused).toContainEqual({ type: "removed", text: "current", currentLine: 4 });
    expect(focused).toContainEqual({ type: "added", text: "snapshot", snapshotLine: 4 });
    expect(focused.some((line) => line.type === "separator")).toBe(true);
  });

  it("does not show unchanged document text when a snapshot matches current content", () => {
    const focused = buildFocusedLineDiff(buildLineDiff("A\nB\nC", "A\nB\nC"));

    expect(focused).toEqual([]);
  });
});

describe("free preview history policy", () => {
  it("keeps the free local history limit intentionally small and explicit", () => {
    expect(freeHistorySnapshotLimit).toBe(3);
    expect(limitHistorySnapshots(["newest", "middle", "oldest", "rotated"])).toEqual([
      "newest",
      "middle",
      "oldest",
    ]);
  });

  it("rotates browser history down to the latest three unique snapshots", () => {
    for (const contents of ["one", "two", "three", "four"]) {
      createBrowserHistorySnapshot("Scratch", contents);
      vi.advanceTimersByTime(1);
    }

    const snapshots = readBrowserHistory();

    expect(snapshots).toHaveLength(3);
    expect(snapshots.map((snapshot) => snapshot.contents)).toEqual(["four", "three", "two"]);
    expect(snapshots.every((snapshot) => snapshot.entry.file_name === "Scratch.md")).toBe(true);
  });

  it("does not duplicate adjacent draft snapshots with identical contents", () => {
    createDraftHistorySnapshot("Draft", "same");
    vi.advanceTimersByTime(1);
    createDraftHistorySnapshot("Draft", "same");

    expect(readDraftHistory()).toHaveLength(1);
  });

  it("reads local history in newest-first order and drops invalid records", () => {
    localStorage.setItem(
      "history:test",
      JSON.stringify([
        { id: "old", fileName: "old.md", createdAt: 1, contents: "old" },
        { id: "bad", fileName: "bad.md", createdAt: "wrong", contents: "bad" },
        { id: "new", fileName: "new.md", createdAt: 3, contents: "new" },
        { id: "middle", fileName: "middle.md", createdAt: 2, contents: "middle" },
        { id: "extra", fileName: "extra.md", createdAt: 0, contents: "extra" },
      ]),
    );

    const snapshots = readLocalHistory("history:test", "/notes/test.md");

    expect(snapshots.map((snapshot) => snapshot.entry.id)).toEqual(["new", "middle", "old"]);
    expect(snapshots[0].entry.file_path).toBe("/notes/test.md");
    expect(snapshots[0].entry.snapshot_path).toBe("localStorage:history:test:new");
  });

  it("returns no local history for malformed storage", () => {
    localStorage.setItem("history:test", "{");

    expect(readLocalHistory("history:test", "/notes/test.md")).toEqual([]);

    localStorage.setItem("history:test", JSON.stringify({ id: "not-an-array" }));
    expect(readLocalHistory("history:test", "/notes/test.md")).toEqual([]);
  });

  it("writes local history using the free snapshot limit", () => {
    const snapshots = ["one", "two", "three", "four"].map((contents, index) => ({
      entry: {
        id: `id-${index}`,
        file_path: "/notes/test.md",
        file_name: `file-${index}.md`,
        snapshot_path: `snapshot-${index}`,
        created_at: index,
        size: contents.length,
      },
      contents,
    }));

    writeLocalHistory("history:test", snapshots);

    expect(JSON.parse(localStorage.getItem("history:test") ?? "[]")).toEqual([
      { id: "id-0", fileName: "file-0.md", createdAt: 0, contents: "one" },
      { id: "id-1", fileName: "file-1.md", createdAt: 1, contents: "two" },
      { id: "id-2", fileName: "file-2.md", createdAt: 2, contents: "three" },
    ]);
  });

  it("deduplicates non-adjacent local snapshots with matching contents", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.123456);

    createLocalHistorySnapshot("history:test", "/notes/test.md", "test", "Draft", "first");
    vi.advanceTimersByTime(1);
    createLocalHistorySnapshot("history:test", "/notes/test.md", "test", "Draft", "second");
    vi.advanceTimersByTime(1);
    const snapshots = createLocalHistorySnapshot(
      "history:test",
      "/notes/test.md",
      "test",
      "Draft",
      "first",
    );

    expect(snapshots.map((snapshot) => snapshot.contents)).toEqual(["first", "second"]);
    expect(snapshots[0].entry.file_name).toBe("Draft.md");
  });
});

describe("last local file restore", () => {
  it("stores and reads the most recent local Markdown file", () => {
    storeLastLocalFile({ path: "/notes/project.md", name: "project.md" });

    expect(getStoredLastLocalFile()).toEqual({ path: "/notes/project.md", name: "project.md" });
  });

  it("ignores empty paths and malformed stored values", () => {
    storeLastLocalFile({ path: "", name: "browser-import.md" });
    expect(getStoredLastLocalFile()).toBeNull();

    localStorage.setItem("velowrite:last-local-file", JSON.stringify({ path: "", name: "broken.md" }));
    expect(getStoredLastLocalFile()).toBeNull();

    localStorage.setItem("velowrite:last-local-file", "not-json");
    expect(getStoredLastLocalFile()).toBeNull();
  });
});
