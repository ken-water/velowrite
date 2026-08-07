import fs from "node:fs/promises";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildPdfBlocks,
  createMarkdownPdf,
  pdfBytesToBase64,
  resetPdfFontCacheForTests,
} from "./pdfExport";
import { defaultTableExportStyle } from "./editorCore";

const unicodeFontPath = path.join(process.cwd(), "public/fonts/droid-sans-fallback-full.ttf");

async function mockBundledUnicodeFont() {
  const font = await fs.readFile(unicodeFontPath);
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(font));
}

describe("PDF export engine", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    resetPdfFontCacheForTests();
  });

  it("parses common Markdown structures for paged PDF rendering", () => {
    const blocks = buildPdfBlocks(`# Title

A short paragraph with **bold** text.

- One
- Two

> A useful quote.

| Name | Value |
| --- | --- |
| Alpha | 1 |

\`\`\`python
print("hello")
\`\`\`
`);

    expect(blocks.map((block) => block.type)).toEqual([
      "heading",
      "paragraph",
      "list",
      "quote",
      "table",
      "code",
    ]);
    expect(blocks).toContainEqual({
      type: "table",
      headers: ["Name", "Value"],
      rows: [["Alpha", "1"]],
    });
  });

  it("preserves explicit ordered-list starts across separate Markdown lists", () => {
    const blocks = buildPdfBlocks(`1. First wedge

2. Second wedge

3. Third wedge`);

    expect(blocks.filter((block) => block.type === "list")).toEqual([
      { type: "list", items: ["First wedge"], ordered: true, start: 1 },
      { type: "list", items: ["Second wedge"], ordered: true, start: 2 },
      { type: "list", items: ["Third wedge"], ordered: true, start: 3 },
    ]);
  });

  it("creates a valid PDF without browser print headers", async () => {
    const bytes = await createMarkdownPdf({
      markdown: "# Plan\n\nContent that should be rendered by VeloWrite.",
      title: "Plan",
      tableStyle: defaultTableExportStyle,
    });
    const text = new TextDecoder("latin1").decode(bytes.slice(0, 1200));

    expect(bytes.length).toBeGreaterThan(1000);
    expect(text.startsWith("%PDF-")).toBe(true);
    expect(text).not.toContain("tauri.localhost");
  });

  it("embeds the bundled Unicode font when rendering Chinese text", async () => {
    await mockBundledUnicodeFont();

    const bytes = await createMarkdownPdf({
      markdown: "# 计划\n\n中文段落应该可以进入 PDF。\n\n- 第一项\n- 第二项",
      title: "计划",
      tableStyle: defaultTableExportStyle,
    });
    const text = new TextDecoder("latin1").decode(bytes);

    expect(bytes.length).toBeGreaterThan(1000);
    expect(globalThis.fetch).toHaveBeenCalledWith("/fonts/droid-sans-fallback-full.ttf");
    expect(text).toContain("VeloWriteUnicode");
  });

  it("fails clearly instead of exporting a garbled Unicode PDF when the font is unavailable", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));

    await expect(
      createMarkdownPdf({
        markdown: "# 计划\n\n中文段落应该可以进入 PDF。",
        title: "计划",
        tableStyle: defaultTableExportStyle,
      }),
    ).rejects.toThrow("Unicode PDF font could not be loaded");
  });

  it("encodes PDF bytes as base64 for native saving", () => {
    const bytes = new Uint8Array([37, 80, 68, 70, 45]);

    expect(pdfBytesToBase64(bytes)).toBe("JVBERi0=");
  });
});
