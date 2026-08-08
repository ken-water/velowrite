import { jsPDF } from "jspdf";
import type {
  PdfExportStyle,
  PdfMarginPreset,
  PdfPageNumberAnchor,
  PdfPageNumberFormat,
  PdfPageSize,
  TableExportStyle,
} from "./editorCore";

type PdfBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered: boolean; start: number }
  | { type: "quote"; text: string }
  | { type: "code"; language: string; code: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "rule" };

type PdfTheme = {
  ink: [number, number, number];
  muted: [number, number, number];
  rule: [number, number, number];
  paper: [number, number, number];
  accent: [number, number, number];
  accentSoft: [number, number, number];
  stripe: [number, number, number];
  codeBg: [number, number, number];
};

type PdfPageConfig = {
  width: number;
  height: number;
  marginX: number;
  marginTop: number;
  marginBottom: number;
  contentWidth: number;
};

type PdfHeadingEntry = {
  level: number;
  text: string;
  pageNumber: number;
};

export type PdfExportInput = {
  markdown: string;
  title: string;
  exportStyle: PdfExportStyle;
};

const unicodeFontName = "VeloWriteUnicode";
const unicodeFontUrl = "/fonts/droid-sans-fallback-full.ttf";
let unicodeFontLoadPromise: Promise<string | null> | null = null;
let pdfBodyFont = "helvetica";
let pdfMonoFont = "courier";

const asciiBodyFont = "helvetica";
const asciiMonoFont = "courier";

const themes: Record<TableExportStyle["color"], PdfTheme> = {
  green: {
    ink: [20, 44, 36],
    muted: [82, 98, 91],
    rule: [210, 218, 212],
    paper: [251, 250, 246],
    accent: [45, 118, 86],
    accentSoft: [232, 241, 235],
    stripe: [247, 250, 247],
    codeBg: [246, 244, 239],
  },
  blue: {
    ink: [22, 40, 64],
    muted: [76, 91, 110],
    rule: [211, 220, 232],
    paper: [250, 251, 253],
    accent: [49, 100, 168],
    accentSoft: [232, 240, 251],
    stripe: [246, 249, 253],
    codeBg: [245, 247, 251],
  },
  gray: {
    ink: [35, 37, 35],
    muted: [92, 94, 90],
    rule: [218, 218, 214],
    paper: [251, 250, 247],
    accent: [84, 89, 84],
    accentSoft: [238, 238, 235],
    stripe: [247, 247, 245],
    codeBg: [245, 245, 242],
  },
};

