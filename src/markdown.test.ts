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
    expect(slugify("Hello VeloMD!", 0)).toBe("hello-velomd");
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
    expect(html).toContain("<main><h1>Doc</h1></main>");
  });
});
