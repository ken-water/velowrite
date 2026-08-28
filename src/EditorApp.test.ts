import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildFocusedLineDiff,
  buildBrowserImageMarkdown,
  buildImageMarkdown,
  buildLineDiff,
  compareSemver,
  createBrowserHistorySnapshot,
  createBrowserTabHistorySnapshot,
  createDesktopHandoffUrl,
  createDraftHistorySnapshot,
  createLocalHistorySnapshot,
  formatMarkdownTables,
  freeHistorySnapshotLimit,
  getCodeBlockStats,
  getInitialViewMode,
  getImageAssetSummary,
  getMarkdownImageReferences,
  getMarkdownTableDiagnostics,
  getStoredLastLocalFile,
  getStoredEditorFontSize,
  getStoredRecentFiles,
  getStoredBrowserWorkspace,
  getRecentFileContext,
  getStoredReadingFont,
  getStoredReadingPalette,
  getStoredTableExportStyle,
  getRelativeAssetPath,
  isImagePath,
  isMarkdownPath,
  normalizeDisplayedPath,
  getStoredThemeMode,
  limitHistorySnapshots,
  normalizeMarkdownFileName,
  parseDesktopHandoffUrl,
  readBrowserHistory,
  readBrowserTabHistory,
  readDraftHistory,
  readLocalHistory,
  storeRecentFiles,
  storeBrowserWorkspace,
  storeLastLocalFile,
  writeBrowserHistory,
  writeBrowserTabHistory,
  writeDraftHistory,
  writeLocalHistory,
} from "./editorCore";

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

  it("compares semantic versions numerically for update checks", () => {
    expect(compareSemver("0.2.10", "0.2.9")).toBeGreaterThan(0);
    expect(compareSemver("0.3.0", "0.2.99")).toBeGreaterThan(0);
    expect(compareSemver("0.2.3", "0.2.3")).toBe(0);
  });

  it("uses a focused reading palette and validates reading font preferences", () => {
    expect(getStoredReadingPalette()).toBe("focus");
    expect(getStoredReadingFont()).toBe("system");

    localStorage.setItem("velowrite:reading-palette", "paper");
    localStorage.setItem("velowrite:reading-font", "serif");
    expect(getStoredReadingPalette()).toBe("paper");
    expect(getStoredReadingFont()).toBe("serif");

    localStorage.setItem("velowrite:reading-palette", "invalid");
    localStorage.setItem("velowrite:reading-font", "invalid");
    expect(getStoredReadingPalette()).toBe("focus");
    expect(getStoredReadingFont()).toBe("system");
  });

  it("round-trips the browser workspace and keeps only valid tabs", () => {
    storeBrowserWorkspace({
      activeTabId: "tab-two",
      tabs: [
        {
          id: "tab-one",
          fileName: "One.md",
          markdown: "# One",
          savedMarkdown: "# One",
          viewMode: "write",
        },
        {
          id: "tab-two",
          fileName: "Two.md",
          markdown: "# Two",
          savedMarkdown: "# Two",
          viewMode: "preview",
        },
      ],
    });

    expect(getStoredBrowserWorkspace()).toEqual({
      activeTabId: "tab-two",
      tabs: [
        {
          id: "tab-one",
          fileName: "One.md",
          markdown: "# One",
          savedMarkdown: "# One",
          viewMode: "write",
        },
        {
          id: "tab-two",
          fileName: "Two.md",
          markdown: "# Two",
          savedMarkdown: "# Two",
          viewMode: "preview",
        },
      ],
    });

    localStorage.setItem(
      "velowrite:browser-workspace",
      JSON.stringify({
        activeTabId: "invalid",
        tabs: [{ id: "bad", fileName: "bad.md", markdown: "# Bad" }],
      }),
    );
    expect(getStoredBrowserWorkspace()).toBeNull();
  });

  it("builds safe browser-local image Markdown", () => {
    expect(buildBrowserImageMarkdown("notes[1].png", "data:image/png;base64,abc")).toBe(
      "![notes-1-.png](data:image/png;base64,abc)",
    );
  });
});

