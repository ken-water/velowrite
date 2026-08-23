import fs from "node:fs/promises";
import path from "node:path";
import mermaid from "mermaid";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildPdfBlocks,
  createMarkdownPdf,
  pdfBytesToBase64,
  resetPdfFontCacheForTests,
  savePdfInBrowser,
} from "./pdfExport";
import { defaultPdfExportStyle, defaultTableExportStyle, type PdfExportStyle } from "./editorCore";

const unicodeFontPath = path.join(process.cwd(), "public/fonts/droid-sans-fallback-full.ttf");
const pngDataUrl =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4//8/AAX+Av4N70a4AAAAAElFTkSuQmCC";

vi.mock("html2canvas", () => ({
  default: vi.fn(async () => ({
    toDataURL: () => pngDataUrl,
  })),
}));

vi.mock("mermaid", () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn(),
  },
}));

vi.mock("canvg", () => ({
  Canvg: {
    fromString: vi.fn(() => ({
      render: vi.fn(async () => undefined),
    })),
  },
}));

async function mockBundledUnicodeFont() {
  const font = await fs.readFile(unicodeFontPath);
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(font));
}

function pdfStyle(overrides: Partial<PdfExportStyle> = {}): PdfExportStyle {
  return {
    ...defaultPdfExportStyle,
    ...overrides,
    table: {
      ...defaultPdfExportStyle.table,
      ...overrides.table,
    },
  };
}

function stubPdfRenderingDom() {
  const appended: unknown[] = [];
  const createElement = vi.fn((tagName: string) => {
    if (tagName === "canvas") {
      return {
        width: 0,
        height: 0,
        getContext: vi.fn(() => ({
          fillStyle: "",
          fillRect: vi.fn(),
          scale: vi.fn(),
        })),
        toDataURL: () => pngDataUrl,
      };
    }

    return {
      className: "",
      dataset: {},
      innerHTML: "",
      remove: vi.fn(),
      style: {},
      textContent: "",
      getBoundingClientRect: () => ({ width: 360, height: 72 }),
    };
  });

  vi.stubGlobal("document", {
    body: {
      append: vi.fn((element: unknown) => appended.push(element)),
    },
    createElement,
    head: {
      append: vi.fn((element: unknown) => appended.push(element)),
    },
  });

  return { appended, createElement };
}

