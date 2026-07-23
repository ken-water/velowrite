import { describe, expect, it } from "vitest";
import { buildLineDiff, createDesktopHandoffUrl, parseDesktopHandoffUrl } from "./EditorApp";

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

  it("returns null when the encoded draft is too large for a practical deep link", () => {
    const url = createDesktopHandoffUrl("large.md", "# Large\n\n" + "content\n".repeat(3000));

    expect(url).toBeNull();
  });
});

describe("history diff previews", () => {
  it("marks lines that would be restored or removed", () => {
    expect(buildLineDiff("A\ncurrent\nC", "A\nsnapshot\nC")).toEqual([
      { type: "unchanged", text: "A" },
      { type: "removed", text: "current" },
      { type: "added", text: "snapshot" },
      { type: "unchanged", text: "C" },
    ]);
  });

  it("handles appended snapshot lines", () => {
    expect(buildLineDiff("A", "A\nB")).toEqual([
      { type: "unchanged", text: "A" },
      { type: "added", text: "B" },
    ]);
  });
});
