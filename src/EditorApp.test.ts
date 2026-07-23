import { describe, expect, it } from "vitest";
import { createDesktopHandoffUrl, parseDesktopHandoffUrl } from "./EditorApp";

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
