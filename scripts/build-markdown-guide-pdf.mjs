import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import MarkdownIt from "markdown-it";
import { chromium } from "playwright";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(repoRoot, "docs", "MARKDOWN_GUIDE.md");
const outputPath = path.join(repoRoot, "public", "markdown-guide.pdf");
const tempDir = path.join(repoRoot, "launch", "markdown-guide");
const tempHtmlPath = path.join(tempDir, "markdown-guide.html");

const markdown = await fs.readFile(sourcePath, "utf8");
const renderer = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});

const body = renderer.render(markdown);
const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Markdown Quick Start for VeloWrite</title>
    <style>
      @page { size: A4; margin: 18mm 16mm; }
      :root {
        color: #17201c;
        background: #ffffff;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      body { margin: 0; }
      main { max-width: 760px; margin: 0 auto; }
      h1 { margin: 0 0 14px; color: #102720; font-size: 32px; line-height: 1.12; }
      h2 { break-after: avoid; margin: 28px 0 10px; color: #15362d; font-size: 20px; }
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
        margin: 0 0 24px;
        border: 1px solid #ded9d0;
        border-radius: 8px;
        padding: 12px 14px;
        background: #f8f6f1;
        color: #4a5a55;
      }
    </style>
  </head>
  <body>
    <main>
      <p class="cover-note">A practical Markdown guide for writers, developers, students, and teams using VeloWrite.</p>
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
