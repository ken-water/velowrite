import { jsPDF } from "jspdf";
import type { TableExportStyle } from "./editorCore";

type PdfBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered: boolean; start: number }
  | { type: "quote"; text: string }
  | { type: "code"; language: string; code: string }
  | { type: "table"; headers: string[]; rows: string[][] };

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

export type PdfExportInput = {
  markdown: string;
  title: string;
  tableStyle: TableExportStyle;
  previewMark?: boolean;
};

const unicodeFontName = "VeloWriteUnicode";
const unicodeFontUrl = "/fonts/droid-sans-fallback-full.ttf";
let unicodeFontLoadPromise: Promise<string | null> | null = null;
let pdfBodyFont = "helvetica";
let pdfMonoFont = "courier";

const page = {
  width: 595.28,
  height: 841.89,
  marginX: 54,
  marginTop: 58,
  marginBottom: 58,
};

const contentWidth = page.width - page.marginX * 2;

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

async function preparePdfFonts(doc: jsPDF) {
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
      .catch(() => null);
  }

  const fontBase64 = await unicodeFontLoadPromise;
  if (!fontBase64) return;

  doc.addFileToVFS(`${unicodeFontName}.ttf`, fontBase64);
  doc.addFont(`${unicodeFontName}.ttf`, unicodeFontName, "normal");
  doc.addFont(`${unicodeFontName}.ttf`, unicodeFontName, "bold");
  pdfBodyFont = unicodeFontName;
  pdfMonoFont = unicodeFontName;
}

