import { katex } from "@mdit/plugin-katex";
import "katex/dist/katex.min.css";
import katexStyles from "katex/dist/katex.min.css?inline";
import hljs from "highlight.js/lib/core";
import highlightStyles from "highlight.js/styles/github.min.css?inline";
import bash from "highlight.js/lib/languages/bash";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import typescript from "highlight.js/lib/languages/typescript";
import MarkdownIt from "markdown-it";
import type { TableExportStyle } from "./editorCore";

const tabLanguages = new Set(["python", "bash", "java", "javascript"]);

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("java", java);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("typescript", typescript);

export type Heading = {
  id: string;
  level: number;
  text: string;
  line: number;
};

export type EditorMetrics = {
  words: number;
  characters: number;
  lines: number;
  readingMinutes: number;
};

export type MarkdownRenderOptions = {
  basePath?: string;
};

type MermaidModule = typeof import("mermaid");

let mermaidLoadPromise: Promise<MermaidModule> | null = null;

export function slugify(value: string, index: number) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return slug || `heading-${index + 1}`;
}

export function extractHeadings(markdown: string): Heading[] {
  const seen = new Map<string, number>();

  return markdown
    .split("\n")
    .map((line, index) => {
      const match = /^(#{1,3})\s+(.+?)\s*#*$/.exec(line);
      if (!match) return null;

      const text = match[2].trim();
      const baseId = slugify(text, index);
      const count = seen.get(baseId) ?? 0;
      seen.set(baseId, count + 1);

      return {
        id: count > 0 ? `${baseId}-${count + 1}` : baseId,
        level: match[1].length,
        text,
        line: index + 1,
      };
    })
    .filter((heading): heading is Heading => Boolean(heading));
}

export function getMetrics(markdown: string): EditorMetrics {
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/[#>*_[\]()!-]/g, " ");
  const words = plainText.trim().match(/[\p{L}\p{N}]+/gu)?.length ?? 0;

  return {
    words,
    characters: markdown.length,
    lines: markdown.split("\n").length,
    readingMinutes: Math.max(1, Math.ceil(words / 220)),
  };
}

function stableHash(value: string) {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }
  return (hash >>> 0).toString(36);
}

export function renderMarkdown(
  markdown: string,
  headings = extractHeadings(markdown),
  headingOffset = 0,
  options: MarkdownRenderOptions = {},
) {
  let headingIndex = 0;
  const renderer = new MarkdownIt({
    html: true,
    highlight(value, language) {
      return renderCodeBlock(value, language);
    },
    linkify: true,
    typographer: true,
  });
  renderer.use(katex);
  renderer.renderer.rules.html_block = renderSafeHtmlToken;
  renderer.renderer.rules.html_inline = renderSafeHtmlToken;
  const defaultImageRenderer = renderer.renderer.rules.image;
  renderer.renderer.rules.image = (tokens, index, tokenOptions, env, self) => {
    const token = tokens[index];
    const srcIndex = token.attrIndex("src");
    if (srcIndex >= 0) {
      const originalSrc = token.attrs?.[srcIndex]?.[1] ?? "";
      const resolved = resolveAssetPath(originalSrc, options.basePath);
      token.attrs![srcIndex][1] = resolved;
    }
    return defaultImageRenderer
      ? defaultImageRenderer(tokens, index, tokenOptions, env, self)
      : self.renderToken(tokens, index, tokenOptions);
  };

  renderer.renderer.rules.heading_open = (tokens, index, options, env, self) => {
    const heading = headings[headingIndex];
    headingIndex += 1;
    if (heading) {
      tokens[index].attrSet("id", heading.id);
      tokens[index].attrSet("data-source-line", String(heading.line));
    }
    return self.renderToken(tokens, index, options);
  };

  return offsetHeadingLevels(wrapMarkdownTables(wrapCodeTabSets(renderer.render(markdown))), headingOffset);
}

function renderSafeHtmlToken(tokens: Array<{ content: string }>, index: number) {
  const content = tokens[index].content;
  return /^<!--[\s\S]*-->$/.test(content.trim()) ? "" : escapeHtml(content);
}

function offsetHeadingLevels(html: string, headingOffset: number) {
  if (!headingOffset) return html;

  return html.replace(/<\/?h([1-6])(\s[^>]*)?>/g, (tag, level, attributes = "") => {
    const nextLevel = Math.min(6, Number(level) + headingOffset);
    return tag.startsWith("</") ? `</h${nextLevel}>` : `<h${nextLevel}${attributes}>`;
  });
}

export function highlightCode(value: string, language: string) {
  const normalizedLanguage = normalizeLanguage(language);
  if (!normalizedLanguage || !hljs.getLanguage(normalizedLanguage)) {
    return escapeHtml(value);
  }

  return hljs.highlight(value, {
    language: normalizedLanguage,
    ignoreIllegals: true,
  }).value;
}

function renderCodeBlock(value: string, language: string) {
  const normalizedLanguage = normalizeLanguage(language);
  if (normalizedLanguage === "mermaid") {
    return renderMermaidPlaceholder(value);
  }

  const highlighted = highlightCode(value, normalizedLanguage);
  const className = normalizedLanguage
    ? `hljs language-${escapeHtml(normalizedLanguage)}`
    : "hljs";

  return `<pre><code class="${className}">${highlighted}</code></pre>`;
}

function renderMermaidPlaceholder(value: string) {
  return `<pre class="mermaid-diagram mermaid-pending" data-mermaid="${encodeMermaidSource(value)}"><code class="language-mermaid">${escapeHtml(value)}</code></pre>`;
}

function encodeMermaidSource(value: string) {
  return escapeHtml(encodeURIComponent(value));
}

function decodeMermaidSource(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function renderMermaidDiagrams(root: ParentNode) {
  const diagrams = Array.from(root.querySelectorAll<HTMLElement>(".mermaid-diagram[data-mermaid]"));
  if (diagrams.length === 0) return;

  const mermaid = await loadMermaid();
  for (const [index, element] of diagrams.entries()) {
    const source = decodeMermaidSource(element.dataset.mermaid ?? "");
    const renderId = `velowrite-mermaid-${stableHash(source)}-${index}`;
    element.classList.add("mermaid-rendering");

    try {
      const result = await mermaid.default.render(renderId, source);
      const svg = typeof result === "string" ? result : result.svg;
      const bindFunctions = typeof result === "string" ? undefined : result.bindFunctions;
      if (!svg.trim()) throw new Error("Mermaid rendered an empty diagram.");

      const figure = document.createElement("figure");
      figure.className = "mermaid-diagram mermaid-rendered";
      figure.setAttribute("aria-label", "Rendered Mermaid diagram");
      figure.innerHTML = svg;
      element.replaceWith(figure);
      bindFunctions?.(figure);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to render this Mermaid diagram.";
      element.classList.remove("mermaid-rendering");
      element.classList.add("mermaid-error");
      element.innerHTML = `<code class="language-mermaid">${escapeHtml(source)}</code><small>${escapeHtml(message)}</small>`;
    }
  }
}

async function loadMermaid() {
  if (!mermaidLoadPromise) {
    mermaidLoadPromise = import("mermaid").then((module) => {
      module.default.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        htmlLabels: false,
        theme: "base",
        themeVariables: {
          primaryColor: "#eef7f1",
          primaryTextColor: "#15362d",
          primaryBorderColor: "#9dc7b4",
          lineColor: "#2d7656",
          secondaryColor: "#f8f6f1",
          tertiaryColor: "#ffffff",
          fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        },
        flowchart: {
          htmlLabels: false,
        },
      });
      return module;
    });
  }

  return mermaidLoadPromise;
}

