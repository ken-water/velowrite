import { katex } from "@mdit/plugin-katex";
import katexStyles from "katex/dist/katex.min.css?inline";
import hljs from "highlight.js/lib/core";
import highlightStyles from "highlight.js/styles/github.min.css?inline";
import bash from "highlight.js/lib/languages/bash";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import typescript from "highlight.js/lib/languages/typescript";
import MarkdownIt from "markdown-it";

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
};

export type EditorMetrics = {
  words: number;
  characters: number;
  lines: number;
  readingMinutes: number;
};

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

export function renderMarkdown(markdown: string, headings = extractHeadings(markdown)) {
  let headingIndex = 0;
  const renderer = new MarkdownIt({
    html: false,
    highlight(value, language) {
      return renderCodeBlock(value, language);
    },
    linkify: true,
    typographer: true,
  });
  renderer.use(katex);

  renderer.renderer.rules.heading_open = (tokens, index, options, env, self) => {
    const heading = headings[headingIndex];
    headingIndex += 1;
    if (heading) {
      tokens[index].attrSet("id", heading.id);
    }
    return self.renderToken(tokens, index, options);
  };

  return wrapCodeTabSets(renderer.render(markdown));
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
  const highlighted = highlightCode(value, normalizedLanguage);
  const className = normalizedLanguage
    ? `hljs language-${escapeHtml(normalizedLanguage)}`
    : "hljs";

  return `<pre><code class="${className}">${highlighted}</code></pre>`;
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

export function buildHtmlDocument(title: string, body: string) {
  const exportedAt = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date());

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
        background: #f4f1ea;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 16px;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background:
          linear-gradient(180deg, rgba(255,255,255,0.82), rgba(244,241,234,0.92) 320px),
          #f4f1ea;
      }
      .document-shell {
        max-width: 900px;
        margin: 0 auto;
        padding: 56px 28px 72px;
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
      }
      .document-title {
        max-width: 780px;
        margin: 10px 0 12px;
        color: #0f251f;
        font-size: 46px;
        line-height: 1.03;
      }
      .document-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 0;
        color: #5e6b65;
        font-size: 13px;
        font-weight: 720;
      }
      .document-content {
        max-width: 780px;
        margin: 0 auto;
        border: 1px solid #dfd8cb;
        border-radius: 8px;
        padding: 38px 42px;
        background: rgba(255, 255, 255, 0.84);
        box-shadow: 0 18px 48px rgba(38, 52, 47, 0.1);
      }
      .document-content > :first-child { margin-top: 0; }
      .document-content > :last-child { margin-bottom: 0; }
      h1, h2, h3, h4 { color: #102820; letter-spacing: 0; }
      h1 { margin: 0 0 22px; font-size: 36px; line-height: 1.12; }
      h2 { margin: 36px 0 12px; border-top: 1px solid #e5ded3; padding-top: 24px; font-size: 25px; line-height: 1.2; }
      h3 { margin: 26px 0 10px; font-size: 19px; line-height: 1.28; }
      p, li { color: #4f5f59; line-height: 1.78; }
      p { margin: 0 0 16px; }
      ul, ol { margin: 0 0 18px; padding-left: 24px; }
      li + li { margin-top: 5px; }
      input[type="checkbox"] { width: 14px; height: 14px; margin-right: 7px; accent-color: #3d8a68; }
      code { border-radius: 5px; padding: 2px 5px; background: #eee8df; color: #253833; }
      pre { overflow: auto; border: 1px solid #ded9d0; border-radius: 8px; padding: 16px; background: #ffffff; }
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
      table {
        display: block;
        width: 100%;
        margin: 22px 0;
        overflow: auto;
        border-collapse: collapse;
      }
      th, td { border: 1px solid #ded9d0; padding: 9px 10px; text-align: left; }
      th { background: #f4f1ea; color: #253833; }
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
      }
      @media (max-width: 720px) {
        .document-shell { padding: 30px 14px 44px; }
        .document-title { font-size: 34px; }
        .document-content { padding: 24px 20px; }
        h1 { font-size: 30px; }
        h2 { font-size: 22px; }
      }
      @media print {
        :root { background: #fff; }
        body { background: #fff; }
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
    <main class="document-shell">
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
        Created with VeloWrite. Keep the Markdown source as the editable original.
      </footer>
    </main>
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
