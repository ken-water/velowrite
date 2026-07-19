import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import katex from "katex";
import MarkdownIt from "markdown-it";
import { chromium } from "playwright";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(repoRoot, "docs", "MARKDOWN_GUIDE.md");
const outputPath = path.join(repoRoot, "public", "markdown-guide.pdf");
const tempDir = path.join(repoRoot, "launch", "markdown-guide");
const tempHtmlPath = path.join(tempDir, "markdown-guide.html");
const guideImagePath = path.join(repoRoot, "public", "icons", "icon-192.png");

const rawMarkdown = await fs.readFile(sourcePath, "utf8");
const guideImageData = await fs.readFile(guideImagePath, "base64");
const katexCss = await fs.readFile(
  path.join(repoRoot, "node_modules", "katex", "dist", "katex.min.css"),
  "utf8",
);
const renderer = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const renderMath = (expression, displayMode) =>
  katex.renderToString(expression, {
    displayMode,
    throwOnError: false,
    strict: false,
  });

const prepareGuideMarkdown = (value) =>
  value
    .replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (_match, code) => {
      const escapedCode = escapeHtml(code)
        .replaceAll("```", "&#96;&#96;&#96;")
        .replaceAll("\n", "&#10;");
      return `<pre><code>${escapedCode}</code></pre>`;
    })
    .replace(/\[\[MATHINLINE:([\s\S]*?)\]\]/g, (_match, expression) => {
      return renderMath(expression.trim(), false);
    })
    .replace(/\[\[MATHDISPLAY:([\s\S]*?)\]\]/g, (_match, expression) => {
      return renderMath(expression.trim(), true);
    });

const markdown = prepareGuideMarkdown(rawMarkdown);
const body = renderer
  .render(markdown)
  .replaceAll(
    "{{guide-image}}",
    `data:image/png;base64,${guideImageData}`,
  );
const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Markdown Quick Start for VeloWrite</title>
    <style>
      ${katexCss}
      @page { size: A4; margin: 18mm 16mm; }
      :root {
        color: #17201c;
        background: #ffffff;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      body { margin: 0; }
      main { max-width: 760px; margin: 0 auto; }
      h1 { margin: 0 0 10px; color: #102720; font-size: 26px; line-height: 1.15; }
      h2 { break-after: avoid; margin: 28px 0 10px; color: #15362d; font-size: 20px; }
      h3 { break-after: avoid; margin: 18px 0 8px; color: #1b3d33; font-size: 15px; }
      p, li { color: #384a44; font-size: 12.5px; line-height: 1.58; }
      a { color: #235f54; font-weight: 700; }
      code {
        border-radius: 4px;
        padding: 1px 4px;
        background: #f0ede6;
        color: #17201c;
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
        font-size: 11.5px;
      }
      pre {
        break-inside: avoid;
        overflow: hidden;
        border: 1px solid #ded9d0;
        border-radius: 7px;
        padding: 10px 12px;
        background: #fbfaf7;
        white-space: pre-wrap;
      }
      pre code {
        padding: 0;
        background: transparent;
      }
      table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
      th, td { border: 1px solid #ded9d0; padding: 6px 8px; text-align: left; }
      th { background: #f4f1eb; color: #15362d; }
      blockquote {
        margin: 12px 0;
        border-left: 3px solid #d84f2a;
        padding-left: 12px;
        color: #52615c;
      }
      .cover-note {
        margin: 0 0 18px;
        border: 1px solid #ded9d0;
        border-radius: 8px;
        padding: 12px 14px;
        background: #f8f6f1;
        color: #4a5a55;
      }
      .example-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin: 12px 0 20px;
        break-inside: avoid;
        page-break-inside: avoid;
      }
      .example-card,
      .workflow-preview {
        break-inside: avoid;
        page-break-inside: avoid;
        border: 1px solid #ded9d0;
        border-radius: 8px;
        padding: 12px;
        background: #fbfaf7;
      }
      .example-title {
        margin-bottom: 8px;
        color: #15362d;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.02em;
        text-transform: uppercase;
      }
      .mini-preview {
        color: #33423d;
      }
      .mini-preview h1,
      .mini-preview h2,
      .mini-preview h3,
      .mini-preview p,
      .mini-preview ul,
      .mini-preview ol,
      .mini-preview blockquote {
        margin: 0 0 8px;
      }
      .mini-preview h1 { font-size: 22px; }
      .mini-preview h2 { font-size: 18px; }
      .mini-preview h3 { font-size: 14px; }
      .mini-preview code {
        padding: 1px 4px;
        border-radius: 4px;
        background: #ece7df;
      }
      .mini-preview .task-list {
        list-style: none;
        padding-left: 0;
      }
      .mini-preview .image-preview {
        display: grid;
        min-height: 72px;
        place-items: center;
        border: 1px solid #d9d2c6;
        border-radius: 7px;
        background: linear-gradient(135deg, #f8f6f1, #ffffff);
      }
      .mini-preview .image-preview img {
        width: 72px;
        height: 72px;
        object-fit: contain;
      }
      .mini-preview .image-caption {
        margin: 6px 0 0;
        color: #73807a;
        font-size: 11px;
      }
      .tab-preview {
        display: grid;
        gap: 8px;
      }
      .tab-row {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .tab-row span {
        border: 1px solid #d6cec0;
        border-radius: 999px;
        padding: 4px 10px;
        background: #ffffff;
        color: #516059;
        font-size: 11px;
        font-weight: 700;
      }
      .tab-row .active-tab {
        border-color: #15362d;
        background: #15362d;
        color: #ffffff;
      }
      .small-note {
        margin: 6px 0 0;
        color: #66726c;
        font-size: 11px;
      }
      .workflow-preview {
        display: grid;
        grid-template-columns: 150px 1fr 1fr;
        gap: 10px;
        align-items: start;
        margin: 12px 0 20px;
      }
      .outline-mini,
      .editor-mini,
      .preview-mini {
        display: grid;
        gap: 6px;
      }
      .outline-mini strong,
      .editor-mini strong,
      .preview-mini strong {
        color: #15362d;
        font-size: 11px;
        text-transform: uppercase;
      }
      .outline-mini span {
        padding: 4px 8px;
        border-radius: 6px;
        background: #f1eee8;
        color: #55635d;
        font-size: 11px;
      }
      .outline-mini .selected {
        background: #15362d;
        color: #fff;
      }
      .katex-display { break-inside: avoid; margin: 12px 0; }
      .katex { font-size: 1em; }
    </style>
  </head>
  <body>
    <main>
      <p class="cover-note">Use the browser for quick drafting. Use the desktop app when local files and history matter.</p>
      ${body}
    </main>
  </body>
</html>`;

await fs.mkdir(tempDir, { recursive: true });
await fs.writeFile(tempHtmlPath, html);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`file://${tempHtmlPath}`, { waitUntil: "load" });
await page.pdf({
  path: outputPath,
  format: "A4",
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: "<span></span>",
  footerTemplate:
    '<div style="width:100%;font:9px system-ui;color:#7a8580;padding:0 16mm;display:flex;justify-content:space-between;"><span>VeloWrite Markdown Quick Start</span><span class="pageNumber"></span></div>',
  margin: { top: "18mm", right: "16mm", bottom: "20mm", left: "16mm" },
});
await browser.close();

console.log(`Wrote ${path.relative(repoRoot, outputPath)}`);