function wrapCodeTabSets(html: string) {
  const blockRe = /<pre><code class="hljs language-([a-z0-9_-]+)">([\s\S]*?)<\/code><\/pre>\n?/gi;
  const parts: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let tabsetIndex = 0;
  const tabsetPrefix = `code-tabset-${stableHash(html)}`;

  while ((match = blockRe.exec(html))) {
    const blockStart = match.index;
    const blocks = [{ language: match[1].toLowerCase(), code: match[2], raw: match[0] }];
    let endIndex = blockRe.lastIndex;

    if (!tabLanguages.has(blocks[0].language)) {
      blockRe.lastIndex = blockStart + blocks[0].raw.length;
      continue;
    }

    while (true) {
      const next = blockRe.exec(html);
      if (!next) {
        match = null;
        break;
      }

      const between = html.slice(endIndex, next.index);
      if (between.trim()) {
        blockRe.lastIndex = next.index;
        match = next;
        break;
      }

      if (!tabLanguages.has(next[1].toLowerCase())) {
        blockRe.lastIndex = next.index;
        match = next;
        break;
      }

      blocks.push({ language: next[1].toLowerCase(), code: next[2], raw: next[0] });
      endIndex = blockRe.lastIndex;
    }

    const languages = blocks.map((block) => block.language);
    const uniqueLanguages = new Set(languages);
    if (blocks.length > 1 && uniqueLanguages.size === blocks.length) {
      parts.push(html.slice(lastIndex, blockStart));
      parts.push(buildCodeTabset(blocks, `${tabsetPrefix}-${++tabsetIndex}`));
      lastIndex = endIndex;
      if (!match) break;
      blockRe.lastIndex = endIndex;
      continue;
    }

    blockRe.lastIndex = blockStart + blocks[0].raw.length;
  }

  if (!tabsetIndex) return html;

  parts.push(html.slice(lastIndex));
  return parts.join("");
}