export function buildPdfBlocks(markdown: string): PdfBlock[] {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks: PdfBlock[] = [];
  let paragraph: string[] = [];
  let index = 0;

  function flushParagraph() {
    const text = paragraph.join(" ").replace(/\s+/g, " ").trim();
    if (text) blocks.push({ type: "paragraph", text: cleanInlineMarkdown(text) });
    paragraph = [];
  }

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      index += 1;
      continue;
    }

    if (/^([-*_])(?:\s*\1){2,}\s*$/.test(trimmed)) {
      flushParagraph();
      blocks.push({ type: "rule" });
      index += 1;
      continue;
    }

    const fence = /^```([A-Za-z0-9_-]*)\s*$/.exec(trimmed);
    if (fence) {
      flushParagraph();
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      blocks.push({
        type: "code",
        language: fence[1] || "text",
        code: codeLines.join("\n"),
      });
      index += index < lines.length ? 1 : 0;
      continue;
    }

    const heading = /^(#{1,4})\s+(.+?)\s*#*$/.exec(trimmed);
    if (heading) {
      flushParagraph();
      blocks.push({
        type: "heading",
        level: heading[1].length,
        text: cleanInlineMarkdown(heading[2]),
      });
      index += 1;
      continue;
    }

    if (isTableStart(lines, index)) {
      flushParagraph();
      const { table, nextIndex } = readTable(lines, index);
      blocks.push(table);
      index = nextIndex;
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      flushParagraph();
      const quote: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quote.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push({
        type: "quote",
        text: cleanInlineMarkdown(quote.join(" ")),
      });
      continue;
    }

    const listMarker = /^((?:[-*+])|(?:\d+\.))\s+(.+)$/.exec(trimmed);
    if (listMarker) {
      flushParagraph();
      const ordered = /\d+\./.test(listMarker[1]);
      const start = ordered ? Number.parseInt(listMarker[1], 10) : 1;
      const items: string[] = [];
      while (index < lines.length) {
        const item = /^((?:[-*+])|(?:\d+\.))\s+(.+)$/.exec(lines[index].trim());
        if (!item) break;
        items.push(cleanInlineMarkdown(item[2]));
        index += 1;
      }
      blocks.push({ type: "list", items, ordered, start });
      continue;
    }

    paragraph.push(trimmed);
    index += 1;
  }

  flushParagraph();
  return blocks;
}

async function loadUnicodeFontBase64() {
  if (!unicodeFontLoadPromise) {
    unicodeFontLoadPromise = fetch(unicodeFontUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.arrayBuffer();
      })
      .then((buffer) => {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        const chunkSize = 0x8000;
        for (let index = 0; index < bytes.length; index += chunkSize) {
          binary += String.fromCharCode(...bytes.slice(index, index + chunkSize));
        }
        return btoa(binary);
      })
      .catch(() => {
        unicodeFontLoadPromise = null;
        return null;
      });
  }

  return unicodeFontLoadPromise;
}

async function preparePdfFonts(doc: jsPDF) {
  const fontBase64 = await loadUnicodeFontBase64();
  if (!fontBase64) return false;

  doc.addFileToVFS(`${unicodeFontName}.ttf`, fontBase64);
  doc.addFont(`${unicodeFontName}.ttf`, unicodeFontName, "normal");
  doc.addFont(`${unicodeFontName}.ttf`, unicodeFontName, "bold");
  pdfBodyFont = unicodeFontName;
  pdfMonoFont = unicodeFontName;
  return true;
}

export async function createMarkdownPdf(input: PdfExportInput): Promise<Uint8Array> {
  const pageConfig = getPageConfig(input.exportStyle.pageSize, input.exportStyle.margins);
  const doc = new jsPDF({
    unit: "pt",
    format: input.exportStyle.pageSize === "letter" ? "letter" : "a4",
    compress: true,
  });
  const needsUnicodeFont = /[^\u0000-\u007f]/.test(input.markdown);
  pdfBodyFont = "helvetica";
  pdfMonoFont = "courier";
  if (needsUnicodeFont) {
    const fontReady = await preparePdfFonts(doc);
    if (!fontReady) {
      throw new Error("Unicode PDF font could not be loaded. Please retry export or reinstall VeloWrite.");
    }
  }
  const theme = themes[input.exportStyle.table.color];
  const blocks = buildPdfBlocks(input.markdown);
  const { title, contentBlocks } = preparePdfDocument(blocks, input.title);
  const headingEntries: PdfHeadingEntry[] = [];
  let y = pageConfig.marginTop;

  setFill(doc, theme.paper);
  doc.rect(0, 0, pageConfig.width, pageConfig.height, "F");
  drawCover(doc, title, contentBlocks, theme, pageConfig);
  doc.addPage();
  doc.addPage();
  y = pageConfig.marginTop;

  for (const block of contentBlocks) {
    if (block.type === "heading") {
      y = drawHeading(doc, block, theme, y, pageConfig);
      headingEntries.push({
        level: block.level,
        text: block.text,
        pageNumber: doc.getCurrentPageInfo().pageNumber,
      });
    } else if (block.type === "paragraph") {
      y = drawParagraph(doc, block.text, theme, y, pageConfig);
    } else if (block.type === "list") {
      y = drawList(doc, block, theme, y, pageConfig);
    } else if (block.type === "quote") {
      y = drawQuote(doc, block.text, theme, y, pageConfig);
    } else if (block.type === "code") {
      y = drawCode(doc, block, theme, y, pageConfig);
    } else if (block.type === "table") {
      y = drawTable(doc, block, input.exportStyle.table, theme, y, pageConfig);
    } else {
      y = drawRule(doc, theme, y, pageConfig);
    }
  }

  drawContentsPage(doc, headingEntries, theme, pageConfig);
  addPdfOutline(doc, headingEntries);
  drawFooters(doc, input.exportStyle, theme, pageConfig);
  return new Uint8Array(doc.output("arraybuffer"));
}

export function resetPdfFontCacheForTests() {
  unicodeFontLoadPromise = null;
  pdfBodyFont = "helvetica";
  pdfMonoFont = "courier";
}

export function pdfBytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.slice(index, index + chunkSize));
  }
  return btoa(binary);
}

export function savePdfInBrowser(fileName: string, bytes: Uint8Array) {
  const arrayBuffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
  const blob = new Blob([arrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function preparePdfDocument(blocks: PdfBlock[], fallbackTitle: string) {
  const firstHeading = blocks.find((block) => block.type === "heading" && block.level === 1);
  const title = firstHeading?.type === "heading" ? firstHeading.text : fallbackTitle;
  const contentBlocks =
    blocks[0]?.type === "heading" && blocks[0].level === 1 && blocks[0].text === title ? blocks.slice(1) : blocks;

  return { title, contentBlocks };
}

function drawContentsPage(
  doc: jsPDF,
  headings: PdfHeadingEntry[],
  theme: PdfTheme,
  page: PdfPageConfig,
) {
  doc.setPage(2);
  setFill(doc, theme.paper);
  doc.rect(0, 0, page.width, page.height, "F");

  let y = page.marginTop;
  doc.setFont(asciiBodyFont, "bold");
  doc.setFontSize(11);
  setText(doc, theme.accent);
  doc.text("VELOWRITE EXPORT", page.marginX, y);

  y += 24;
  doc.setFontSize(22);
  setText(doc, theme.ink);
  doc.text("Contents", page.marginX, y);

  y += 28;
  setDraw(doc, theme.rule);
  doc.line(page.marginX, y, page.width - page.marginX, y);
  y += 20;

  const items = headings.filter((heading) => heading.level <= 2);
  if (items.length === 0) {
    doc.setFont(asciiBodyFont, "normal");
    doc.setFontSize(10.5);
    setText(doc, theme.muted);
    doc.text("No major sections were found in this document.", page.marginX, y);
    return;
  }

  let hiddenCount = 0;
  const listBottom = page.height - page.marginBottom - 32;
  for (const heading of items) {
    const indent = heading.level === 1 ? 0 : 18;
    const labelWidth = page.contentWidth - indent - 44;
    const lines = wrapPdfText(doc, heading.text, labelWidth, {
      size: heading.level === 1 ? 11 : 10.2,
      style: heading.level === 1 ? "bold" : "normal",
      asciiFont: asciiBodyFont,
    });
    const lineHeight = heading.level === 1 ? 15.5 : 14;
    const entryHeight = Math.max(18, lines.length * lineHeight);
    if (y + entryHeight + 8 > listBottom) {
      hiddenCount += 1;
      continue;
    }

    doc.setFont(asciiBodyFont, heading.level === 1 ? "bold" : "normal");
    doc.setFontSize(heading.level === 1 ? 11 : 10.2);
    setText(doc, heading.level === 1 ? theme.ink : theme.muted);
    drawPdfTextLines(doc, lines, page.marginX + indent, y, {
      size: heading.level === 1 ? 11 : 10.2,
      lineHeight,
      style: heading.level === 1 ? "bold" : "normal",
      asciiFont: asciiBodyFont,
      color: heading.level === 1 ? theme.ink : theme.muted,
    });
    const pageLabel = `${heading.pageNumber}`;
    doc.setFont(asciiBodyFont, "normal");
    doc.setFontSize(10);
    setText(doc, theme.accent);
    doc.text(pageLabel, page.width - page.marginX, y, { align: "right" });
    doc.setDrawColor(theme.rule[0], theme.rule[1], theme.rule[2]);
    doc.line(page.marginX + indent, y + 6, page.width - page.marginX - 18, y + 6);
    y += entryHeight + 4;
  }

  doc.setFont(asciiBodyFont, "normal");
  doc.setFontSize(9.5);
  setText(doc, theme.muted);
  const footer =
    hiddenCount > 0
      ? `${hiddenCount} more section${hiddenCount === 1 ? "" : "s"} are available in PDF bookmarks.`
      : "Bookmarks include all section levels.";
  doc.text(footer, page.marginX, page.height - page.marginBottom - 6);
}

function addPdfOutline(doc: jsPDF, headings: PdfHeadingEntry[]) {
  const outline = (doc as unknown as { outline?: { add?: (...args: unknown[]) => void } }).outline;
  if (!outline?.add) return;

  for (const heading of headings) {
    outline.add(null, heading.text, { pageNumber: heading.pageNumber });
  }
}

function getPageConfig(pageSize: PdfPageSize, margins: PdfMarginPreset): PdfPageConfig {
  const layout =
    pageSize === "letter"
      ? { width: 612, height: 792 }
      : { width: 595.28, height: 841.89 };
  const marginScale = margins === "compact" ? 0.82 : 1;
  const marginX = Math.round(46 * marginScale);
  const marginTop = Math.round(48 * marginScale);
  const marginBottom = Math.round(52 * marginScale);
  return {
    width: layout.width,
    height: layout.height,
    marginX,
    marginTop,
    marginBottom,
    contentWidth: layout.width - marginX * 2,
  };
}

function drawCover(
  doc: jsPDF,
  title: string,
  blocks: PdfBlock[],
  theme: PdfTheme,
  page: PdfPageConfig,
) {
  doc.setFont(asciiBodyFont, "bold");
  doc.setFontSize(11);
  setText(doc, theme.accent);
  let y = page.marginTop;
  doc.text("VELOWRITE EXPORT", page.marginX, y);

  y += 24;
  doc.setFontSize(24);
  setText(doc, theme.ink);
  const titleLines = wrapPdfText(doc, title, page.contentWidth, {
    size: 24,
    style: "bold",
    asciiFont: asciiBodyFont,
  });
  drawPdfTextLines(doc, titleLines, page.marginX, y, {
    size: 24,
    lineHeight: 29,
    style: "bold",
    asciiFont: asciiBodyFont,
    color: theme.ink,
  });
  y += titleLines.length * 29 + 4;

  doc.setFont(asciiBodyFont, "normal");
  doc.setFontSize(10);
  setText(doc, theme.muted);
  doc.text("Markdown source preserved", page.marginX, y);

  y += 26;
  setDraw(doc, theme.rule);
  doc.line(page.marginX, y, page.width - page.marginX, y);

  y += 34;
  const summary = getCoverSummary(blocks);
  const cardHeight = 154;
  setFill(doc, [255, 255, 255]);
  setDraw(doc, theme.rule);
  doc.roundedRect(page.marginX, y, page.contentWidth, cardHeight, 8, 8, "FD");

  const fields = [
    ["Sections", String(summary.sections)],
    ["Tables", String(summary.tables)],
    ["Code blocks", String(summary.codeBlocks)],
    ["Estimated length", `${summary.characters.toLocaleString("en-US")} chars`],
  ];
  const columnWidth = page.contentWidth / 2;
  fields.forEach(([label, value], index) => {
    const x = page.marginX + (index % 2) * columnWidth + 18;
    const rowY = y + 36 + Math.floor(index / 2) * 58;
    doc.setFont(asciiBodyFont, "bold");
    doc.setFontSize(8.8);
    setText(doc, theme.accent);
    doc.text(label.toUpperCase(), x, rowY);
    doc.setFont(asciiBodyFont, "normal");
    doc.setFontSize(16);
    setText(doc, theme.ink);
    doc.text(value, x, rowY + 23);
  });

  y += cardHeight + 34;
  drawPdfTextLines(
    doc,
    wrapPdfText(
      doc,
      "Formatted for focused reading. Contents follow next. The document body starts after that.",
      page.contentWidth,
      { size: 10.2, style: "normal", asciiFont: asciiBodyFont },
    ),
    page.marginX,
    y,
    {
      size: 10.2,
      lineHeight: 15,
      style: "normal",
      asciiFont: asciiBodyFont,
      color: theme.muted,
    },
  );

  const footerY = page.height - page.marginBottom - 44;
  setFill(doc, theme.accentSoft);
  doc.roundedRect(page.marginX, footerY - 22, page.contentWidth, 48, 8, 8, "F");
  doc.setFont(asciiBodyFont, "bold");
  doc.setFontSize(10);
  setText(doc, theme.ink);
  doc.text("Contents on page 2. Document starts on page 3.", page.marginX + 16, footerY + 5);
  return y + 52;
}

function getCoverSummary(blocks: PdfBlock[]) {
  return blocks.reduce(
    (summary, block) => {
      if (block.type === "heading") summary.sections += 1;
      if (block.type === "table") summary.tables += 1;
      if (block.type === "code") summary.codeBlocks += 1;
      summary.characters += getBlockTextLength(block);
      return summary;
    },
    { sections: 0, tables: 0, codeBlocks: 0, characters: 0 },
  );
}

function getBlockTextLength(block: PdfBlock) {
  if (block.type === "heading" || block.type === "paragraph" || block.type === "quote") {
    return block.text.length;
  }
  if (block.type === "list") return block.items.join("").length;
  if (block.type === "code") return block.code.length;
  if (block.type === "table") return [...block.headers, ...block.rows.flat()].join("").length;
  return 0;
}

function drawHeading(
  doc: jsPDF,
  block: Extract<PdfBlock, { type: "heading" }>,
  theme: PdfTheme,
  y: number,
  page: PdfPageConfig,
) {
  const size = block.level === 1 ? 20 : block.level === 2 ? 15.5 : 13;
  const before = block.level === 1 ? 16 : 12;
  const lines = wrapPdfText(doc, block.text, page.contentWidth, {
    size,
    style: "bold",
    asciiFont: asciiBodyFont,
  });
  const lineHeight = size * 1.2;
  const reserve = lines.length * lineHeight + (block.level === 1 ? 52 : 36);
  y = ensureSpace(doc, y + before, reserve, theme, page);

  drawPdfTextLines(doc, lines, page.marginX, y, {
    size,
    lineHeight,
    style: "bold",
    asciiFont: asciiBodyFont,
    color: theme.ink,
  });
  return y + lines.length * lineHeight + (block.level === 1 ? 10 : 8);
}

function drawParagraph(doc: jsPDF, text: string, theme: PdfTheme, y: number, page: PdfPageConfig) {
  const size = 10.5;
  const lineHeight = 15.2;
  const lines = wrapPdfText(doc, text, page.contentWidth, {
    size,
    style: "normal",
    asciiFont: asciiBodyFont,
  });
  y = ensureSpace(doc, y, lines.length * lineHeight + 8, theme, page);
  drawPdfTextLines(doc, lines, page.marginX, y, {
    size,
    lineHeight,
    style: "normal",
    asciiFont: asciiBodyFont,
    color: theme.muted,
  });
  return y + lines.length * lineHeight + 8;
}

function drawList(
  doc: jsPDF,
  block: Extract<PdfBlock, { type: "list" }>,
  theme: PdfTheme,
  y: number,
  page: PdfPageConfig,
) {
  const size = 10.5;
  const lineHeight = 15;

  for (let index = 0; index < block.items.length; index += 1) {
    const marker = block.ordered ? `${block.start + index}.` : "•";
    const lines = wrapPdfText(doc, block.items[index], page.contentWidth - 30, {
      size,
      style: "normal",
      asciiFont: asciiBodyFont,
    });
    y = ensureSpace(doc, y, lines.length * lineHeight + 7, theme, page);
    doc.setFont(asciiBodyFont, "normal");
    doc.setFontSize(size);
    setText(doc, theme.muted);
    doc.text(marker, page.marginX + 10, y);
    drawPdfTextLines(doc, lines, page.marginX + 28, y, {
      size,
      lineHeight,
      style: "normal",
      asciiFont: asciiBodyFont,
      color: theme.muted,
    });
    y += lines.length * lineHeight + 5;
  }

  return y + 4;
}

function drawQuote(doc: jsPDF, text: string, theme: PdfTheme, y: number, page: PdfPageConfig) {
  const width = page.contentWidth - 18;
  const lines = wrapPdfText(doc, text, width - 24, {
    size: 10.2,
    style: "normal",
    asciiFont: asciiBodyFont,
  });
  const height = lines.length * 14.8 + 20;
  y = ensureSpace(doc, y, height + 10, theme, page);

  setFill(doc, theme.accentSoft);
  doc.roundedRect(page.marginX, y - 12, width, height, 6, 6, "F");
  setFill(doc, theme.accent);
  doc.rect(page.marginX, y - 12, 3, height, "F");
  drawPdfTextLines(doc, lines, page.marginX + 16, y + 4, {
    size: 10.2,
    lineHeight: 14.8,
    style: "normal",
    asciiFont: asciiBodyFont,
    color: theme.muted,
  });
  return y + height + 10;
}

function drawRule(doc: jsPDF, theme: PdfTheme, y: number, page: PdfPageConfig) {
  y = ensureSpace(doc, y + 8, 28, theme, page);
  setDraw(doc, theme.rule);
  doc.line(page.marginX, y, page.width - page.marginX, y);
  return y + 18;
}

function drawCode(
  doc: jsPDF,
  block: Extract<PdfBlock, { type: "code" }>,
  theme: PdfTheme,
  y: number,
  page: PdfPageConfig,
) {
  const size = 8.9;
  const rawLines = block.code.split("\n");
  const lines = rawLines.flatMap((line) =>
    wrapPdfText(doc, line || " ", page.contentWidth - 28, {
      size,
      style: "normal",
      asciiFont: asciiMonoFont,
    }),
  );
  const lineHeight = 12.2;
  const maxLinesPerBox = 40;

  for (let start = 0; start < lines.length || start === 0; start += maxLinesPerBox) {
    const chunk = lines.slice(start, start + maxLinesPerBox);
    const height = Math.max(42, chunk.length * lineHeight + 28);
    y = ensureSpace(doc, y, height + 12, theme, page);

    setFill(doc, theme.codeBg);
    setDraw(doc, theme.rule);
    doc.roundedRect(page.marginX, y - 12, page.contentWidth, height, 7, 7, "FD");
    doc.setFont(asciiBodyFont, "bold");
    doc.setFontSize(8);
    setText(doc, theme.accent);
    doc.text(block.language.toUpperCase(), page.marginX + 12, y + 2);
    drawPdfTextLines(doc, chunk.length ? chunk : [" "], page.marginX + 12, y + 18, {
      size,
      lineHeight,
      style: "normal",
      asciiFont: asciiMonoFont,
      color: [42, 52, 48],
    });
    y += height + 14;
  }

  return y;
}

function drawTable(
  doc: jsPDF,
  block: Extract<PdfBlock, { type: "table" }>,
  tableStyle: TableExportStyle,
  theme: PdfTheme,
  y: number,
  page: PdfPageConfig,
) {
  const columnCount = Math.max(1, block.headers.length);
  if (columnCount > 5) {
    return drawWideTableCards(doc, block, theme, y, page);
  }

  const columnWidths = getTableColumnWidths(doc, block, page.contentWidth);
  const rowPadding = 7;
  const borderColor: [number, number, number] =
    tableStyle.borders === "strong" ? [150, 164, 156] : theme.rule;

  function drawRow(cells: string[], isHeader: boolean, rowIndex: number) {
    const size = isHeader ? 9.4 : 9;
    const lineHeight = isHeader ? 11.8 : 11.5;
    const wrapped = Array.from({ length: columnCount }, (_, index) =>
      wrapPdfText(doc, cleanInlineMarkdown(cells[index] ?? "") || "-", columnWidths[index] - rowPadding * 2, {
        size,
        style: isHeader ? "bold" : "normal",
        asciiFont: asciiBodyFont,
      }),
    );
    const rowHeight = Math.max(25, Math.max(...wrapped.map((lines) => lines.length)) * lineHeight + 14);
    y = ensureSpace(doc, y, rowHeight + 4, theme, page);

    const shouldTintHeader = isHeader && tableStyle.header === "tinted";
    const shouldStripe = !isHeader && tableStyle.rows === "striped" && rowIndex % 2 === 1;
    const fillColor: [number, number, number] = shouldTintHeader
      ? theme.accentSoft
      : shouldStripe
        ? theme.stripe
        : [255, 255, 255];

    let x = page.marginX;
    for (let column = 0; column < columnCount; column += 1) {
      const columnWidth = columnWidths[column];
      setFill(doc, fillColor);
      setDraw(doc, borderColor);
      doc.rect(x, y - 12, columnWidth, rowHeight, "FD");
      drawPdfTextLines(doc, wrapped[column], x + rowPadding, y + 5, {
        size,
        lineHeight,
        style: isHeader ? "bold" : "normal",
        asciiFont: asciiBodyFont,
        color: isHeader ? theme.ink : theme.muted,
      });
      x += columnWidth;
    }

    y += rowHeight;
  }

  y += 6;
  drawRow(block.headers, true, 0);
  block.rows.forEach((row, rowIndex) => drawRow(row, false, rowIndex));
  return y + 18;
}

function drawWideTableCards(
  doc: jsPDF,
  block: Extract<PdfBlock, { type: "table" }>,
  theme: PdfTheme,
  y: number,
  page: PdfPageConfig,
) {
  const labelWidth = 92;
  const columnGap = 20;
  const pairWidth = (page.contentWidth - columnGap) / 2;
  const valueWidth = pairWidth - 8;

  for (const row of block.rows) {
    const fields = block.headers.slice(1).map((header, index) => ({
      label: cleanInlineMarkdown(header),
      value: cleanInlineMarkdown(row[index + 1] ?? ""),
    }));
    const measured = fields.map((field) =>
      Math.max(
        42,
        wrapPdfText(doc, field.value || "-", valueWidth, {
          size: 9.2,
          style: "normal",
          asciiFont: asciiBodyFont,
        }).length *
          11.6 +
          28,
      ),
    );
    const pairs = Math.ceil(fields.length / 2);
    const bodyHeight = Array.from({ length: pairs }, (_, index) =>
      Math.max(measured[index * 2] ?? 0, measured[index * 2 + 1] ?? 0),
    ).reduce((total, height) => total + height, 0);
    const cardHeight = Math.max(88, bodyHeight + 54);
    y = ensureSpace(doc, y, cardHeight + 16, theme, page);

    setFill(doc, [255, 255, 255]);
    setDraw(doc, theme.rule);
    doc.roundedRect(page.marginX, y - 12, page.contentWidth, cardHeight, 7, 7, "FD");

    setFill(doc, theme.accentSoft);
    doc.roundedRect(page.marginX, y - 12, page.contentWidth, 34, 7, 7, "F");
    doc.rect(page.marginX, y + 10, page.contentWidth, 12, "F");
    drawPdfTextLines(
      doc,
      wrapPdfText(doc, `${block.headers[0]} ${cleanInlineMarkdown(row[0] ?? "")}`, page.contentWidth - 28, {
        size: 11.5,
        style: "bold",
        asciiFont: asciiBodyFont,
      }),
      page.marginX + 14,
      y + 10,
      {
        size: 11.5,
        lineHeight: 13.5,
        style: "bold",
        asciiFont: asciiBodyFont,
        color: theme.ink,
      },
    );

    let nextY = y + 38;
    for (let index = 0; index < fields.length; index += 2) {
      const first = fields[index];
      const second = fields[index + 1];
      const rowHeight = Math.max(measured[index] ?? 0, measured[index + 1] ?? 0);
      drawFieldPair(doc, first, page.marginX + 14, nextY, labelWidth, valueWidth, theme);
      if (second) {
        drawFieldPair(
          doc,
          second,
          page.marginX + 14 + pairWidth + columnGap,
          nextY,
          labelWidth,
          valueWidth,
          theme,
        );
      }
      nextY += rowHeight;
    }

    y += cardHeight + 16;
  }

  return y + 4;
}

function drawFieldPair(
  doc: jsPDF,
  field: { label: string; value: string },
  x: number,
  y: number,
  _labelWidth: number,
  valueWidth: number,
  theme: PdfTheme,
) {
  drawPdfTextLines(doc, [field.label], x, y, {
    size: 8.5,
    lineHeight: 10,
    style: "bold",
    asciiFont: asciiBodyFont,
    color: theme.accent,
  });

  const lines = wrapPdfText(doc, field.value || "-", valueWidth, {
    size: 9.2,
    style: "normal",
    asciiFont: asciiBodyFont,
  });
  drawPdfTextLines(doc, lines, x, y + 15, {
    size: 9.2,
    lineHeight: 11.6,
    style: "normal",
    asciiFont: asciiBodyFont,
    color: theme.muted,
  });
}

function ensureSpace(doc: jsPDF, y: number, needed: number, theme: PdfTheme, page: PdfPageConfig) {
  if (y + needed <= page.height - page.marginBottom) return y;
  doc.addPage();
  setFill(doc, theme.paper);
  doc.rect(0, 0, page.width, page.height, "F");
  return page.marginTop;
}

function formatPageNumber(pageIndex: number, pageCount: number, format: PdfPageNumberFormat) {
  if (format === "simple") return `${pageIndex}`;
  if (format === "label") return `Page ${pageIndex}`;
  return `Page ${pageIndex} / ${pageCount}`;
}

function drawFooters(doc: jsPDF, exportStyle: PdfExportStyle, theme: PdfTheme, page: PdfPageConfig) {
  const pageCount = doc.getNumberOfPages();
  for (let index = 1; index <= pageCount; index += 1) {
    doc.setPage(index);
    setDraw(doc, theme.rule);
    doc.line(page.marginX, page.height - 42, page.width - page.marginX, page.height - 42);
    doc.setFont(pdfBodyFont, "normal");
    doc.setFontSize(8.5);
    setText(doc, theme.muted);
    const pageNumberText = formatPageNumber(index, pageCount, exportStyle.pageNumberFormat);
    const anchorX =
      exportStyle.pageNumberAnchor === "left"
        ? page.marginX
        : exportStyle.pageNumberAnchor === "center"
          ? page.width / 2
          : page.width - page.marginX;
    const align =
      exportStyle.pageNumberAnchor === "left"
        ? "left"
        : exportStyle.pageNumberAnchor === "center"
          ? "center"
          : "right";
    if (exportStyle.pageNumbers) {
      doc.text(pageNumberText, anchorX, page.height - 25, { align });
    }
    if (exportStyle.previewMark) {
      doc.text(
        "Created with VeloWrite Preview. Pro exports will remove this mark.",
        exportStyle.pageNumberAnchor === "right" ? page.marginX : page.width - page.marginX,
        page.height - 25,
        { align: exportStyle.pageNumberAnchor === "right" ? "left" : "right" },
      );
    }
  }
}

function isTableStart(lines: string[], index: number) {
  return Boolean(lines[index]?.includes("|") && lines[index + 1] && isSeparatorRow(lines[index + 1]));
}

function readTable(lines: string[], index: number) {
  const headers = splitTableRow(lines[index]);
  index += 2;
  const rows: string[][] = [];
  while (index < lines.length && lines[index].includes("|") && lines[index].trim()) {
    rows.push(splitTableRow(lines[index]));
    index += 1;
  }
  return {
    table: { type: "table", headers, rows } as PdfBlock,
    nextIndex: index,
  };
}

function splitTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isSeparatorRow(line: string) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

type PdfTextOptions = {
  size: number;
  style: "normal" | "bold";
  asciiFont: string;
};

type DrawPdfTextOptions = PdfTextOptions & {
  color: [number, number, number];
  lineHeight: number;
};

function getTableColumnWidths(
  doc: jsPDF,
  block: Extract<PdfBlock, { type: "table" }>,
  totalWidth: number,
) {
  const columnCount = Math.max(1, block.headers.length);
  const samples = Array.from({ length: columnCount }, (_, column) => [
    block.headers[column] ?? "",
    ...block.rows.map((row) => row[column] ?? ""),
  ]);
  const scores = samples.map((values) => {
    const visibleValues = values.map((value) => cleanInlineMarkdown(value)).filter(Boolean);
    const maxTextWidth = Math.max(
      28,
      ...visibleValues.map((value) =>
        Math.min(160, measurePdfText(doc, value, { size: 9, style: "normal", asciiFont: asciiBodyFont })),
      ),
    );
    const emptyRatio =
      visibleValues.length === 0 ? 0.55 : visibleValues.filter((value) => value === "-").length / visibleValues.length;
    return Math.max(0.7, maxTextWidth / 60) * (1 - emptyRatio * 0.28);
  });
  const totalScore = scores.reduce((total, score) => total + score, 0) || 1;
  const minWidth = columnCount >= 4 ? 62 : 88;
  const initial = scores.map((score) => Math.max(minWidth, (score / totalScore) * totalWidth));
  const initialTotal = initial.reduce((total, width) => total + width, 0);

  if (initialTotal <= totalWidth) {
    const extra = (totalWidth - initialTotal) / columnCount;
    return initial.map((width) => width + extra);
  }

  const shrinkable = initial.reduce((total, width) => total + Math.max(0, width - minWidth), 0) || 1;
  const overflow = initialTotal - totalWidth;
  return initial.map((width) => width - (Math.max(0, width - minWidth) / shrinkable) * overflow);
}

function wrapPdfText(doc: jsPDF, text: string, maxWidth: number, options: PdfTextOptions) {
  const tokens = tokenizePdfText(text);
  const lines: string[] = [];
  let line = "";

  for (const token of tokens) {
    if (!token) continue;
    const candidate = line ? line + token : token.trimStart();
    if (!candidate.trim()) continue;

    if (measurePdfText(doc, candidate, options) <= maxWidth) {
      line = candidate;
      continue;
    }

    if (line.trim()) lines.push(line.trimEnd());
    line = "";

    const chunks = splitOversizedToken(doc, token.trimStart(), maxWidth, options);
    if (chunks.length > 1) lines.push(...chunks.slice(0, -1));
    line = chunks[chunks.length - 1] ?? "";
  }

  if (line.trim()) lines.push(line.trimEnd());
  return lines.length ? lines : [""];
}

function splitOversizedToken(doc: jsPDF, token: string, maxWidth: number, options: PdfTextOptions) {
  if (measurePdfText(doc, token, options) <= maxWidth) return [token];

  const chunks: string[] = [];
  let chunk = "";
  for (const char of Array.from(token)) {
    const candidate = chunk + char;
    if (chunk && measurePdfText(doc, candidate, options) > maxWidth) {
      chunks.push(chunk);
      chunk = char;
    } else {
      chunk = candidate;
    }
  }
  if (chunk) chunks.push(chunk);
  return chunks;
}

function tokenizePdfText(text: string) {
  const tokens: string[] = [];
  let ascii = "";

  for (const char of Array.from(text)) {
    if (/[\u0000-\u007f]/.test(char)) {
      ascii += char;
      continue;
    }

    flushAsciiTokens();
    tokens.push(char);
  }

  flushAsciiTokens();
  return tokens;

  function flushAsciiTokens() {
    if (!ascii) return;
    tokens.push(...(ascii.match(/\s+|[^\s]+/g) ?? []));
    ascii = "";
  }
}

function measurePdfText(doc: jsPDF, text: string, options: PdfTextOptions) {
  return splitFontRuns(text).reduce((width, run) => {
    doc.setFont(getRunFont(run.text, options.asciiFont), options.style);
    doc.setFontSize(options.size);
    return width + doc.getTextWidth(run.text);
  }, 0);
}

function drawPdfTextLines(doc: jsPDF, lines: string[], x: number, y: number, options: DrawPdfTextOptions) {
  setText(doc, options.color);
  lines.forEach((line, lineIndex) => {
    let cursor = x;
    for (const run of splitFontRuns(line || " ")) {
      doc.setFont(getRunFont(run.text, options.asciiFont), options.style);
      doc.setFontSize(options.size);
      doc.text(run.text, cursor, y + lineIndex * options.lineHeight);
      cursor += doc.getTextWidth(run.text);
    }
  });
}

function splitFontRuns(text: string) {
  const runs: { text: string; unicode: boolean }[] = [];
  let current = "";
  let currentUnicode: boolean | null = null;

  for (const char of Array.from(text)) {
    const unicode = /[^\u0000-\u007f]/.test(char);
    if (current && unicode !== currentUnicode) {
      runs.push({ text: current, unicode: Boolean(currentUnicode) });
      current = "";
    }
    current += char;
    currentUnicode = unicode;
  }

  if (current) runs.push({ text: current, unicode: Boolean(currentUnicode) });
  return runs;
}

function getRunFont(text: string, asciiFont: string) {
  return /[^\u0000-\u007f]/.test(text) ? pdfBodyFont : asciiFont;
}

function cleanInlineMarkdown(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function setText(doc: jsPDF, color: [number, number, number]) {
  doc.setTextColor(color[0], color[1], color[2]);
}

function setFill(doc: jsPDF, color: [number, number, number]) {
  doc.setFillColor(color[0], color[1], color[2]);
}

function setDraw(doc: jsPDF, color: [number, number, number]) {
  doc.setDrawColor(color[0], color[1], color[2]);
}
