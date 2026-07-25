import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildFocusedLineDiff,
  buildLineDiff,
  createBrowserHistorySnapshot,
  createDesktopHandoffUrl,
  createDraftHistorySnapshot,
  freeHistorySnapshotLimit,
  limitHistorySnapshots,
  parseDesktopHandoffUrl,
  readBrowserHistory,
  readDraftHistory,
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
});
