import { katex } from "@mdit/plugin-katex";
import MarkdownIt from "markdown-it";

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

  return renderer.render(markdown);
}

export function buildHtmlDocument(title: string, body: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css" />
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