export async function createMarkdownPdf(input: PdfExportInput): Promise<Uint8Array> {
  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
  const needsUnicodeFont = /[^\u0000-\u007f]/.test(input.markdown);
  pdfBodyFont = needsUnicodeFont ? unicodeFontName : "helvetica";
  pdfMonoFont = needsUnicodeFont ? unicodeFontName : "courier";
  if (needsUnicodeFont) {
    await preparePdfFonts(doc);
  }
  const theme = themes[input.tableStyle.color];
  const blocks = buildPdfBlocks(input.markdown);
  let y = page.marginTop;

  setFill(doc, theme.paper);
  doc.rect(0, 0, page.width, page.height, "F");
  y = drawCover(doc, input.title, theme, y);

  for (const block of blocks) {
    if (block.type === "heading") {
      y = drawHeading(doc, block, theme, y);
    } else if (block.type === "paragraph") {
      y = drawParagraph(doc, block.text, theme, y);
    } else if (block.type === "list") {
      y = drawList(doc, block, theme, y);
    } else if (block.type === "quote") {
      y = drawQuote(doc, block.text, theme, y);
    } else if (block.type === "code") {
      y = drawCode(doc, block, theme, y);
    } else {
      y = drawTable(doc, block, input.tableStyle, theme, y);
    }
  }

  drawFooters(doc, input.previewMark ?? true, theme);
  return new Uint8Array(doc.output("arraybuffer"));
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

function drawCover(doc: jsPDF, title: string, theme: PdfTheme, y: number) {
  doc.setFont(pdfBodyFont, "bold");
  doc.setFontSize(11);
  setText(doc, theme.accent);
  doc.text("VELOWRITE EXPORT", page.marginX, y);

  y += 28;
  doc.setFontSize(28);
  setText(doc, theme.ink);
  doc.text(splitLongTitle(doc, title), page.marginX, y, {
    maxWidth: contentWidth,
    lineHeightFactor: 1.12,
  });
  y += title.length > 42 ? 62 : 42;

  doc.setFont(pdfBodyFont, "normal");
  doc.setFontSize(10);
  setText(doc, theme.muted);
  doc.text("Markdown source preserved", page.marginX, y);

  y += 26;
  setDraw(doc, theme.rule);
  doc.line(page.marginX, y, page.width - page.marginX, y);
  return y + 26;
}

function drawHeading(doc: jsPDF, block: Extract<PdfBlock, { type: "heading" }>, theme: PdfTheme, y: number) {
  const size = block.level === 1 ? 22 : block.level === 2 ? 17 : 14;
  const before = block.level === 1 ? 18 : 15;
  y = ensureSpace(doc, y + before, 48, theme);

  doc.setFont(pdfBodyFont, "bold");
  doc.setFontSize(size);
  setText(doc, theme.ink);
  const lines = doc.splitTextToSize(block.text, contentWidth);
  doc.text(lines, page.marginX, y, { lineHeightFactor: 1.16 });
  return y + lines.length * size * 1.18 + 10;
}

function drawParagraph(doc: jsPDF, text: string, theme: PdfTheme, y: number) {
  doc.setFont(pdfBodyFont, "normal");
  doc.setFontSize(11.5);
  setText(doc, theme.muted);
  const lines = doc.splitTextToSize(text, contentWidth);
  y = ensureSpace(doc, y, lines.length * 17 + 10, theme);
  doc.text(lines, page.marginX, y, { lineHeightFactor: 1.42 });
  return y + lines.length * 16.5 + 12;
}

function drawList(doc: jsPDF, block: Extract<PdfBlock, { type: "list" }>, theme: PdfTheme, y: number) {
  doc.setFont(pdfBodyFont, "normal");
  doc.setFontSize(11.5);
  setText(doc, theme.muted);

  for (let index = 0; index < block.items.length; index += 1) {
    const marker = block.ordered ? `${block.start + index}.` : "•";
    const lines = doc.splitTextToSize(block.items[index], contentWidth - 28);
    y = ensureSpace(doc, y, lines.length * 16 + 8, theme);
    doc.text(marker, page.marginX + 12, y);
    doc.text(lines, page.marginX + 30, y, { lineHeightFactor: 1.4 });
    y += lines.length * 16 + 6;
  }

  return y + 6;
}

function drawQuote(doc: jsPDF, text: string, theme: PdfTheme, y: number) {
  const width = contentWidth - 18;
  const lines = doc.splitTextToSize(text, width - 24);
  const height = lines.length * 16 + 22;
  y = ensureSpace(doc, y, height + 10, theme);

  setFill(doc, theme.accentSoft);
  doc.roundedRect(page.marginX, y - 12, width, height, 6, 6, "F");
  setFill(doc, theme.accent);
  doc.rect(page.marginX, y - 12, 3, height, "F");
  doc.setFont(pdfBodyFont, "normal");
  doc.setFontSize(11);
  setText(doc, theme.muted);
  doc.text(lines, page.marginX + 16, y + 4, { lineHeightFactor: 1.42 });
  return y + height + 10;
}

function drawCode(doc: jsPDF, block: Extract<PdfBlock, { type: "code" }>, theme: PdfTheme, y: number) {
  const codeFont = /[^\u0000-\u007f]/.test(block.code) ? pdfBodyFont : pdfMonoFont;
  doc.setFont(codeFont, "normal");
  doc.setFontSize(9.2);
  const rawLines = block.code.split("\n");
  const lines = rawLines.flatMap((line) => doc.splitTextToSize(line || " ", contentWidth - 28));
  const lineHeight = 12.5;
  const maxLinesPerBox = 36;

  for (let start = 0; start < lines.length || start === 0; start += maxLinesPerBox) {
    const chunk = lines.slice(start, start + maxLinesPerBox);
    const height = Math.max(42, chunk.length * lineHeight + 28);
    y = ensureSpace(doc, y, height + 12, theme);

    setFill(doc, theme.codeBg);
    setDraw(doc, theme.rule);
    doc.roundedRect(page.marginX, y - 12, contentWidth, height, 7, 7, "FD");
    doc.setFont(pdfBodyFont, "bold");
    doc.setFontSize(8);
    setText(doc, theme.accent);
    doc.text(block.language.toUpperCase(), page.marginX + 12, y + 2);
    doc.setFont(codeFont, "normal");
    doc.setFontSize(9.2);
    setText(doc, [42, 52, 48]);
    doc.text(chunk.length ? chunk : [" "], page.marginX + 12, y + 19, {
      lineHeightFactor: 1.35,
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
) {
  const columnCount = Math.max(1, block.headers.length);
  if (columnCount > 5) {
    return drawWideTableCards(doc, block, theme, y);
  }

  const columnWidth = contentWidth / columnCount;
  const rowPadding = 8;
  const borderColor: [number, number, number] =
    tableStyle.borders === "strong" ? [150, 164, 156] : theme.rule;

  function drawRow(cells: string[], isHeader: boolean, rowIndex: number) {
    doc.setFont(pdfBodyFont, isHeader ? "bold" : "normal");
    doc.setFontSize(isHeader ? 9.8 : 9.4);
    const wrapped = Array.from({ length: columnCount }, (_, index) =>
      doc.splitTextToSize(cleanInlineMarkdown(cells[index] ?? ""), columnWidth - rowPadding * 2),
    );
    const rowHeight = Math.max(28, Math.max(...wrapped.map((lines) => lines.length)) * 12 + 16);
    y = ensureSpace(doc, y, rowHeight + 4, theme);

    const shouldTintHeader = isHeader && tableStyle.header === "tinted";
    const shouldStripe = !isHeader && tableStyle.rows === "striped" && rowIndex % 2 === 1;
    const fillColor: [number, number, number] = shouldTintHeader
      ? theme.accentSoft
      : shouldStripe
        ? theme.stripe
        : [255, 255, 255];

    for (let column = 0; column < columnCount; column += 1) {
      const x = page.marginX + column * columnWidth;
      setFill(doc, fillColor);
      setDraw(doc, borderColor);
      doc.rect(x, y - 12, columnWidth, rowHeight, "FD");
      setText(doc, isHeader ? theme.ink : theme.muted);
      doc.text(wrapped[column], x + rowPadding, y + 5, { lineHeightFactor: 1.25 });
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
) {
  const labelWidth = 92;
  const columnGap = 20;
  const pairWidth = (contentWidth - columnGap) / 2;
  const valueWidth = pairWidth - 8;

  for (const row of block.rows) {
    const fields = block.headers.slice(1).map((header, index) => ({
      label: cleanInlineMarkdown(header),
      value: cleanInlineMarkdown(row[index + 1] ?? ""),
    }));
    const measured = fields.map((field) =>
      Math.max(42, doc.splitTextToSize(field.value, valueWidth).length * 12 + 28),
    );
    const pairs = Math.ceil(fields.length / 2);
    const bodyHeight = Array.from({ length: pairs }, (_, index) =>
      Math.max(measured[index * 2] ?? 0, measured[index * 2 + 1] ?? 0),
    ).reduce((total, height) => total + height, 0);
    const cardHeight = Math.max(88, bodyHeight + 54);
    y = ensureSpace(doc, y, cardHeight + 16, theme);

    setFill(doc, [255, 255, 255]);
    setDraw(doc, theme.rule);
    doc.roundedRect(page.marginX, y - 12, contentWidth, cardHeight, 7, 7, "FD");

    setFill(doc, theme.accentSoft);
    doc.roundedRect(page.marginX, y - 12, contentWidth, 34, 7, 7, "F");
    doc.rect(page.marginX, y + 10, contentWidth, 12, "F");
    doc.setFont(pdfBodyFont, "bold");
    doc.setFontSize(12);
    setText(doc, theme.ink);
    doc.text(`${block.headers[0]} ${cleanInlineMarkdown(row[0] ?? "")}`, page.marginX + 14, y + 10);

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
  doc.setFont(pdfBodyFont, "bold");
  doc.setFontSize(8.5);
  setText(doc, theme.accent);
  doc.text(field.label, x, y);

  doc.setFont(pdfBodyFont, "normal");
  doc.setFontSize(9.4);
  setText(doc, theme.muted);
  const lines = doc.splitTextToSize(field.value || "-", valueWidth);
  doc.text(lines, x, y + 15, { lineHeightFactor: 1.25 });
}

function ensureSpace(doc: jsPDF, y: number, needed: number, theme: PdfTheme) {
  if (y + needed <= page.height - page.marginBottom) return y;
  doc.addPage();
  setFill(doc, theme.paper);
  doc.rect(0, 0, page.width, page.height, "F");
  return page.marginTop;
}

function drawFooters(doc: jsPDF, previewMark: boolean, theme: PdfTheme) {
  const pageCount = doc.getNumberOfPages();
  for (let index = 1; index <= pageCount; index += 1) {
    doc.setPage(index);
    setDraw(doc, theme.rule);
    doc.line(page.marginX, page.height - 42, page.width - page.marginX, page.height - 42);
    doc.setFont(pdfBodyFont, "normal");
    doc.setFontSize(8.5);
    setText(doc, theme.muted);
    doc.text(`Page ${index} / ${pageCount}`, page.width - page.marginX, page.height - 25, {
      align: "right",
    });
    if (previewMark) {
      doc.text(
        "Created with VeloWrite Preview. Pro exports will remove this mark.",
        page.marginX,
        page.height - 25,
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

function splitLongTitle(doc: jsPDF, title: string) {
  return doc.splitTextToSize(title, contentWidth);
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