function wrapMarkdownTables(html: string) {
  return html
    .replace(/<table>/g, '<div class="markdown-table-scroll"><table>')
    .replace(/<\/table>/g, "</table></div>");
}

function buildCodeTabset(
  blocks: Array<{ language: string; code: string }>,
  groupName: string,
) {
  const tabs = blocks
    .map((block, tabIndex) => {
      const id = `${groupName}-${block.language}-${tabIndex}`;
      return `
        <input type="radio" name="${groupName}" id="${id}"${tabIndex === 0 ? " checked" : ""} />
        <label for="${id}">${escapeHtml(block.language)}</label>
      `;
    })
    .join("\n");

  const panels = blocks
    .map(
      (block) => `
        <div class="code-tabset-panel code-tabset-panel-${escapeHtml(block.language)}">
          <pre><code class="hljs language-${escapeHtml(block.language)}">${block.code}</code></pre>
        </div>
      `,
    )
    .join("\n");

  return `
    <div class="code-tabset">
      <div class="code-tabset-tabs">
        ${tabs}
      </div>
      <div class="code-tabset-panels">
        ${panels}
      </div>
    </div>
  `;
}

function normalizeLanguage(language: string) {
  const value = language.trim().toLowerCase();
  const aliases: Record<string, string> = {
    js: "javascript",
    py: "python",
    sh: "bash",
    shell: "bash",
    ts: "typescript",
  };

  return aliases[value] ?? value;
}