describe("document quality helpers", () => {
  it("classifies Markdown image references by portability", () => {
    const references = getMarkdownImageReferences(
      [
        "![Local](assets/cover.png)",
        "![Remote](https://example.com/cover.png)",
        "![Absolute](/tmp/cover.png)",
        "![Embedded](data:image/png;base64,abc)",
      ].join("\n"),
    );

    expect(references.map((reference) => reference.kind)).toEqual([
      "relative",
      "remote",
      "absolute",
      "data",
    ]);
    expect(references.map((reference) => reference.portable)).toEqual([
      true,
      false,
      false,
      true,
    ]);
  });

  it("summarizes image asset risks for local-first documents", () => {
    const summary = getImageAssetSummary(
      "![One](assets/one.png)\n![Two](https://example.com/two.png)\n![Three](C:/tmp/three.png)",
      "/notes/plan.md",
    );

    expect(summary).toMatchObject({
      total: 3,
      relative: 1,
      remote: 1,
      absolute: 1,
    });
    expect(summary.notes).toContain(
      "Use relative paths for images that should move with the document.",
    );
    expect(summary.notes).toContain("Remote images can disappear or fail when reading offline.");
  });

  it("formats simple GFM tables without changing surrounding Markdown", () => {
    const markdown = [
      "# Plan",
      "",
      "| Name | State |",
      "|---|---|",
      "| PDF |done|",
      "| Longer item |todo|",
      "",
      "Done.",
    ].join("\n");

    expect(formatMarkdownTables(markdown)).toBe(
      [
        "# Plan",
        "",
        "| Name        | State |",
        "| ----------- | ----- |",
        "| PDF         | done  |",
        "| Longer item | todo  |",
        "",
        "Done.",
      ].join("\n"),
    );
  });

  it("reports Markdown table column mismatches", () => {
    const diagnostics = getMarkdownTableDiagnostics(
      [
        "| A | B |",
        "| --- | --- |",
        "| 1 | 2 | 3 |",
        "| 4 | 5 |",
      ].join("\n"),
    );

    expect(diagnostics.tables).toBe(1);
    expect(diagnostics.rows).toBe(3);
    expect(diagnostics.issues).toEqual([
      { line: 3, message: "Row has 3 columns; expected 2." },
    ]);
  });

  it("counts fenced code blocks and missing language labels", () => {
    const stats = getCodeBlockStats(
      [
        "```python",
        "print('hi')",
        "```",
        "```",
        "echo hi",
        "```",
        "```bash",
        "npm test",
        "```",
      ].join("\n"),
    );

    expect(stats).toEqual({
      total: 3,
      labeled: 2,
      unlabeled: 1,
      languages: { python: 1, bash: 1 },
    });
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

  it("writes browser and draft history through their scoped helpers", () => {
    const snapshot = {
      entry: {
        id: "browser-1",
        file_path: "browser:draft",
        file_name: "Browser.md",
        snapshot_path: "localStorage:velowrite:browser-history:browser-1",
        created_at: 1,
        size: 7,
      },
      contents: "browser",
    };
    const draftSnapshot = {
      entry: {
        id: "draft-1",
        file_path: "desktop:unsaved-draft",
        file_name: "Draft.md",
        snapshot_path: "localStorage:velowrite:draft-history:draft-1",
        created_at: 2,
        size: 5,
      },
      contents: "draft",
    };

    writeBrowserHistory([snapshot]);
    writeDraftHistory([draftSnapshot]);

    expect(readBrowserHistory().map((item) => item.contents)).toEqual(["browser"]);
    expect(readDraftHistory().map((item) => item.contents)).toEqual(["draft"]);
  });

  it("keeps browser history isolated per document tab and migrates the first draft", () => {
    createBrowserTabHistorySnapshot("tab-one", "One", "one-version");
    createBrowserTabHistorySnapshot("tab-two", "Two", "two-version");

    expect(readBrowserTabHistory("tab-one").map((item) => item.contents)).toEqual([
      "one-version",
    ]);
    expect(readBrowserTabHistory("tab-two").map((item) => item.contents)).toEqual([
      "two-version",
    ]);

    createBrowserHistorySnapshot("Legacy", "legacy-version");
    expect(readBrowserTabHistory("tab-draft").map((item) => item.contents)).toEqual([
      "legacy-version",
    ]);

    writeBrowserTabHistory("tab-two", []);
    expect(readBrowserTabHistory("tab-one")).toHaveLength(1);
    expect(readBrowserTabHistory("tab-two")).toEqual([]);
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

describe("recent files", () => {
  it("stores recent files using the preview list limit", () => {
    const files = Array.from({ length: 10 }, (_, index) => ({
      path: `/notes/${index}.md`,
      name: `${index}.md`,
    }));

    storeRecentFiles(files);

    expect(getStoredRecentFiles()).toHaveLength(10);
    expect(getStoredRecentFiles()[0]).toEqual({ path: "/notes/0.md", name: "0.md" });
  });

  it("deduplicates repeated recent file paths", () => {
    storeRecentFiles([
      { path: "/notes/plan.md", name: "plan.md" },
      { path: "/notes/plan.md", name: "plan.md" },
      { path: "/notes/archive/plan.md", name: "plan.md" },
    ]);

    expect(getStoredRecentFiles()).toEqual([
      { path: "/notes/plan.md", name: "plan.md" },
      { path: "/notes/archive/plan.md", name: "plan.md" },
    ]);
  });

  it("derives a short folder context for same-name recent files", () => {
    expect(getRecentFileContext("/notes/archive/plan.md")).toBe("archive");
    expect(getRecentFileContext("plan.md")).toBe("plan.md");
  });

  it("hides the Windows extended path prefix from displayed paths", () => {
    expect(normalizeDisplayedPath(String.raw`\\?\C:\Users\dell\Downloads\plan.md`)).toBe(
      String.raw`C:\Users\dell\Downloads\plan.md`,
    );
    expect(normalizeDisplayedPath(String.raw`\\?\UNC\server\share\plan.md`)).toBe(
      String.raw`\\server\share\plan.md`,
    );
  });

  it("detects Markdown and image paths for native drag and drop", () => {
    expect(isMarkdownPath("/notes/plan.md")).toBe(true);
    expect(isMarkdownPath("/notes/plan.markdown")).toBe(true);
    expect(isMarkdownPath("/notes/photo.png")).toBe(false);
    expect(isImagePath("/notes/photo.PNG")).toBe(true);
    expect(isImagePath("/notes/diagram.svg")).toBe(true);
    expect(isImagePath("/notes/plan.md")).toBe(false);
  });

  it("builds portable Markdown image references when assets sit beside the document", () => {
    expect(getRelativeAssetPath("/notes/project/assets/hero image.png", "/notes/project/plan.md")).toBe(
      "assets/hero image.png",
    );
    expect(
      buildImageMarkdown("/notes/project/assets/hero image.png", "/notes/project/plan.md"),
    ).toBe("![hero image](assets/hero%20image.png)");
  });

  it("keeps absolute image paths when an asset is outside the current document folder", () => {
    expect(getRelativeAssetPath("/shared/image.png", "/notes/project/plan.md")).toBe(
      "/shared/image.png",
    );
    expect(buildImageMarkdown(String.raw`C:\Users\rich\Pictures\cover.jpg`, null)).toBe(
      "![cover](C:/Users/rich/Pictures/cover.jpg)",
    );
  });

  it("loads and normalizes table export preferences", () => {
    expect(getStoredTableExportStyle()).toEqual({
      header: "tinted",
      rows: "striped",
      borders: "strong",
      color: "green",
    });

    localStorage.setItem(
      "velowrite:table-export-style",
      JSON.stringify({ header: "plain", rows: "plain", borders: "light", color: "blue" }),
    );
    expect(getStoredTableExportStyle()).toEqual({
      header: "plain",
      rows: "plain",
      borders: "light",
      color: "blue",
    });
  });

  it("ignores invalid recent file records", () => {
    localStorage.setItem(
      "velowrite:recent-files",
      JSON.stringify([
        { path: "/notes/valid.md", name: "valid.md" },
        { path: "", name: "empty.md" },
        { path: "/notes/missing-name.md" },
        null,
      ]),
    );

    expect(getStoredRecentFiles()).toEqual([{ path: "/notes/valid.md", name: "valid.md" }]);

    localStorage.setItem("velowrite:recent-files", JSON.stringify({ path: "/notes/not-array.md" }));
    expect(getStoredRecentFiles()).toEqual([]);

    localStorage.setItem("velowrite:recent-files", "{");
    expect(getStoredRecentFiles()).toEqual([]);
  });
});
