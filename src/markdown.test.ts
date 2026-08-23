import mermaid from "mermaid";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildHtmlDocument,
  escapeHtml,
  extractHeadings,
  getMetrics,
  highlightCode,
  renderMarkdown,
  renderMermaidDiagrams,
  resolveAssetPath,
  slugify,
} from "./markdown";

vi.mock("mermaid", () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn(),
  },
}));

describe("markdown utilities", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("creates stable heading slugs", () => {
    expect(slugify("Hello VeloWrite!", 0)).toBe("hello-velowrite");
    expect(slugify("   ", 3)).toBe("heading-4");
    expect(slugify("中文 标题", 0)).toBe("中文-标题");
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

  it("hides markdown HTML comments without removing code examples", () => {
    const html = renderMarkdown(`Before

<!-- internal source note -->

\`\`\`html
<!-- keep this code comment visible -->
<section>Example</section>
\`\`\`

After`);

    expect(html).not.toContain("internal source note");
    expect(html).toContain("keep this code comment visible");
    expect(html).toContain("&lt;section&gt;Example&lt;/section&gt;");
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

  it("normalizes code language aliases before highlighting", () => {
    const html = renderMarkdown(`\`\`\`py
print("hello")
\`\`\`

\`\`\`sh
echo "hello"
\`\`\`

\`\`\`ts
const typed: string = "yes";
\`\`\``);

    expect(html).toContain("language-python");
    expect(html).toContain("language-bash");
    expect(html).toContain("language-typescript");
  });

  it("escapes code when the language is missing or unsupported", () => {
    expect(highlightCode("<unsafe>", "")).toBe("&lt;unsafe&gt;");
    expect(highlightCode("<unsafe>", "unknown-language")).toBe("&lt;unsafe&gt;");
  });

  it("renders Mermaid fences as runtime-rendered diagrams", () => {
    const html = renderMarkdown(`\`\`\`mermaid
flowchart LR
  Draft[Draft notes] --> Preview[Live preview]
  Preview --> Export[Export Markdown]
\`\`\``);

    expect(html).toContain('class="mermaid-diagram mermaid-pending"');
    expect(html).toContain("data-mermaid=");
    expect(html).toContain("flowchart%20LR");
    expect(html).toContain("Draft notes");
    expect(html).toContain('language-mermaid');
  });

  it("passes complex Mermaid syntax to the runtime engine", () => {
    const html = renderMarkdown(`\`\`\`mermaid
sequenceDiagram
  Alice->>Bob: Hello
\`\`\``);

    expect(html).toContain('class="mermaid-diagram mermaid-pending"');
    expect(html).toContain('language-mermaid');
    expect(html).toContain("sequenceDiagram");
  });

  it("renders Mermaid placeholders into accessible runtime figures", async () => {
    const bindFunctions = vi.fn();
    vi.mocked(mermaid.render).mockResolvedValue({
      svg: "<svg><text>Diagram</text></svg>",
      bindFunctions,
      diagramType: "flowchart-v2",
    });
    const figure = {
      className: "",
      innerHTML: "",
      setAttribute: vi.fn(),
    };
    vi.stubGlobal("document", {
      createElement: vi.fn().mockReturnValue(figure),
    });
    const element = {
      dataset: {
        mermaid: encodeURIComponent("flowchart LR\nA[One] --> B[Two]"),
      },
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
      },
      replaceWith: vi.fn(),
    };
    const root = {
      querySelectorAll: vi.fn().mockReturnValue([element]),
    } as unknown as ParentNode;

    await renderMermaidDiagrams(root);

    expect(mermaid.initialize).toHaveBeenCalledWith(
      expect.objectContaining({
        startOnLoad: false,
        securityLevel: "strict",
      }),
    );
    expect(mermaid.render).toHaveBeenCalledWith(
      expect.stringMatching(/^velowrite-mermaid-/),
      "flowchart LR\nA[One] --> B[Two]",
    );
    expect(figure.className).toBe("mermaid-diagram mermaid-rendered");
    expect(figure.setAttribute).toHaveBeenCalledWith("aria-label", "Rendered Mermaid diagram");
    expect(figure.innerHTML).toContain("<svg>");
    expect(element.replaceWith).toHaveBeenCalledWith(figure);
    expect(bindFunctions).toHaveBeenCalledWith(figure);
  });

  it("keeps Mermaid source visible when runtime rendering fails", async () => {
    vi.mocked(mermaid.render).mockRejectedValue(new Error("Parse failed"));
    const element = {
      dataset: {
        mermaid: "%E0%A4%A",
      },
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
      },
      innerHTML: "",
    };
    const root = {
      querySelectorAll: vi.fn().mockReturnValue([element]),
    } as unknown as ParentNode;

    await renderMermaidDiagrams(root);

    expect(element.classList.remove).toHaveBeenCalledWith("mermaid-rendering");
    expect(element.classList.add).toHaveBeenCalledWith("mermaid-error");
    expect(element.innerHTML).toContain("Parse failed");
    expect(element.innerHTML).toContain("%E0%A4%A");
  });

  it("wraps rendered tables for constrained preview panes", () => {
    const html = renderMarkdown(`| Feature | Notes |
| --- | --- |
| Split preview | Wide tables should stay inside the preview pane. |`);

    expect(html).toContain('<div class="markdown-table-scroll"><table>');
    expect(html).toContain("</table></div>");
  });

  it("offsets heading levels while keeping generated ids", () => {
    const html = renderMarkdown("# Title\n\n## Section", undefined, 2);

    expect(html).toContain('<h3 id="title">Title</h3>');
    expect(html).toContain('<h4 id="section">Section</h4>');
    expect(html).not.toContain("<h7");
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

  it("resolves relative image paths against a base path", () => {
    expect(resolveAssetPath("images/photo.png", "/Users/rich/notes/")).toBe(
      "file:///Users/rich/notes/images/photo.png",
    );
    expect(resolveAssetPath("../assets/photo one.png", "/Users/rich/notes/drafts/")).toBe(
      "file:///Users/rich/notes/assets/photo%20one.png",
    );
    expect(resolveAssetPath("images/photo.png", "C:/Users/rich/notes/")).toBe(
      "file:///C:/Users/rich/notes/images/photo.png",
    );
    expect(resolveAssetPath("../assets/photo.png", "C:\\Users\\rich\\notes\\drafts\\")).toBe(
      "file:///C:/Users/rich/notes/assets/photo.png",
    );
    expect(resolveAssetPath("https://example.com/a.png", "/Users/rich/notes/")).toBe(
      "https://example.com/a.png",
    );
    expect(resolveAssetPath("#local-anchor", "/Users/rich/notes/")).toBe("#local-anchor");
    expect(resolveAssetPath("/already/rooted.png", "/Users/rich/notes/")).toBe("/already/rooted.png");
    expect(resolveAssetPath("image.png", "notes")).toBe("image.png");
    expect(resolveAssetPath("image.png", "file:///Users/rich/notes/")).toBe(
      "file:///Users/rich/notes/image.png",
    );
  });

  it("keeps markdown rendering stable when no base path is provided", () => {
    const html = renderMarkdown(`![Alt](images/photo.png)`);

    expect(html).toContain('src="images/photo.png"');
  });

  it("resolves rendered image src values when a base path is provided", () => {
    const html = renderMarkdown(`![Alt](images/photo.png)`, undefined, 0, {
      basePath: "/Users/rich/notes/",
    });

    expect(html).toContain('src="file:///Users/rich/notes/images/photo.png"');
    expect(html).toContain('alt="Alt"');
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

  it("escapes exported metadata and does not add Mermaid runtime when diagrams are absent", () => {
    const html = buildHtmlDocument(`Unsafe "Title" <script>`, "<p>Body</p>");

    expect(html).toContain("<title>Unsafe &quot;Title&quot; &lt;script&gt;</title>");
    expect(html).toContain("Unsafe &quot;Title&quot; &lt;script&gt;");
    expect(html).not.toContain("mermaid@11.16.1");
  });

  it("adds Mermaid runtime support to standalone HTML exports when needed", () => {
    const body = renderMarkdown(`\`\`\`mermaid
sequenceDiagram
  Alice->>Bob: Hello
\`\`\``);
    const html = buildHtmlDocument("Diagram", body);

    expect(html).toContain("mermaid@11.16.1");
    expect(html).toContain("mermaid.render");
    expect(html).toContain('securityLevel: "strict"');
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
