import { describe, expect, it } from "vitest";
import { buildPdfBlocks, createMarkdownPdf, pdfBytesToBase64 } from "./pdfExport";
import { defaultTableExportStyle } from "./editorCore";

describe("PDF export engine", () => {
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

  it("renders non-Latin text without throwing", async () => {
    const bytes = await createMarkdownPdf({
      markdown: "# 计划\n\n中文段落应该可以进入 PDF。\n\n- 第一项\n- 第二项",
      title: "计划",
      tableStyle: defaultTableExportStyle,
    });

    expect(bytes.length).toBeGreaterThan(1000);
  });

  it("encodes PDF bytes as base64 for native saving", () => {
    const bytes = new Uint8Array([37, 80, 68, 70, 45]);

    expect(pdfBytesToBase64(bytes)).toBe("JVBERi0=");
  });
});