export function buildHtmlDocument(
  title: string,
  body: string,
  tableStyle: TableExportStyle = {
    header: "tinted",
    rows: "striped",
    borders: "strong",
    color: "green",
  },
) {
  const exportedAt = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date());
  const mermaidScript = body.includes('data-mermaid="')
    ? `<script type="module">
      import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11.16.1/dist/mermaid.esm.min.mjs";
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        htmlLabels: false,
        theme: "base",
        themeVariables: {
          primaryColor: "#eef7f1",
          primaryTextColor: "#15362d",
          primaryBorderColor: "#9dc7b4",
          lineColor: "#2d7656",
          secondaryColor: "#f8f6f1",
          tertiaryColor: "#ffffff",
          fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
        },
        flowchart: {
          htmlLabels: false
        }
      });
      const decodeSource = (value) => {
        try {
          return decodeURIComponent(value);
        } catch {
          return value;
        }
      };
      for (const [index, element] of [...document.querySelectorAll(".mermaid-diagram[data-mermaid]")].entries()) {
        const source = decodeSource(element.dataset.mermaid || "");
        try {
          const result = await mermaid.render(\`velowrite-export-mermaid-\${index}\`, source);
          const svg = typeof result === "string" ? result : result.svg;
          const bindFunctions = typeof result === "string" ? undefined : result.bindFunctions;
          if (!svg.trim()) throw new Error("Mermaid rendered an empty diagram.");
          const figure = document.createElement("figure");
          figure.className = "mermaid-diagram mermaid-rendered";
          figure.setAttribute("aria-label", "Rendered Mermaid diagram");
          figure.innerHTML = svg;
          element.replaceWith(figure);
          bindFunctions?.(figure);
        } catch (error) {
          element.classList.add("mermaid-error");
          const message = error instanceof Error ? error.message : "Unable to render this Mermaid diagram.";
          const detail = document.createElement("small");
          detail.textContent = message;
          element.append(detail);
        }
      }
    </script>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      ${katexStyles}
      ${highlightStyles}
      :root {
        color: #17201c;
        background: #f5f3ed;
        font-family: "Noto Serif CJK SC", "Source Han Serif SC", "Songti SC", Georgia, "Times New Roman", serif;
        font-size: 16px;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background:
          linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,243,237,0.96) 340px),
          #f5f3ed;
      }
      .document-shell {
        max-width: 940px;
        margin: 0 auto;
        padding: 58px 30px 74px;
      }
      .document-cover {
        margin-bottom: 28px;
        border-bottom: 1px solid #dcd6ca;
        padding-bottom: 22px;
      }
      .document-kicker {
        color: #3d8a68;
        font-size: 12px;
        font-weight: 850;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .document-title {
        max-width: 820px;
        margin: 10px 0 12px;
        color: #0f251f;
        font-size: 44px;
        line-height: 1.12;
        font-weight: 780;
      }
      .document-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 0;
        color: #5e6b65;
        font-size: 13px;
        font-weight: 720;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .document-content {
        max-width: 820px;
        margin: 0 auto;
        border: 1px solid #dfd8cb;
        border-radius: 8px;
        padding: 44px 50px;
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 0 20px 54px rgba(38, 52, 47, 0.09);
      }
      .document-content > :first-child { margin-top: 0; }
      .document-content > :last-child { margin-bottom: 0; }
      h1, h2, h3, h4 { color: #102820; letter-spacing: 0; text-wrap: balance; }
      h1 { margin: 0 0 24px; font-size: 34px; line-height: 1.2; font-weight: 780; }
      h2 { margin: 40px 0 14px; border-top: 1px solid #e5ded3; padding-top: 26px; font-size: 24px; line-height: 1.28; font-weight: 760; }
      h3 { margin: 28px 0 12px; font-size: 18px; line-height: 1.36; font-weight: 760; }
      p, li { color: #4d5c56; font-size: 16.5px; line-height: 1.88; overflow-wrap: anywhere; }
      p { margin: 0 0 18px; }
      ul, ol { margin: 0 0 20px; padding-left: 25px; }
      li + li { margin-top: 7px; }
      input[type="checkbox"] { width: 14px; height: 14px; margin-right: 7px; accent-color: #3d8a68; }
      code { border-radius: 5px; padding: 2px 5px; background: #eee8df; color: #253833; font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace; font-size: 0.92em; }
      pre { overflow: auto; border: 1px solid #ded9d0; border-radius: 8px; padding: 16px; background: #fffdf9; }
      pre code { padding: 0; background: transparent; }
      blockquote {
        margin: 22px 0;
        border-left: 3px solid #d84f2a;
        border-radius: 0 8px 8px 0;
        padding: 12px 16px;
        background: #f8f5ef;
        color: #52615c;
      }
      blockquote p:last-child { margin-bottom: 0; }
      a { color: #2c6e62; }
      img { max-width: 100%; border-radius: 8px; }
      .mermaid-diagram { margin: 24px 0; overflow-x: auto; }
      .mermaid-diagram svg { display: block; width: 100%; min-width: 520px; height: auto; }
      .mermaid-pending code { display: block; min-width: max-content; white-space: pre; }
      .mermaid-rendered { border: 1px solid #ded9d0; border-radius: 8px; padding: 14px; background: #fffdf9; }
      .mermaid-error { border-color: #d8b9a8; background: #fff8f4; }
      .mermaid-error small { display: block; margin-top: 10px; color: #9a3d24; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
      .mermaid-diagram rect { fill: #f5faf6; stroke: #bad5c6; stroke-width: 1.4; }
      .mermaid-diagram text { fill: #16352b; font-family: Inter, ui-sans-serif, system-ui, sans-serif; font-size: 13px; font-weight: 760; text-anchor: middle; }
      .mermaid-diagram path { fill: none; stroke: #2d7656; stroke-width: 1.7; }
      .mermaid-diagram marker path { fill: #2d7656; stroke: none; }
      table {
        display: table;
        table-layout: fixed;
        width: 100%;
        margin: 22px 0;
        border: 0;
        border-collapse: separate;
        border-spacing: 0;
        background: #ffffff;
      }
      thead { display: table-header-group; }
      th, td { border: 0; border-top: 1.2px solid #9faaa4; border-left: 1.2px solid #9faaa4; padding: 9px 10px; color: #253833; text-align: left; vertical-align: top; overflow-wrap: anywhere; word-break: normal; }
      th:last-child, td:last-child { border-right: 1.2px solid #9faaa4; }
      tr:last-child td { border-bottom: 1.2px solid #9faaa4; }
      thead tr:last-child th { border-bottom: 1.2px solid #9faaa4; }
      th { background: #e8eee9; color: #102820; font-weight: 850; }
      tr:nth-child(even) td { background: #f7f9f7; }
      .table-color-blue th { background: #e8f0fb; }
      .table-color-blue tr:nth-child(even) td { background: #f5f8fd; }
      .table-color-gray th { background: #eeeeec; }
      .table-color-gray tr:nth-child(even) td { background: #f7f7f5; }
      .table-header-plain th { background: #ffffff; }
      .table-rows-plain tr:nth-child(even) td { background: #ffffff; }
      .table-borders-light th,
      .table-borders-light td { border-color: #d9dfda; border-width: 1px; }
      .code-tabset { overflow: hidden; margin: 18px 0; border: 1px solid #ded9d0; border-radius: 8px; background: #fff; }
      .code-tabset-tabs { display: flex; flex-wrap: wrap; gap: 8px; border-bottom: 1px solid #ded9d0; padding: 9px; background: #f8f6f1; }
      .code-tabset-tabs input { display: none; }
      .code-tabset-tabs label { display: inline-flex; min-height: 32px; align-items: center; border: 1px solid #ded9d0; border-radius: 7px; padding: 0 11px; background: #fff; color: #56635e; cursor: pointer; font-size: 13px; font-weight: 800; text-transform: capitalize; }
      .code-tabset-tabs input:checked + label { border-color: #15362d; background: #15362d; color: #fff; }
      .code-tabset-panels { min-height: 280px; }
      .code-tabset-panel { display: none; }
      .code-tabset:has(.code-tabset-tabs input:nth-of-type(1):checked) .code-tabset-panel:nth-child(1),
      .code-tabset:has(.code-tabset-tabs input:nth-of-type(2):checked) .code-tabset-panel:nth-child(2),
      .code-tabset:has(.code-tabset-tabs input:nth-of-type(3):checked) .code-tabset-panel:nth-child(3),
      .code-tabset:has(.code-tabset-tabs input:nth-of-type(4):checked) .code-tabset-panel:nth-child(4),
      .code-tabset:has(.code-tabset-tabs input:nth-of-type(5):checked) .code-tabset-panel:nth-child(5),
      .code-tabset:has(.code-tabset-tabs input:nth-of-type(6):checked) .code-tabset-panel:nth-child(6) { display: block; }
      .code-tabset-panel pre { min-height: 280px; margin: 0; border: 0; border-radius: 0; }
      .document-footer {
        max-width: 780px;
        margin: 18px auto 0;
        color: #6f7a75;
        font-size: 12px;
        line-height: 1.5;
        text-align: center;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      @media (max-width: 720px) {
        .document-shell { padding: 30px 14px 44px; }
        .document-title { font-size: 34px; }
        .document-content { padding: 26px 22px; }
        h1 { font-size: 30px; }
        h2 { font-size: 22px; }
      }
      @media print {
        :root { background: #fff; }
        body { background: #fff; }
        * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        .document-shell { max-width: none; padding: 0; }
        .document-cover { margin-bottom: 18px; padding-bottom: 14px; }
        .document-title { font-size: 32px; }
        .document-content {
          max-width: none;
          border: 0;
          border-radius: 0;
          padding: 0;
          box-shadow: none;
        }
        p, li { font-size: 11.2pt; line-height: 1.72; }
        a { color: inherit; text-decoration: none; }
        h2 { break-after: avoid; }
        p, li { widows: 3; orphans: 3; }
        pre, blockquote, table, .code-tabset { break-inside: avoid; }
        .code-tabset { border-color: #cfcfcf; }
        .code-tabset-tabs { display: none; }
        .code-tabset-panel { display: none; }
        .code-tabset-panel:first-child { display: block; }
        .code-tabset-panel pre { min-height: 0; }
      }
    </style>
  </head>
  <body>
      <main class="document-shell table-header-${tableStyle.header} table-rows-${tableStyle.rows} table-borders-${tableStyle.borders} table-color-${tableStyle.color}">
      <header class="document-cover">
        <div class="document-kicker">VeloWrite export</div>
        <h1 class="document-title">${escapeHtml(title)}</h1>
        <p class="document-meta">
          <span>Generated ${escapeHtml(exportedAt)}</span>
          <span>·</span>
          <span>Markdown source preserved</span>
        </p>
      </header>
      <article class="document-content">${body}</article>
      <footer class="document-footer">
        Created with VeloWrite Preview. Pro exports will remove this preview mark.
      </footer>
    </main>
    ${mermaidScript}
  </body>
</html>
`;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function resolveAssetPath(src: string, basePath?: string) {
  if (!src || !basePath) return src;
  if (/^[a-z][a-z0-9+.-]*:/i.test(src)) return src;
  if (src.startsWith("/") || src.startsWith("#")) return src;

  const baseUrl = normalizeBasePath(basePath);
  if (!baseUrl) return src;

  try {
    return new URL(src, baseUrl).toString();
  } catch {
    return src;
  }
}

function normalizeBasePath(basePath: string) {
  const normalized = basePath.replace(/\\/g, "/");
  const directory = normalized.endsWith("/") ? normalized : `${normalized}/`;

  if (/^[a-zA-Z]:\//.test(directory)) {
    return `file:///${directory}`;
  }

  if (normalized.startsWith("//")) {
    return `file:${directory}`;
  }

  if (normalized.startsWith("/")) {
    return `file://${directory}`;
  }

  if (/^file:\/\//i.test(directory) || /^https?:\/\//i.test(directory)) {
    return directory;
  }

  return null;
}
