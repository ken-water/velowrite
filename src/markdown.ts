import { katex } from "@mdit/plugin-katex";
import hljs from "highlight.js/lib/core";
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

    if (blocks.length > 1) {
      parts.push(html.slice(lastIndex, blockStart));
      parts.push(buildCodeTabset(blocks, ++tabsetIndex));
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
  index: number,
) {
  const groupName = `code-tabset-${index}`;
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
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js/styles/github.min.css" />
    <style>
      :root { color: #17201c; background: #f7f5f0; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
      body { margin: 0; }
      main { max-width: 760px; margin: 0 auto; padding: 56px 24px; }
      h1 { font-size: 42px; line-height: 1.1; }
      h2 { margin-top: 32px; }
      p, li { color: #4f5f59; line-height: 1.75; }
      code { border-radius: 5px; padding: 2px 5px; background: #ece7df; }
      pre { overflow: auto; border: 1px solid #ded9d0; border-radius: 8px; padding: 16px; background: #ffffff; }
      pre code { padding: 0; background: transparent; }
      blockquote { margin: 20px 0; border-left: 3px solid #d84f2a; padding-left: 16px; color: #52615c; }
      a { color: #2c6e62; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ded9d0; padding: 8px; text-align: left; }
      .code-tabset { overflow: hidden; margin: 18px 0; border: 1px solid #ded9d0; border-radius: 8px; background: #fff; }
      .code-tabset-tabs { display: flex; flex-wrap: wrap; gap: 8px; border-bottom: 1px solid #ded9d0; padding: 9px; background: #f8f6f1; }
      .code-tabset-tabs input { position: absolute; opacity: 0; pointer-events: none; }
      .code-tabset-tabs label { display: inline-flex; min-height: 32px; align-items: center; border: 1px solid #ded9d0; border-radius: 7px; padding: 0 11px; background: #fff; color: #56635e; cursor: pointer; font-size: 13px; font-weight: 800; text-transform: capitalize; }
      .code-tabset-tabs input:checked + label { border-color: #15362d; background: #15362d; color: #fff; }
      .code-tabset-panel { display: none; }
      .code-tabset:has(.code-tabset-tabs input:nth-of-type(1):checked) .code-tabset-panel:nth-child(1),
      .code-tabset:has(.code-tabset-tabs input:nth-of-type(2):checked) .code-tabset-panel:nth-child(2),
      .code-tabset:has(.code-tabset-tabs input:nth-of-type(3):checked) .code-tabset-panel:nth-child(3),
      .code-tabset:has(.code-tabset-tabs input:nth-of-type(4):checked) .code-tabset-panel:nth-child(4),
      .code-tabset:has(.code-tabset-tabs input:nth-of-type(5):checked) .code-tabset-panel:nth-child(5),
      .code-tabset:has(.code-tabset-tabs input:nth-of-type(6):checked) .code-tabset-panel:nth-child(6) { display: block; }
      .code-tabset-panel pre { margin: 0; border: 0; border-radius: 0; }
    </style>
  </head>
  <body>
    <main>${body}</main>
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
