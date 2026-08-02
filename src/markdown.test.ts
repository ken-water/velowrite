import { describe, expect, it } from "vitest";
import {
  buildHtmlDocument,
  escapeHtml,
  extractHeadings,
  getMetrics,
  renderMarkdown,
  slugify,
} from "./markdown";

describe("markdown utilities", () => {
  it("creates stable heading slugs", () => {
    expect(slugify("Hello VeloWrite!", 0)).toBe("hello-velowrite");
    expect(slugify("   ", 3)).toBe("heading-4");
  });

  it("extracts h1-h3 headings and deduplicates ids", () => {
    expect(
      extractHeadings(`# Intro
## Details
### Details
#### Ignored
## Details`),
    ).toEqual([
      { id: "intro", level: 1, text: "Intro" },
      { id: "details", level: 2, text: "Details" },
      { id: "details-2", level: 3, text: "Details" },
      { id: "details-3", level: 2, text: "Details" },
    ]);
  });

  it("renders headings with ids and escapes raw HTML", () => {
    const html = renderMarkdown(`# Title

<script>alert("x")</script>`);

    expect(html).toContain('<h1 id="title">Title</h1>');
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
  });

  it("renders inline and block math with KaTeX", () => {
    const html = renderMarkdown(`Inline $E = mc^2$.

$$
\\int_0^\\infty e^{-x^2}\\,dx
$$`);

    expect(html).toContain("katex");
    expect(html).toContain("katex-display");
    expect(html).not.toContain("$E = mc^2$");
  });

  it("renders fenced code blocks with language highlighting", () => {
    const html = renderMarkdown(`\`\`\`js
const answer = 42;
\`\`\``);

    expect(html).toContain("language-javascript");
    expect(html).toContain("hljs-keyword");
    expect(html).toContain("answer");
  });

  it("wraps rendered tables for constrained preview panes", () => {
    const html = renderMarkdown(`| Feature | Notes |
| --- | --- |
| Split preview | Wide tables should stay inside the preview pane. |`);

    expect(html).toContain('<div class="markdown-table-scroll"><table>');
    expect(html).toContain("</table></div>");
  });

  it("groups consecutive supported code fences into a tabset", () => {
    const html = renderMarkdown(`\`\`\`python
print("hello")
\`\`\`
\`\`\`bash
echo "hello"
\`\`\`
\`\`\`java
System.out.println("hello");
\`\`\`
\`\`\`javascript
console.log("hello");
\`\`\``);

    expect(html).toContain('class="code-tabset"');
    expect(html).toMatch(/label for="code-tabset-[a-z0-9]+-1-python-0"/);
    expect(html).toMatch(/label for="code-tabset-[a-z0-9]+-1-bash-1"/);
    expect(html).toMatch(/label for="code-tabset-[a-z0-9]+-1-java-2"/);
    expect(html).toMatch(/label for="code-tabset-[a-z0-9]+-1-javascript-3"/);
  });

  it("does not group repeated languages as tabs", () => {
    const html = renderMarkdown(`\`\`\`bash
npm ci
\`\`\`
\`\`\`bash
npm run build
\`\`\``);

    expect(html).not.toContain('class="code-tabset"');
    expect(html.match(/<pre><code/g)).toHaveLength(2);
  });

  it("does not group code fences separated by content", () => {
    const html = renderMarkdown(`\`\`\`python
print("hello")
\`\`\`

Separated by prose.

\`\`\`bash
echo "hello"
\`\`\``);

    expect(html).not.toContain('class="code-tabset"');
    expect(html.match(/<pre><code/g)).toHaveLength(2);
  });

  it("does not group a supported code fence with an unsupported neighbor", () => {
    const html = renderMarkdown(`\`\`\`python
print("hello")
\`\`\`
\`\`\`ruby
puts "hello"
\`\`\``);

    expect(html).not.toContain('class="code-tabset"');
    expect(html).toContain("language-python");
    expect(html).toContain("language-ruby");
  });

  it("escapes unsupported code languages without tab grouping", () => {
    const html = renderMarkdown(`\`\`\`ruby
puts "<unsafe>"
\`\`\``);

    expect(html).not.toContain('class="code-tabset"');
    expect(html).toContain("language-ruby");
    expect(html).toContain("&lt;unsafe&gt;");
    expect(html).not.toContain("<unsafe>");
  });

  it("calculates document metrics", () => {
    const metrics = getMetrics("one two\n\n`ignored code`\nthree");

    expect(metrics.words).toBe(3);
    expect(metrics.lines).toBe(4);
    expect(metrics.characters).toBe(29);
    expect(metrics.readingMinutes).toBe(1);
  });

  it("escapes html entities for exported titles", () => {
    expect(escapeHtml(`A "quote" & <tag>`)).toBe(
      "A &quot;quote&quot; &amp; &lt;tag&gt;",
    );
  });

  it("builds a complete html export document", () => {
    const html = buildHtmlDocument("Doc <One>", "<h1>Doc</h1>");

    expect(html).toContain("<!doctype html>");
    expect(html).toContain("<title>Doc &lt;One&gt;</title>");
    expect(html).toContain(
      'class="document-shell table-header-tinted table-rows-striped table-borders-strong table-color-green"',
    );
    expect(html).toContain('<article class="document-content"><h1>Doc</h1></article>');
    expect(html).toContain('<div class="document-kicker">VeloWrite export</div>');
    expect(html).toContain("Markdown source preserved");
    expect(html).toContain("Created with VeloWrite");
    expect(html).toContain("@media print");
    expect(html).toContain("break-inside: avoid");
    expect(html).toContain("border-collapse: separate");
    expect(html).toContain("th:last-child, td:last-child");
    expect(html).toContain("thead { display: table-header-group; }");
    expect(html).toContain("print-color-adjust: exact");
    expect(html).toContain(".code-tabset-tabs { display: none; }");
    expect(html).not.toContain("cdn.jsdelivr.net");
  });

  it("applies table export preferences to HTML output", () => {
    const html = buildHtmlDocument("Styled", "<table><thead><tr><th>Head</th></tr></thead></table>", {
      header: "plain",
      rows: "plain",
      borders: "light",
      color: "blue",
    });

    expect(html).toContain("table-header-plain");
    expect(html).toContain("table-rows-plain");
    expect(html).toContain("table-borders-light");
    expect(html).toContain("table-color-blue");
  });
});