describe("PDF export engine", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
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

  it("keeps mixed Chinese and English text as one readable paragraph block", () => {
    const blocks = buildPdfBlocks("This title uses English and 中文 together in one paragraph.");

    expect(blocks).toEqual([
      {
        type: "paragraph",
        text: "This title uses English and 中文 together in one paragraph.",
      },
    ]);
  });

  it("preserves tables with uneven column widths for better PDF layout", () => {
    const blocks = buildPdfBlocks(`| Field | Description | Notes |
| --- | --- | --- |
| Title | A very long description that should not collapse into a narrow column | Short note |`);

    expect(blocks).toContainEqual({
      type: "table",
      headers: ["Field", "Description", "Notes"],
      rows: [[
        "Title",
        "A very long description that should not collapse into a narrow column",
        "Short note",
      ]],
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

  it("groups consecutive ordered and unordered list items into one PDF list block", () => {
    const blocks = buildPdfBlocks(`4. Fourth
5. Fifth

- Alpha
- Beta`);

    expect(blocks).toEqual([
      { type: "list", items: ["Fourth", "Fifth"], ordered: true, start: 4 },
      { type: "list", items: ["Alpha", "Beta"], ordered: false, start: 1 },
    ]);
  });

  it("cleans common inline Markdown syntax before sending text to PDF layout", () => {
    const blocks = buildPdfBlocks(`## **Linked** [Title](https://velowrite.app)

Use \`inline code\`, ~~old text~~, ![alt text](image.png), and *emphasis*.`);

    expect(blocks).toEqual([
      { type: "heading", level: 2, text: "Linked Title" },
      {
        type: "paragraph",
        text: "Use inline code, old text, alt text, and emphasis.",
      },
    ]);
  });

  it("parses compact one-line math blocks", () => {
    const blocks = buildPdfBlocks("$$x = y + z$$");

    expect(blocks).toEqual([
      { type: "math", source: "x = y + z", display: true },
    ]);
  });

  it("parses block math as dedicated PDF math blocks", () => {
    const blocks = buildPdfBlocks(`Inline math stays in a paragraph: $E = mc^2$.

$$
\\int_0^\\infty e^{-x^2}\\,dx = \\frac{\\sqrt{\\pi}}{2}
$$`);

    expect(blocks).toEqual([
      {
        type: "paragraph",
        text: "Inline math stays in a paragraph: $E = mc^2$.",
      },
      {
        type: "math",
        source: "\\int_0^\\infty e^{-x^2}\\,dx = \\frac{\\sqrt{\\pi}}{2}",
        display: true,
      },
    ]);
  });

  it("turns simple Mermaid flowcharts into PDF diagram blocks", () => {
    const blocks = buildPdfBlocks(`\`\`\`mermaid
flowchart LR
  Draft[Draft notes] --> Preview[Live preview]
  Preview --> Export[Export PDF]
\`\`\``);

    expect(blocks).toEqual([
      {
        type: "diagram",
        title: "Flowchart",
        source: "flowchart LR\n  Draft[Draft notes] --> Preview[Live preview]\n  Preview --> Export[Export PDF]",
        nodes: ["Draft notes", "Live preview", "Export PDF"],
      },
    ]);
  });

  it("keeps complex Mermaid diagrams in the PDF diagram pipeline", () => {
    const blocks = buildPdfBlocks(`\`\`\`mermaid
sequenceDiagram
  Alice->>Bob: Hello
\`\`\``);

    expect(blocks).toEqual([
      {
        type: "diagram",
        title: "Mermaid diagram",
        source: "sequenceDiagram\n  Alice->>Bob: Hello",
        nodes: [],
      },
    ]);
  });

  it("renders Markdown horizontal rules as layout rules instead of plain text", () => {
    const blocks = buildPdfBlocks("# One\n\n---\n\n# Two");

    expect(blocks.map((block) => block.type)).toEqual(["heading", "rule", "heading"]);
  });

  it("keeps headings without a top-level title so the provided PDF title can be used", () => {
    const blocks = buildPdfBlocks(`## First Section

Body copy.`);

    expect(blocks).toEqual([
      { type: "heading", level: 2, text: "First Section" },
      { type: "paragraph", text: "Body copy." },
    ]);
  });

  it("creates a valid PDF without browser print headers", async () => {
    const bytes = await createMarkdownPdf({
      markdown: "# Plan\n\nContent that should be rendered by VeloWrite.",
      title: "Plan",
      exportStyle: pdfStyle(),
    });
    const text = new TextDecoder("latin1").decode(bytes.slice(0, 1200));

    expect(bytes.length).toBeGreaterThan(1000);
    expect(text.startsWith("%PDF-")).toBe(true);
    expect(text).not.toContain("tauri.localhost");
  });

  it("creates a valid PDF with compact Letter pages and plain table styling", async () => {
    const bytes = await createMarkdownPdf({
      markdown: `## Export Options

| Feature | State |
| --- | --- |
| Header tint | Off |
| Row striping | Off |

The export should still be valid without preview marks or page numbers.`,
      title: "Export Options",
      exportStyle: pdfStyle({
        previewMark: false,
        pageNumbers: false,
        pageNumberFormat: "simple",
        pageNumberAnchor: "left",
        pageSize: "letter",
        margins: "compact",
        table: {
          header: "plain",
          rows: "plain",
          borders: "light",
          color: "blue",
        },
      }),
    });
    const text = new TextDecoder("latin1").decode(bytes.slice(0, 1200));

    expect(bytes.length).toBeGreaterThan(1000);
    expect(text.startsWith("%PDF-")).toBe(true);
    expect(text).not.toContain("tauri.localhost");
  });

  it("renders wide tables through the card-style PDF layout branch", async () => {
    const bytes = await createMarkdownPdf({
      markdown: `# Wide Table

| Item | Owner | Status | Risk | Next step | Notes |
| --- | --- | --- | --- | --- | --- |
| Launch | Product | Active | Medium | Prepare QA | Keep the row readable on narrow pages |`,
      title: "Wide Table",
      exportStyle: pdfStyle({
        table: {
          ...defaultTableExportStyle,
          color: "gray",
        },
      }),
    });

    expect(bytes.length).toBeGreaterThan(1000);
    expect(new TextDecoder("latin1").decode(bytes.slice(0, 5))).toBe("%PDF-");
  });

  it("adds extra pages and footer branches for long documents", async () => {
    const sections = Array.from(
      { length: 32 },
      (_, index) => `## Section ${index + 1}\n\n${"Long readable paragraph. ".repeat(18)}`,
    ).join("\n\n");
    const bytes = await createMarkdownPdf({
      markdown: `# Long Export\n\n${sections}`,
      title: "Long Export",
      exportStyle: pdfStyle({
        pageNumberFormat: "label",
        pageNumberAnchor: "center",
        table: {
          ...defaultTableExportStyle,
          color: "blue",
        },
      }),
    });

    expect(bytes.length).toBeGreaterThan(5000);
  });

  it("renders display and inline math through the DOM image pipeline when available", async () => {
    const dom = stubPdfRenderingDom();
    const bytes = await createMarkdownPdf({
      markdown: `# Math Export

Inline math $a^2 + b^2 = c^2$ should stay inside the paragraph.

$$
\\sum_{n=1}^{10} n = 55
$$`,
      title: "Math Export",
      exportStyle: pdfStyle(),
    });

    expect(bytes.length).toBeGreaterThan(1000);
    expect(dom.createElement).toHaveBeenCalledWith("style");
    expect(dom.createElement).toHaveBeenCalledWith("div");
    expect(dom.appended.length).toBeGreaterThanOrEqual(2);
  });

  it("renders complex Mermaid diagrams through SVG-to-PNG conversion when available", async () => {
    stubPdfRenderingDom();
    vi.mocked(mermaid.render).mockResolvedValue({
      svg: '<svg viewBox="0 0 640 320"><rect width="640" height="320"/></svg>',
      bindFunctions: vi.fn(),
      diagramType: "sequence",
    });

    const bytes = await createMarkdownPdf({
      markdown: `# Diagram Export

\`\`\`mermaid
sequenceDiagram
  Alice->>Bob: Hello
\`\`\``,
      title: "Diagram Export",
      exportStyle: pdfStyle(),
    });

    expect(bytes.length).toBeGreaterThan(1000);
    expect(mermaid.initialize).toHaveBeenCalledWith(
      expect.objectContaining({
        securityLevel: "strict",
        startOnLoad: false,
      }),
    );
    expect(mermaid.render).toHaveBeenCalledWith(
      expect.stringMatching(/^velowrite-pdf-mermaid-/),
      "sequenceDiagram\n  Alice->>Bob: Hello",
    );
  });

  it("falls back to code rendering when Mermaid image conversion fails", async () => {
    stubPdfRenderingDom();
    vi.mocked(mermaid.render).mockResolvedValue({
      svg: "",
      bindFunctions: vi.fn(),
      diagramType: "sequence",
    });

    const bytes = await createMarkdownPdf({
      markdown: `# Broken Diagram

\`\`\`mermaid
sequenceDiagram
  Alice->>Bob: Hello
\`\`\``,
      title: "Broken Diagram",
      exportStyle: pdfStyle(),
    });

    expect(bytes.length).toBeGreaterThan(1000);
  });

  it("wraps very long code blocks across multiple PDF code boxes", async () => {
    const longCode = Array.from(
      { length: 86 },
      (_, index) => `const value${index} = "${"long-token-".repeat(18)}";`,
    ).join("\n");
    const bytes = await createMarkdownPdf({
      markdown: `# Long Code

\`\`\`javascript
${longCode}
\`\`\``,
      title: "Long Code",
      exportStyle: pdfStyle(),
    });

    expect(bytes.length).toBeGreaterThan(5000);
  });

  it("embeds the bundled Unicode font when rendering Chinese text", async () => {
    await mockBundledUnicodeFont();

    const bytes = await createMarkdownPdf({
      markdown: "# 计划\n\n中文段落应该可以进入 PDF。\n\n- 第一项\n- 第二项",
      title: "计划",
      exportStyle: pdfStyle(),
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
        exportStyle: pdfStyle(),
      }),
    ).rejects.toThrow("Unicode PDF font could not be loaded");
  });

  it("encodes PDF bytes as base64 for native saving", () => {
    const bytes = new Uint8Array([37, 80, 68, 70, 45]);

    expect(pdfBytesToBase64(bytes)).toBe("JVBERi0=");
  });

  it("saves PDF bytes through a browser download link", () => {
    const click = vi.fn();
    const link = {
      click,
      download: "",
      href: "",
    } as unknown as HTMLAnchorElement;
    const documentStub = {
      createElement: vi.fn().mockReturnValue(link),
    };
    vi.stubGlobal("document", documentStub);
    const createObjectURL = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:velowrite");
    const revokeObjectURL = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);

    savePdfInBrowser("draft.pdf", new Uint8Array([37, 80, 68, 70]));

    expect(documentStub.createElement).toHaveBeenCalledWith("a");
    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(link.href).toBe("blob:velowrite");
    expect(link.download).toBe("draft.pdf");
    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:velowrite");
  });
});
