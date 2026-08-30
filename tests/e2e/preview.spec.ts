import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("velowrite:analytics-consent", "declined");
  });
});

test("static SEO HTML exposes route-specific metadata before JavaScript runs", async () => {
  const downloadHtml = fs.readFileSync(path.join(process.cwd(), "dist/download/index.html"), "utf8");

  expect(downloadHtml).toContain("<title>Download VeloWrite - Windows, macOS, and Linux Markdown App</title>");
  expect(downloadHtml).toContain('<link rel="canonical" href="https://velowrite.app/download" />');
  expect(downloadHtml).toContain('"softwareVersion": "0.2.9"');

  const articleHtml = fs.readFileSync(
    path.join(process.cwd(), "dist/docs/online-markdown-editor/index.html"),
    "utf8",
  );

  expect(articleHtml).toContain("<title>Online Markdown Editor - Write, Preview, and Download Markdown</title>");
  expect(articleHtml).toContain(
    '<link rel="canonical" href="https://velowrite.app/docs/online-markdown-editor" />',
  );
  expect(articleHtml).toContain('"@type": "Article"');

  const markdownHtml = fs.readFileSync(
    path.join(process.cwd(), "dist/docs/markdown/index.html"),
    "utf8",
  );

  expect(markdownHtml).toContain("<title>What Is Markdown? Plain Text Writing for Notes, Docs, and Blogs</title>");
  expect(markdownHtml).toContain(
    '<link rel="canonical" href="https://velowrite.app/docs/markdown" />',
  );
  expect(markdownHtml).toContain('"dateModified": "2026-07-30"');

  const markdownHistoryHtml = fs.readFileSync(
    path.join(process.cwd(), "dist/docs/markdown-history/index.html"),
    "utf8",
  );

  expect(markdownHistoryHtml).toContain(
    "<title>A Short History of Markdown - 2004, Aaron Swartz, and CommonMark</title>",
  );
  expect(markdownHistoryHtml).toContain(
    '<link rel="canonical" href="https://velowrite.app/docs/markdown-history" />',
  );
  expect(markdownHistoryHtml).toContain('"@type": "Article"');

  const workflowHtml = fs.readFileSync(
    path.join(process.cwd(), "dist/docs/long-markdown-workflow/index.html"),
    "utf8",
  );
  expect(workflowHtml).toContain(
    "<title>How to Work Faster in Long Markdown Drafts</title>",
  );
  expect(workflowHtml).toContain(
    '<link rel="canonical" href="https://velowrite.app/docs/long-markdown-workflow" />',
  );
  expect(workflowHtml).toContain('"@type": "Article"');

  const releasePolicyHtml = fs.readFileSync(
    path.join(process.cwd(), "dist/docs/preview-release-policy/index.html"),
    "utf8",
  );

  expect(releasePolicyHtml).toContain(
    "<title>How VeloWrite Preview Releases Work - Versions, Downloads, and Changelog</title>",
  );
  expect(releasePolicyHtml).toContain(
    '<link rel="canonical" href="https://velowrite.app/docs/preview-release-policy" />',
  );
  expect(releasePolicyHtml).toContain('"dateModified": "2026-08-07"');

  const downloadSafetyHtml = fs.readFileSync(
    path.join(process.cwd(), "dist/docs/download-safety/index.html"),
    "utf8",
  );
  expect(downloadSafetyHtml).toContain("<title>Download Safety for VeloWrite Preview Builds</title>");
  expect(downloadSafetyHtml).toContain(
    '<link rel="canonical" href="https://velowrite.app/docs/download-safety" />',
  );
  expect(downloadSafetyHtml).toContain('"dateModified": "2026-08-15"');

  const meetingNotesHtml = fs.readFileSync(
    path.join(process.cwd(), "dist/docs/markdown-meeting-notes/index.html"),
    "utf8",
  );
  expect(meetingNotesHtml).toContain(
    "<title>Markdown Meeting Notes Template - Decisions, Actions, and Follow-up</title>",
  );
  expect(meetingNotesHtml).toContain(
    '<link rel="canonical" href="https://velowrite.app/docs/markdown-meeting-notes" />',
  );
  expect(meetingNotesHtml).toContain('"dateModified": "2026-08-20"');

  const privacyMarkdownHtml = fs.readFileSync(
    path.join(process.cwd(), "dist/docs/private-online-markdown-editor/index.html"),
    "utf8",
  );

  expect(privacyMarkdownHtml).toContain(
    "<title>Private Online Markdown Editor - Browser Drafts, Consent, and Local Files</title>",
  );
  expect(privacyMarkdownHtml).toContain(
    '<link rel="canonical" href="https://velowrite.app/docs/private-online-markdown-editor" />',
  );
  expect(privacyMarkdownHtml).toContain('"dateModified": "2026-08-15"');

  const futureHtml = fs.readFileSync(
    path.join(process.cwd(), "dist/docs/future-of-markdown/index.html"),
    "utf8",
  );
  expect(futureHtml).toContain(
    "<title>The Future of Markdown Writing - Local Files, AI, and Export Readiness</title>",
  );
  expect(futureHtml).toContain(
    '<link rel="canonical" href="https://velowrite.app/docs/future-of-markdown" />',
  );

  const typoraHtml = fs.readFileSync(
    path.join(process.cwd(), "dist/docs/typora-alternative/index.html"),
    "utf8",
  );
  expect(typoraHtml).toContain("<title>Typora Alternative - Lightweight Local-First Markdown Editing</title>");
  expect(typoraHtml).toContain(
    '<link rel="canonical" href="https://velowrite.app/docs/typora-alternative" />',
  );

  const windowsHtml = fs.readFileSync(
    path.join(process.cwd(), "dist/docs/markdown-editor-for-windows/index.html"),
    "utf8",
  );
  expect(windowsHtml).toContain("<title>Markdown Editor for Windows - VeloWrite Desktop Preview</title>");
  expect(windowsHtml).toContain(
    '<link rel="canonical" href="https://velowrite.app/docs/markdown-editor-for-windows" />',
  );
});

test("static deployment includes a friendly 404 without SPA catch-all rewrites", async ({ page }) => {
  const notFoundHtml = fs.readFileSync(path.join(process.cwd(), "dist/404.html"), "utf8");
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), "vercel.json"), "utf8"));

  expect(notFoundHtml).toContain("<title>Page Not Found - VeloWrite</title>");
  expect(vercelConfig.rewrites).toBeUndefined();
  expect(vercelConfig.cleanUrls).toBe(true);

  // Vite preview falls back to the SPA for extensionless paths, while Vercel serves 404.html.
  // This keeps the rendered friendly page covered without asserting Vite's fallback status.
  await page.goto("/web111");
  await expect(page.getByRole("heading", { name: "This page is not available." })).toBeVisible();
});

test("landing page drives users to web editor and desktop download", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Write Markdown. Keep files." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Open Web Editor/i }).first()).toHaveAttribute(
    "href",
    /\/web/,
  );
  await expect(page.getByRole("link", { name: /Download Desktop/i }).first()).toHaveAttribute(
    "href",
    /\/download/,
  );
  await expect(page.getByRole("heading", { name: /Start in the browser/i })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /See what stays local/i }),
  ).toBeVisible();
  await expect(page.getByText("Private by default")).toBeVisible();
  await expect(page.getByLabel("VeloWrite product video")).toBeVisible();
  await expect(page.locator(".product-frame .landing-editor-image")).toBeVisible();
});

test("public routes defer editor bundles until the editor is opened", async ({ page }) => {
  const requests = [];
  page.on("request", (request) => {
    if (request.resourceType() === "script") requests.push(request.url());
  });

  await page.goto("/", { waitUntil: "networkidle" });
  expect(requests.some((url) => url.includes("publicPages"))).toBe(false);
  expect(requests.some((url) => url.includes("EditorApp"))).toBe(false);

  requests.length = 0;
  await page.goto("/download", { waitUntil: "networkidle" });
  expect(requests.some((url) => url.includes("publicPages"))).toBe(true);
  expect(requests.some((url) => url.includes("EditorApp"))).toBe(false);
});

test("editor action groups expose valid accessible names", async ({ page }) => {
  await page.goto("/web", { waitUntil: "networkidle" });

  const outputActions = page.locator(".action-group.export-actions");
  await expect(outputActions).toHaveAttribute("role", "group");
  await expect(outputActions).toHaveAttribute("aria-label", "Output actions");
  await expect(page.locator(".action-group.file-actions")).toHaveAttribute("role", "group");
  await expect(page.locator(".action-group.workspace-actions")).toHaveAttribute("role", "group");
});

test("roadmap shows recommended next priorities", async ({ page }) => {
  await page.goto("/roadmap");

  await expect(page.getByRole("heading", { name: "What we plan to build next" })).toBeVisible();
  await expect(page.getByText("Recommended next")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "See what is available, what is being improved, and what may come later as Pro." }),
  ).toBeVisible();
  await expect(page.locator(".roadmap-stage-grid article", { hasText: "Shipped" })).toContainText(
    "Markdown learning library",
  );
  await expect(page.locator(".roadmap-stage-grid article", { hasText: "In progress" })).toContainText(
    "Editor and preview sync scrolling",
  );
  await expect(page.locator(".roadmap-stage-grid article", { hasText: "Pro candidates" })).toContainText(
    "AI writing, publishing, and advanced export research",
  );
  await expect(page.getByRole("heading", { name: "Make the desktop app feel native" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Make long-document recovery easier to read" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Help users catch export problems" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "What should be reliable before Pro becomes the main focus." }),
  ).toBeVisible();
  await expect(page.getByLabel("Preview acceptance checklist")).toContainText(
    "Open directly into the editor without a marketing-style first screen.",
  );
});

test("web editor switches between writing, split, and preview modes", async ({ page }) => {
  await page.goto("/web?utm_source=e2e&utm_medium=smoke");

  const editor = page.getByLabel("VeloWrite editor");
  await expect(editor).toBeVisible();
  await expect(page.getByLabel("Markdown editor")).toBeVisible();
  await expect(page.getByLabel("Rendered preview")).toBeVisible();

  await page.getByRole("button", { name: "Write" }).click();
  await expect(page.locator(".editor-grid")).toHaveClass(/mode-write/);

  await page.getByRole("button", { name: "Preview" }).click();
  await expect(page.locator(".editor-grid")).toHaveClass(/mode-preview/);
  await expect(page.getByLabel("Rendered preview")).toBeVisible();

  await page.getByRole("button", { name: "Split" }).click();
  await expect(page.locator(".editor-grid")).toHaveClass(/mode-split/);
});

test("split mode syncs scrolling in both directions", async ({ page }) => {
  const longMarkdown = Array.from(
    { length: 36 },
    (_, index) => `## Section ${index + 1}\n\nA long paragraph for scroll synchronization testing. VeloWrite keeps the editor and rendered preview aligned while the document moves through a realistic reading length.\n`,
  ).join("\n");

  await page.goto("/web?utm_source=e2e&utm_medium=scroll_sync");
  await page.evaluate((markdown) => {
    localStorage.setItem("velowrite:draft", markdown);
    localStorage.setItem("velowrite:draft-name", "scroll-sync.md");
  }, longMarkdown);
  await page.reload();

  await page.getByRole("button", { name: "Split", exact: true }).click();
  const editorScroller = page.locator(".cm-scroller").first();
  const preview = page.locator(".markdown-body").first();

  await preview.evaluate((element) => {
    element.scrollTop = element.scrollHeight * 0.55;
    element.dispatchEvent(new Event("scroll", { bubbles: true }));
  });
  await expect
    .poll(() => editorScroller.evaluate((element) => Math.round(element.scrollTop)))
    .toBeGreaterThan(0);

  await editorScroller.evaluate((element) => {
    element.scrollTop = element.scrollHeight * 0.2;
    element.dispatchEvent(new Event("scroll", { bubbles: true }));
  });
  await expect
    .poll(() => preview.evaluate((element) => Math.round(element.scrollTop)))
    .toBeGreaterThan(0);
});

test("preview marks an image that fails to load", async ({ page }) => {
  await page.goto("/web?utm_source=e2e&utm_medium=missing_image");
  await page.evaluate(() => {
    localStorage.setItem(
      "velowrite:draft",
      "# Image check\n\n![Missing asset](/does-not-exist-velowrite.png)",
    );
  });
  await page.reload();

  const image = page.getByLabel("Rendered preview").locator("img").first();
  await expect(image).toHaveClass(/image-missing/);
  await expect(image).toHaveAttribute("title", /relative path/);
});

test("long mixed Markdown stays readable and synchronized in split mode", async ({ page }) => {
  const sections = Array.from({ length: 72 }, (_, index) => `## Section ${index + 1}

This paragraph is long enough to create a realistic reading surface while the editor and preview remain in split mode.

| Input | Output |
| --- | --- |
| Math | $x_${index + 1}$ |
| Link | [VeloWrite](https://velowrite.app) |

![Missing image ${index + 1}](/missing-long-document-${index + 1}.png)


\`\`\`javascript
const section${index + 1} = ${index + 1};
\`\`\`

\`\`\`mermaid
flowchart LR
  A${index + 1}[Draft] --> B${index + 1}[Review]
\`\`\`
`).join("\n");

  await page.goto("/web?utm_source=e2e&utm_medium=long_mixed_markdown");
  await page.evaluate((markdown) => {
    localStorage.setItem("velowrite:draft", markdown);
    localStorage.setItem("velowrite:draft-name", "long-mixed.md");
  }, sections);
  await page.reload();
  await page.getByRole("button", { name: "Split", exact: true }).click();

  await expect(page.locator(".markdown-body h2")).toHaveCount(72);
  await expect(page.locator(".markdown-body table").first()).toBeVisible();
  await expect(page.locator(".markdown-body .katex").first()).toBeVisible();
  await expect(page.locator(".markdown-body .mermaid-rendered svg").first()).toBeVisible();
  await expect(page.locator(".markdown-body img.image-missing").first()).toBeVisible();

  const editorScroller = page.locator(".cm-scroller").first();
  const preview = page.locator(".markdown-body").first();
  await preview.evaluate((element) => {
    element.scrollTop = element.scrollHeight * 0.72;
    element.dispatchEvent(new Event("scroll", { bubbles: true }));
  });
  await expect
    .poll(() =>
      editorScroller.evaluate(
        (element) => element.scrollTop / (element.scrollHeight - element.clientHeight),
      ),
    )
    .toBeGreaterThan(0.55);
  await page.waitForTimeout(800);
  const previewRatioBeforeEditorScroll = await preview.evaluate(
    (element) => element.scrollTop / (element.scrollHeight - element.clientHeight),
  );
  const editorBox = await editorScroller.boundingBox();
  expect(editorBox).toBeTruthy();
  await page.mouse.move(
    (editorBox?.x ?? 0) + (editorBox?.width ?? 0) / 2,
    (editorBox?.y ?? 0) + (editorBox?.height ?? 0) / 2,
  );
  await page.mouse.wheel(0, -5200);
  await page.mouse.wheel(0, -5200);
  await page.mouse.wheel(0, -5200);
  await expect
    .poll(() =>
      preview.evaluate(
        (element) => element.scrollTop / (element.scrollHeight - element.clientHeight),
      ),
    )
    .toBeLessThan(previewRatioBeforeEditorScroll - 0.025);
});

test("Markdown editing boundaries preserve source and rendered structure", async ({ page }) => {
  const markdown = `# Boundary Check

**Bold** and *italic* text with a [link](https://velowrite.app).

- Parent
  - Child
    - Grandchild

| Name | Value |
| --- | --- |
| Alpha | **bold** |

Inline math $a^2 + b^2 = c^2$.

\`\`\`python
print("hello")
\`\`\`
`;

  await page.goto("/web?utm_source=e2e&utm_medium=markdown_boundaries");
  await page.getByRole("button", { name: "Write", exact: true }).click();
  const editor = page.locator(".cm-content").first();
  await editor.click();
  await page.keyboard.press("Control+A");
  await page.keyboard.insertText(markdown);

  await page.getByRole("button", { name: "Preview", exact: true }).click();
  const renderedPreview = page.getByLabel("Rendered preview");
  await expect(renderedPreview.locator("h1")).toHaveText("Boundary Check");
  await expect(renderedPreview.locator("strong").first()).toHaveText("Bold");
  await expect(renderedPreview.locator("em")).toContainText("italic");
  await expect(renderedPreview.locator("a")).toHaveAttribute("href", "https://velowrite.app");
  await expect(renderedPreview.locator("ul ul ul li")).toContainText("Grandchild");
  await expect(renderedPreview.locator("table")).toContainText("Alpha");
  await expect(renderedPreview.locator(".katex")).toBeVisible();
  await expect(renderedPreview.locator("pre code.language-python")).toContainText('print("hello")');

  await page.getByRole("button", { name: "Write", exact: true }).click();
  await expect(editor).toContainText("Grandchild");
  await expect(editor).toContainText("a^2 + b^2 = c^2");
});

test("document tools update the editor and preview after outline navigation", async ({ page }) => {
  const markdown = [
    "# Tool Check",
    "",
    "## Target Section",
    "",
    "| Name | State |",
    "|---|---|",
    "| PDF |done|",
    "| Longer item |todo|",
  ].join("\n");

  await page.goto("/app");
  await page.evaluate((draft) => {
    localStorage.setItem("velowrite:draft", draft);
    localStorage.setItem("velowrite:draft-name", "document-tools.md");
  }, markdown);
  await page.reload();
  await page.getByRole("button", { name: "Show workspace" }).click();

  await page.getByRole("button", { name: "Target Section" }).click();
  await page.getByRole("button", { name: "Format tables" }).click();

  const editor = page.locator(".cm-content").first();
  const renderedPreview = page.getByLabel("Rendered preview");
  await expect(editor).toContainText("| Name        | State |");
  await expect(editor).toContainText("| Longer item | todo  |");
  await expect(renderedPreview.locator("table")).toContainText("Longer item");
  await expect(page.getByRole("status")).toContainText("Formatted 1 Markdown table");
  await expect(page.locator(".cm-activeLine").first()).toContainText("Target Section");

  await page.getByRole("button", { name: "Insert table" }).click();
  await expect(editor).toContainText("| Item | Owner | Status |");
  await expect(renderedPreview.locator("table")).toHaveCount(2);
});

test("format tables keeps the current editing location in a long document", async ({ page }) => {
  const markdown = [
    "# Long Document",
    "",
    ...Array.from(
      { length: 10 },
      (_, index) => `## Section ${index + 1}\n\nParagraph ${index + 1}.\n`,
    ),
    "## X Production Notes and Story Hook",
    "",
    "Draft line before formatting.",
    "",
    "| Name | State |",
    "|---|---|",
    "| Opening hook |draft|",
    "| Ending beat |review|",
    "",
    ...Array.from(
      { length: 10 },
      (_, index) => `## Later Section ${index + 1}\n\nLater paragraph ${index + 1}.\n`,
    ),
  ].join("\n");

  await page.goto("/app");
  await page.evaluate((draft) => {
    localStorage.setItem("velowrite:draft", draft);
    localStorage.setItem("velowrite:draft-name", "long-format.md");
  }, markdown);
  await page.reload();
  await page.getByRole("button", { name: "Show workspace" }).click();

  await page.getByRole("button", { name: "X Production Notes and Story Hook" }).click();
  const editor = page.locator(".cm-content").first();
  await expect(page.locator(".cm-activeLine").first()).toContainText(
    "X Production Notes and Story Hook",
  );

  await editor.click();
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await page.keyboard.type("Fresh note that should stay in view.");
  await page.getByRole("button", { name: "Format tables" }).click();

  await expect(editor).toContainText("Fresh note that should stay in view.");
  await expect(page.locator(".cm-activeLine").first()).toContainText(
    "Fresh note that should stay in view.",
  );
  await expect(page.getByLabel("Rendered preview")).toContainText(
    "Fresh note that should stay in view.",
  );
  await expect(page.getByRole("status")).toContainText("Formatted 1 Markdown table");
});

test("desktop quick marks keep separate locations per slot", async ({ page }) => {
  const markdown = [
    "# Quick Mark Check",
    "",
    ...Array.from(
      { length: 18 },
      (_, index) => `## Section ${index + 1}\n\nParagraph ${index + 1}.\n`,
    ),
  ].join("\n");

  await page.goto("/app");
  await page.evaluate((draft) => {
    localStorage.setItem("velowrite:draft", draft);
    localStorage.setItem("velowrite:draft-name", "quick-mark.md");
  }, markdown);
  await page.reload();
  await page.getByRole("button", { name: "Show workspace" }).click();

  await page.locator(".document-mark-slots button").nth(0).click();
  await page.getByRole("button", { name: "Section 15" }).click();
  await expect(page.locator(".cm-activeLine").first()).toContainText("Section 15");
  await page.getByRole("button", { name: "Set M1" }).click();
  await expect(page.getByRole("status")).toContainText("Quick mark M1 set at line");

  await page.locator(".document-mark-slots button").nth(1).click();
  await page.getByRole("button", { name: "Section 8" }).click();
  await page.getByRole("button", { name: "Set M2" }).click();
  await expect(page.getByRole("status")).toContainText("Quick mark M2 set at line");

  await page.locator(".document-mark-slots button").nth(2).click();
  await page.getByRole("button", { name: "Section 3" }).click();
  await page.getByRole("button", { name: "Set M3" }).click();
  await expect(page.getByRole("status")).toContainText("Quick mark M3 set at line");

  await page.locator(".cm-content").first().click();
  await page.keyboard.press("Control+Home");
  await expect(page.locator(".cm-activeLine").first()).toContainText("Quick Mark Check");
  await page.locator(".document-mark-actions button").nth(1).click();
  await expect(page.locator(".cm-activeLine").first()).toContainText("Section 3");

  await page.locator(".document-mark-slots button").nth(1).click();
  await page.locator(".document-mark-actions button").nth(1).click();
  await expect(page.locator(".cm-activeLine").first()).toContainText("Section 8");

  await page.locator(".document-mark-slots button").nth(0).click();
  await page.locator(".document-mark-actions button").nth(1).click();
  await expect(page.locator(".cm-activeLine").first()).toContainText("Section 15");
});

test("web editor brand link returns to the homepage", async ({ page }) => {
  await page.goto("/web?utm_source=e2e&utm_medium=brand");

  await page.getByRole("link", { name: /VeloWrite/ }).first().click();
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("heading", { name: "Write Markdown. Keep files." }),
  ).toBeVisible();
});

test("web editor can start from practical Markdown templates", async ({ page }) => {
  await page.goto("/web?utm_source=e2e&utm_medium=templates");

  await expect(page.getByLabel("Start from a template")).toBeVisible();
  await page.getByRole("button", { name: /Meeting Notes/i }).click();

  await expect(page.locator(".search")).toContainText("Meeting Notes.md");
  await expect(page.locator(".cm-content").first()).toContainText("Meeting Notes");
  await expect(page.locator(".cm-content").first()).toContainText("Action Items");
});

test("web editor and docs avoid mobile horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const route of ["/web?utm_source=e2e&utm_medium=responsive", "/docs/online-markdown-editor"]) {
    await page.goto(route);
    const overflow = await page.evaluate(() => {
      const elements = [...document.querySelectorAll("body *")];
      const overflowing = elements.filter((element) => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return (
          rect.width > 1 &&
          rect.height > 1 &&
          style.position !== "fixed" &&
          rect.top < window.innerHeight + 100 &&
          (rect.left < -2 || rect.right > window.innerWidth + 2)
        );
      });

      return {
        page: document.documentElement.scrollWidth - window.innerWidth,
        visible: overflowing.length,
      };
    });

    expect(overflow.page).toBeLessThanOrEqual(1);
    expect(overflow.visible).toBe(0);
  }
});

test("public pages keep compact desktop titles and responsive layouts", async ({ page }) => {
  const publicRoutes = [
    "/",
    "/demo",
    "/download",
    "/pro",
    "/roadmap",
    "/docs",
    "/docs/markdown",
    "/docs/markdown-history",
    "/docs/future-of-markdown",
    "/docs/online-markdown-editor",
    "/docs/markdown-basics",
    "/docs/markdown-for-writers",
    "/docs/markdown-for-developers",
    "/docs/markdown-code-blocks",
    "/docs/long-markdown-workflow",
    "/docs/markdown-math",
    "/docs/local-first-markdown",
    "/docs/markdown-to-blog",
    "/docs/typora-alternative",
    "/docs/markdown-editor-for-windows",
    "/docs/markdown-editor-for-linux",
    "/docs/preview-release-policy",
    "/docs/private-online-markdown-editor",
    "/guide",
    "/changelog",
    "/faq",
    "/privacy",
    "/terms",
    "/refund",
    "/license",
    "/feedback",
    "/web111",
  ];
  const compactTitleRoutes = ["/", "/demo", "/pro", "/roadmap", "/faq", "/feedback", "/web111"];

  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const route of publicRoutes) {
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${route} should not overflow on desktop`).toBeLessThanOrEqual(1);

    if (compactTitleRoutes.includes(route)) {
      const lines = await page.locator("h1").first().evaluate((heading) => {
        const rect = heading.getBoundingClientRect();
        const style = window.getComputedStyle(heading);
        const lineHeight = Number.parseFloat(style.lineHeight) || Number.parseFloat(style.fontSize) * 1.1;
        return Math.round(rect.height / lineHeight);
      });
      expect(lines, `${route} title should not wrap excessively on desktop`).toBeLessThanOrEqual(3);
    }
  }

  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of publicRoutes) {
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${route} should not overflow on mobile`).toBeLessThanOrEqual(1);
  }
});

test("web editor shows a mobile brand home link", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/web?utm_source=e2e&utm_medium=mobile_brand");

  const brandLink = page.locator(".mobile-editor-brand");
  await expect(brandLink).toBeVisible();
  await expect(brandLink).toHaveAttribute("href", "/");
  await expect(page.locator(".editor-grid")).toHaveClass(/mode-write/);

  await brandLink.click();
  await expect(page).toHaveURL(/\/$/);
});

test("web editor explains when desktop is better for local files", async ({ page }) => {
  await page.goto("/web?utm_source=e2e&utm_medium=desktop_prompt");

  const download = page.waitForEvent("download");
  await page
    .getByLabel("File actions")
    .getByRole("button", { name: "Download Markdown file" })
    .click();
  await download;

  const prompt = page.getByLabel("Desktop upgrade prompt");
  await expect(prompt).toBeVisible();
  await expect(prompt.getByText("Continue in Desktop", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open in Desktop/i })).toHaveAttribute(
    "href",
    /^velowrite:\/\/import/,
  );
  await expect(page.getByRole("button", { name: /Download backup/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Get app/i })).toHaveAttribute(
    "href",
    /\/download/,
  );
});

test("web editor confirms clipboard copy actions", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          window.localStorage.setItem("velowrite:e2e-clipboard", text);
        },
      },
    });
  });
  await page.goto("/web?utm_source=e2e&utm_medium=clipboard");

  await page.getByRole("button", { name: "Copy Markdown to clipboard" }).click();

  await expect(page.getByRole("status")).toContainText("Markdown copied to clipboard");
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("velowrite:e2e-clipboard")))
    .toContain("#");
});

test("web editor embeds a dropped image and keeps it after refresh", async ({ page }) => {
  await page.goto("/web?utm_source=e2e&utm_medium=browser_image");

  const dataTransfer = await page.evaluateHandle(() => {
    const bytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
    const file = new File([bytes], "diagram.png", { type: "image/png" });
    const transfer = new DataTransfer();
    transfer.items.add(file);
    return transfer;
  });
  await page.locator("main").dispatchEvent("drop", { dataTransfer });

  await expect(page.getByRole("status")).toContainText("Image embedded in browser draft");
  await expect(page.locator(".markdown-body img").first()).toHaveAttribute(
    "src",
    /^data:image\/png;base64,/,
  );

  await page.reload();
  await expect(page.locator(".markdown-body img").first()).toHaveAttribute(
    "src",
    /^data:image\/png;base64,/,
  );
});

test("web editor restores multiple tabs and each tab view mode after refresh", async ({ page }) => {
  await page.goto("/web?utm_source=e2e&utm_medium=browser_workspace");
  const editor = page.locator(".cm-content").first();
  await editor.click();
  await page.keyboard.press("Control+A");
  await page.keyboard.insertText("# First Browser Tab\n\nFirst draft");
  await page.getByRole("button", { name: "New document tab" }).click();
  await page.getByRole("button", { name: "Write", exact: true }).click();
  await page.locator(".cm-content").first().click();
  await page.keyboard.press("Control+A");
  await page.keyboard.insertText("# Second Browser Tab\n\nSecond draft");
  await page.getByRole("button", { name: "Preview", exact: true }).click();

  await page.reload();
  await expect(page.locator('[role="tab"]')).toHaveCount(2);
  await expect(page.locator(".editor-grid")).toHaveClass(/mode-preview/);
  await expect(page.locator(".markdown-body")).toContainText("Second Browser Tab");

  await page.locator('[role="tab"]').first().click();
  await expect(page.locator(".markdown-body")).toContainText("First Browser Tab");
});

test("docs index publishes the Markdown history article", async ({ page }) => {
  await page.goto("/docs");

  const historyLink = page.getByRole("link", { name: "A Short History of Markdown" });
  await expect(historyLink).toHaveAttribute("href", "/docs/markdown-history");
  await expect(historyLink.locator("..")).toContainText("Published");
  await expect(page.getByRole("heading", { name: "Release Trust" })).toBeVisible();
  await expect(page.getByRole("link", { name: "How VeloWrite Preview Releases Work" })).toHaveAttribute(
    "href",
    "/docs/preview-release-policy",
  );

  await historyLink.click();
  await expect(page.getByRole("heading", { name: "A Short History of Markdown" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Timeline" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Timeline" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "2004 and the first release" })).toBeVisible();
  await expect(page.getByRole("link", { name: "2004 and the first release" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Aaron Swartz and early feedback" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Why variants and CommonMark appeared" })).toBeVisible();
  await expect(page.locator(".content-example").first()).toContainText("Plain text that still has structure");
});

test("docs publishes the private online Markdown article", async ({ page }) => {
  await page.goto("/docs/private-online-markdown-editor");

  await expect(
    page.getByRole("heading", {
      name: "Private Online Markdown Editor: What Stays in Your Browser?",
    }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Analytics is separate from your Markdown draft" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Try the Web Editor" })).toHaveAttribute(
    "href",
    /\/web\?utm_source=private_markdown_cta/,
  );

  const exportSection = page.locator("#downloads-and-exports");
  const renderedExample = exportSection.locator(".content-example-preview");
  await expect(renderedExample.locator("pre code")).toContainText("project-notes.md");
  await expect(renderedExample.locator("a")).toHaveCount(0);
});

test("web editor exports a PDF without browser print headers", async ({ page }) => {
  await page.addInitScript(() => {
    window.print = () => {
      window.localStorage.setItem("velowrite:e2e-print-called", "true");
    };
  });
  await page.goto("/web?utm_source=e2e&utm_medium=pdf");
  await page.locator(".cm-content").first().click();
  await page.keyboard.press("Control+A");
  await page.keyboard.insertText(
    "# PDF Table\n\n| Column | Meaning |\n| --- | --- |\n| MD | Markdown source |\n| PDF | Export review copy |",
  );

  const downloadPromise = page.waitForEvent("download");
  await page
    .getByLabel("Output actions")
    .getByRole("button", { name: "Export PDF file" })
    .click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe("Untitled.pdf");
  await expect(page.locator(".print-export-root")).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("Downloaded PDF export");
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("velowrite:e2e-print-called")))
    .toBeNull();
});

test("web editor exports rendered math through the dedicated PDF engine", async ({ page }) => {
  await page.goto("/web?utm_source=e2e&utm_medium=pdf_math");
  await page.locator(".cm-content").first().click();
  await page.keyboard.press("Control+A");
  await page.keyboard.insertText(String.raw`# Mathematical Notes

Inline math works inside normal text: $E = mc^2$ and $a^2 + b^2 = c^2$.

$$
\int_0^\infty e^{-x^2}\,dx = \frac{\sqrt{\pi}}{2}
$$`);

  const downloadPromise = page.waitForEvent("download");
  await page
    .getByLabel("Output actions")
    .getByRole("button", { name: "Export PDF file" })
    .click();
  const download = await downloadPromise;
  const pdfPath = await download.path();
  expect(download.suggestedFilename()).toBe("Untitled.pdf");
  expect(pdfPath).toBeTruthy();
  expect(fs.statSync(pdfPath ?? "").size).toBeGreaterThan(20_000);
  await expect(page.getByRole("status")).toContainText("Downloaded PDF export");
});

test("PDF table export preferences are kept for the dedicated PDF engine", async ({ page }) => {
  await page.addInitScript(() => {
    window.print = () => {
      window.localStorage.setItem("velowrite:e2e-print-called", "true");
    };
  });
  await page.goto("/web?utm_source=e2e&utm_medium=print-preferences");

  await page.getByRole("button", { name: "Settings" }).click();
  const settings = page.getByRole("dialog", { name: "Settings" });
  await settings.getByRole("tab", { name: "Tables" }).click();
  await settings.getByLabel("Export table header").getByRole("button", { name: "plain" }).click();
  await settings.getByLabel("Export table rows").getByRole("button", { name: "plain" }).click();
  await settings.getByLabel("Export table borders").getByRole("button", { name: "light" }).click();
  await settings.getByLabel("Export table color").getByRole("button", { name: "blue" }).click();
  await page.getByRole("button", { name: "Close settings" }).click();

  await page.locator(".cm-content").first().click();
  await page.keyboard.press("Control+A");
  await page.keyboard.insertText("# PDF Table\n\n| Column | Meaning |\n| --- | --- |\n| PDF | Review copy |");

  const downloadPromise = page.waitForEvent("download");
  await page
    .getByLabel("Output actions")
    .getByRole("button", { name: "Export PDF file" })
    .click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe("Untitled.pdf");
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("velowrite:pdf-export-style")))
    .toContain('"color":"blue"');
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("velowrite:e2e-print-called")))
    .toBeNull();
});

test("desktop shell opens in focused editing mode", async ({ page }) => {
  await page.goto("/app");

  await expect(page.getByLabel("VeloWrite editor")).toHaveClass(/desktop-focus/);
  await expect(page.locator(".sidebar")).toBeHidden();
  await expect(page.getByLabel("Markdown editor")).toBeVisible();
  await expect(page.getByLabel("Current file status")).toBeVisible();
  await expect(page.getByLabel("Current file status")).toContainText("Draft has not been saved to a local file yet");
  await expect(page.getByLabel("Current file status")).toContainText("0 / 3 draft snapshots");
  await expect(page.getByLabel("Desktop start")).toHaveCount(0);
  await expect(page.getByText("Unsaved local draft")).toBeVisible();

  await page.getByRole("button", { name: "Show workspace" }).click();
  await expect(page.getByLabel("VeloWrite editor")).not.toHaveClass(/desktop-focus/);
  await expect(page.locator(".sidebar")).toBeVisible();
  await expect(page.getByLabel("Document outline")).toBeVisible();
  await expect(page.getByLabel("Document structure map")).toContainText("Headings");
  await expect(page.getByLabel("Export readiness")).toHaveCount(0);
});

test("desktop document tabs keep separate drafts while switching", async ({ page }) => {
  await page.goto("/app");

  const tabList = page.getByRole("tablist", { name: "Open documents" });
  await expect(tabList.getByRole("tab")).toHaveCount(1);

  await page.getByRole("button", { name: "New document tab" }).click();
  await expect(tabList.getByRole("tab")).toHaveCount(2);

  const editorContent = page.locator(".cm-content").first();
  await editorContent.click();
  await page.keyboard.press("Control+A");
  await page.keyboard.insertText("# Second tab\n\nThis draft stays in its own tab.");

  await tabList.getByRole("tab").first().click();
  await expect(editorContent).toContainText("Start Writing");

  await tabList.getByRole("tab").nth(1).click();
  await expect(editorContent).toContainText("Second tab");
  await expect(tabList.getByRole("button", { name: /Close Quick Note/ })).toBeVisible();
});

test("document tabs keep their own writing, split, or preview mode", async ({ page }) => {
  await page.goto("/app");

  const tabList = page.getByRole("tablist", { name: "Open documents" });
  await page.getByRole("button", { name: "New document tab" }).click();
  await page.getByRole("button", { name: "Preview", exact: true }).click();
  await expect(page.locator(".editor-grid")).toHaveClass(/mode-preview/);

  await tabList.getByRole("tab").first().click();
  await expect(page.locator(".editor-grid")).toHaveClass(/mode-write/);

  await page.getByRole("button", { name: "Split", exact: true }).click();
  await expect(page.locator(".editor-grid")).toHaveClass(/mode-split/);

  await tabList.getByRole("tab").nth(1).click();
  await expect(page.locator(".editor-grid")).toHaveClass(/mode-preview/);
});

test("switching document tabs keeps the active cursor near its previous position", async ({ page }) => {
  await page.goto("/app");

  const editor = page.locator(".cm-content").first();
  await editor.click();
  await page.keyboard.press("Control+End");
  await page.getByRole("button", { name: "New document tab" }).click();
  await page.getByRole("tablist", { name: "Open documents" }).getByRole("tab").first().click();
  await editor.focus();
  await page.keyboard.insertText("\nCursor stays here");

  await expect(editor).toContainText("Cursor stays here");
  await expect(editor).not.toContainText("Cursor stays hereStart Writing");
});

test("document tabs stay within the viewport on narrow windows", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/app");

  await page.getByRole("button", { name: "New document tab" }).click();
  await page.getByRole("button", { name: "New document tab" }).click();

  await expect(page.getByRole("tablist", { name: "Open documents" }).getByRole("tab")).toHaveCount(3);
  await page.getByRole("tablist", { name: "Open documents" }).getByRole("tab").last().click();
  const tabStripMetrics = await page.locator(".document-tab-list").evaluate((element) => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
  }));
  expect(tabStripMetrics.scrollHeight).toBeLessThanOrEqual(tabStripMetrics.clientHeight);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("desktop supports common keyboard shortcuts across platforms", async ({ page }) => {
  await page.goto("/app");
  await page.getByLabel("VeloWrite editor").click();

  await page.keyboard.press("Control+Comma");
  await expect(page.getByRole("dialog", { name: "Settings" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Settings" })).toBeHidden();

  await page.keyboard.press("Control+2");
  await expect(page.locator(".editor-grid")).toHaveClass(/mode-split/);
  await page.keyboard.press("Control+3");
  await expect(page.locator(".editor-grid")).toHaveClass(/mode-preview/);
  await page.keyboard.press("Control+1");
  await expect(page.locator(".editor-grid")).toHaveClass(/mode-write/);

  await page.getByRole("button", { name: "New document tab" }).click();
  await expect(page.getByRole("tablist", { name: "Open documents" }).getByRole("tab")).toHaveCount(2);
  await page.keyboard.press("Control+PageDown");
  await expect(page.getByRole("tablist", { name: "Open documents" }).getByRole("tab").first()).toHaveAttribute(
    "aria-selected",
    "true",
  );

  await page.keyboard.press("Control+W");
  await expect(page.getByRole("tablist", { name: "Open documents" }).getByRole("tab")).toHaveCount(1);
});

test("desktop about panel shows the installed app version", async ({ page }) => {
  await page.goto("/app");

  await page.getByRole("button", { name: "Show workspace" }).click();
  await page.getByRole("button", { name: "About" }).click();

  const aboutDialog = page.getByRole("dialog", { name: "VeloWrite" });
  await expect(aboutDialog).toBeVisible();
  await expect(aboutDialog).toContainText("Version");
  await expect(aboutDialog).toContainText("0.2.9");
  await expect(aboutDialog).toContainText("Update check");
  await expect(aboutDialog).toContainText("kenwater89@gmail.com");
});

test("desktop focus mode hides chrome and can be exited", async ({ page }) => {
  await page.goto("/app");

  await page.getByRole("button", { name: "Enter fullscreen focus" }).click();
  await expect(page.getByLabel("VeloWrite editor")).toHaveClass(/writing-focus/);
  await expect(page.locator(".topbar")).toBeHidden();
  await expect(page.getByRole("button", { name: "Exit fullscreen focus" })).toBeVisible();

  await page.getByRole("button", { name: "Exit fullscreen focus" }).click();
  await expect(page.getByLabel("VeloWrite editor")).not.toHaveClass(/writing-focus/);
  await expect(page.locator(".topbar")).toBeVisible();
});

test("desktop toolbar shows immediate icon tooltips", async ({ page }) => {
  await page.goto("/app");

  await page.getByRole("button", { name: "Show workspace" }).click();
  const workspaceToggle = page.getByRole("button", { name: "Hide workspace" });
  await workspaceToggle.hover();
  await expect
    .poll(async () => workspaceToggle.evaluate((element) => window.getComputedStyle(element, "::after").opacity))
    .toBe("1");
  const workspaceTooltip = await workspaceToggle.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element, "::after");
    const width = Number.parseFloat(style.width);
    const left = rect.left + rect.width + 8;
    return { left, width, viewportWidth: window.innerWidth };
  });
  expect(workspaceTooltip.left).toBeGreaterThanOrEqual(0);
  expect(workspaceTooltip.left + workspaceTooltip.width).toBeLessThanOrEqual(
    workspaceTooltip.viewportWidth,
  );

  const saveButton = page.getByRole("button", { name: "Save Markdown file" });
  await saveButton.hover();

  await expect
    .poll(async () =>
      saveButton.evaluate((element) => window.getComputedStyle(element, "::after").opacity),
    )
    .toBe("1");
  const tooltipContent = await saveButton.evaluate((element) =>
    window.getComputedStyle(element, "::after").content,
  );
  expect(tooltipContent).toContain("Save Markdown file");

  await expect(page.getByRole("button", { name: "Export HTML file" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Export PDF file" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy Markdown to clipboard" })).toBeVisible();
  await expect(page.getByRole("button", { name: "History" })).toBeVisible();

  const htmlButton = page.getByRole("button", { name: "Export HTML file" });
  await htmlButton.hover();
  await expect
    .poll(async () =>
      htmlButton.evaluate((element) => window.getComputedStyle(element, "::after").opacity),
    )
    .toBe("1");
});

test("web editor keeps browser-local history snapshots", async ({ page }) => {
  await page.goto("/web?utm_source=e2e&utm_medium=history");

  const historyButton = page.getByRole("button", { name: "History" }).first();
  await expect(historyButton).toBeEnabled();

  await page.locator(".cm-content").first().click();
  await page.keyboard.press("Control+A");
  await page.keyboard.insertText("# Browser history\n\nThis draft should create a local browser snapshot.");

  await historyButton.click();
  const historyDialog = page.getByRole("dialog", { name: "History" });
  await expect(historyDialog).toBeVisible();
  await expect(page.locator(".history-item").first()).toBeVisible();

  await page.locator(".history-summary").first().click();
  await expect(page.getByLabel("Snapshot diff preview")).toBeVisible();
  await expect(page.getByText("Restore preview")).toBeVisible();
  await expect(page.getByRole("button", { name: "Jump to first change" })).toBeVisible();
});

test("history panel exposes section shortcuts for longer diffs", async ({ page }) => {
  const makeSection = (title: string, marker: string, count: number) => {
    const lines = Array.from({ length: count }, (_, index) => `${marker} line ${index + 1}.`).join("\n");
    return `## ${title}\n${lines}`;
  };

  const oldMarkdown = [
    "# Roadmap",
    "",
    makeSection("Alpha", "Alpha", 3),
    "",
    makeSection("Beta", "Beta", 3),
    "",
    makeSection("Gamma", "Gamma", 24),
  ].join("\n");

  const currentMarkdown = [
    "# Roadmap",
    "",
    makeSection("Alpha", "Alpha", 3),
    "",
    makeSection("Beta", "Beta", 3),
    "",
    `## Gamma\n${Array.from({ length: 24 }, (_, index) => `Gamma line ${index + 1}${index === 10 ? " updated" : "."}`).join("\n")}`,
  ].join("\n");

  await page.addInitScript((contents) => {
    window.localStorage.setItem(
      "velowrite:browser-history",
      JSON.stringify([
        {
          id: "browser-old",
          fileName: "Sections.md",
          createdAt: 1,
          contents,
        },
      ]),
    );
  }, oldMarkdown);

  await page.goto("/web?utm_source=e2e&utm_medium=history_sections");

  await page.locator(".cm-content").first().click();
  await page.keyboard.press("Control+A");
  await page.keyboard.insertText(currentMarkdown);

  await page.getByRole("button", { name: "History" }).first().click();
  await page.locator(".history-summary").first().click();
  await page.getByRole("button", { name: "Full file" }).click();

  const outline = page.getByLabel("Snapshot outline");
  await expect(outline).toBeVisible();
  await expect(outline.getByRole("button", { name: "Expand all" })).toBeVisible();
  await expect(outline.getByRole("button", { name: "Collapse all" })).toBeVisible();
  await expect(outline.getByRole("button", { name: "Alpha" })).toBeVisible();
  await expect(outline.getByRole("button", { name: "Beta" })).toBeVisible();
  await expect(outline.getByRole("button", { name: "Gamma" })).toBeVisible();

  await outline.getByRole("button", { name: "Collapse all" }).click();
  await expect(page.locator(".history-diff-line")).toHaveCount(0);
  await outline.getByRole("button", { name: "Expand all" }).click();
  await expect(page.locator(".history-diff-line").first()).toBeVisible();

  const changedOutline = page.getByLabel("Changed sections");
  await expect(changedOutline).toBeVisible();
  await expect(changedOutline.getByRole("button", { name: /Gamma/ })).toBeVisible();
  await outline.getByRole("button", { name: "Collapse all" }).click();
  await expect(page.locator(".history-diff-line")).toHaveCount(0);
  await changedOutline.getByRole("button").first().click();
  await expect(page.locator(".history-diff-line").first()).toBeVisible();
});

test("web document tabs keep their browser history isolated", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "velowrite:browser-workspace",
      JSON.stringify({
        activeTabId: "tab-one",
        tabs: [
          {
            id: "tab-one",
            fileName: "One.md",
            markdown: "# One current",
            savedMarkdown: "# One current",
            viewMode: "split",
          },
          {
            id: "tab-two",
            fileName: "Two.md",
            markdown: "# Two current",
            savedMarkdown: "# Two current",
            viewMode: "split",
          },
        ],
      }),
    );
    window.localStorage.setItem(
      "velowrite:browser-history:tab-one",
      JSON.stringify([{ id: "one-old", fileName: "One.md", createdAt: 2, contents: "# One old" }]),
    );
    window.localStorage.setItem(
      "velowrite:browser-history:tab-two",
      JSON.stringify([{ id: "two-old", fileName: "Two.md", createdAt: 1, contents: "# Two old" }]),
    );
  });

  await page.goto("/web?utm_source=e2e&utm_medium=tab-history");

  const historyButton = page.getByRole("button", { name: "History" }).first();
  await historyButton.click();
  await page.locator(".history-summary").first().click();
  await expect(page.getByText("# One old")).toBeVisible();
  await expect(page.getByText("# Two old")).toHaveCount(0);
  await page.getByRole("dialog", { name: "History" }).getByRole("button", { name: "Close" }).click();

  await page.getByRole("tablist", { name: "Open documents" }).getByRole("tab", { name: "Two.md" }).click();
  await historyButton.click();
  await page.locator(".history-summary").first().click();
  await expect(page.getByText("# Two old")).toBeVisible();
  await expect(page.getByText("# One old")).toHaveCount(0);
});

test("web editor history UI explains and enforces the three snapshot preview limit", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "velowrite:browser-history",
      JSON.stringify([
        { id: "browser-4", fileName: "Seed.md", createdAt: 4, contents: "# Four" },
        { id: "browser-3", fileName: "Seed.md", createdAt: 3, contents: "# Three" },
        { id: "browser-2", fileName: "Seed.md", createdAt: 2, contents: "# Two" },
        { id: "browser-1", fileName: "Seed.md", createdAt: 1, contents: "# One" },
      ]),
    );
  });
  await page.goto("/web?utm_source=e2e&utm_medium=history-limit");

  await page.getByRole("button", { name: "History" }).first().click();

  await expect(page.getByText("Free preview keeps the latest 3 local snapshots.")).toBeVisible();
  await expect(page.locator(".history-item")).toHaveCount(3);
  await expect(page.locator(".history-item").first()).toContainText("6 B");
});

test("mobile history panel keeps the preview limit readable without overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "velowrite:browser-history",
      JSON.stringify([
        { id: "browser-4", fileName: "Mobile.md", createdAt: 4, contents: "# Four\n\nMobile snapshot." },
        { id: "browser-3", fileName: "Mobile.md", createdAt: 3, contents: "# Three\n\nMobile snapshot." },
        { id: "browser-2", fileName: "Mobile.md", createdAt: 2, contents: "# Two\n\nMobile snapshot." },
        { id: "browser-1", fileName: "Mobile.md", createdAt: 1, contents: "# One\n\nMobile snapshot." },
      ]),
    );
  });
  await page.goto("/web?utm_source=e2e&utm_medium=history-mobile");

  await page.getByRole("button", { name: /browser snapshots/ }).click();

  const historyDialog = page.getByRole("dialog", { name: "History" });
  await expect(historyDialog).toBeVisible();
  await expect(page.getByText("Free preview keeps the latest 3 local snapshots.")).toBeVisible();
  await expect(page.locator(".history-item")).toHaveCount(3);
  await page.locator(".history-summary").first().click();
  await expect(page.getByLabel("Snapshot diff preview")).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("history shows an empty diff after restoring the matching snapshot", async ({ page }) => {
  await page.goto("/web?utm_source=e2e&utm_medium=history-match");

  const historyButton = page.getByRole("button", { name: "History" }).first();
  await page.locator(".cm-content").first().click();
  await page.keyboard.press("Control+A");
  await page.keyboard.insertText("# Restored history\n\nThis draft will be replaced by the first snapshot.");

  await historyButton.click();
  const firstSnapshot = page.locator(".history-item").first();
  await expect(firstSnapshot).toBeVisible();

  page.once("dialog", (dialog) => void dialog.accept());
  await firstSnapshot.getByRole("button", { name: "Restore" }).click();
  await expect(page.getByRole("dialog", { name: "History" })).toBeHidden();

  await historyButton.click();
  await page.locator(".history-summary").first().click();

  await expect(page.getByText("No differences")).toBeVisible();
  await expect(page.getByText("This snapshot matches the current document.")).toBeVisible();
});

test("desktop drafts can open history before saving a local file", async ({ page }) => {
  await page.goto("/app");

  await page.locator(".cm-content").first().click();
  await page.keyboard.press("Control+A");
  await page.keyboard.insertText("# Unsaved desktop draft\n\nThis edit should create a draft snapshot.");

  await page.getByRole("button", { name: "History" }).first().click();

  const historyDialog = page.getByRole("dialog", { name: "History" });
  await expect(historyDialog).toBeVisible();
  await expect(page.locator(".history-item").first()).toBeVisible();

  await page.locator(".history-summary").first().click();
  await expect(page.getByLabel("Snapshot diff preview")).toBeVisible();
  await expect(page.getByText("Restore preview")).toBeVisible();
});

test("outline navigation syncs the editor and rendered preview", async ({ page }) => {
  await page.goto("/web?utm_source=demo_frame&utm_medium=cta&demo=complex");

  const structureMap = page.getByLabel("Document structure map");
  await expect(structureMap).toBeVisible();
  await expect(structureMap).toContainText("8");
  await expect(structureMap).toContainText("H1");
  await expect(structureMap).toContainText("H2");
  await expect(structureMap).toContainText("H3");

  await page.getByRole("button", { name: "Mathematical Notes" }).evaluate((el) => {
    (el as HTMLButtonElement).click();
  });

  await expect(page.locator(".cm-activeLine")).toContainText("## Mathematical Notes");
  await expect(page.locator(".markdown-body #mathematical-notes")).toBeVisible();
  await expect(page.getByRole("button", { name: "H2 Mathematical Notes" })).toHaveAttribute(
    "aria-current",
    "location",
  );
});

test("outline navigation returns the editor to the first heading", async ({ page }) => {
  await page.goto("/web?utm_source=demo_frame&utm_medium=cta&demo=complex");

  await page.getByRole("button", { name: "Preview" }).click();
  await page.getByRole("button", { name: "Writing Workflow" }).evaluate((el) => {
    (el as HTMLButtonElement).click();
  });
  await expect(page.locator(".cm-activeLine")).toContainText("## Writing Workflow");

  await page.getByRole("button", { name: "Project Notes: Lightweight Writing Stack" }).evaluate((el) => {
    (el as HTMLButtonElement).click();
  });

  await expect(page.locator(".cm-activeLine")).toContainText("# Project Notes: Lightweight Writing Stack");
  await expect
    .poll(() => page.locator(".cm-scroller").first().evaluate((element) => Math.round(element.scrollTop)))
    .toBeLessThanOrEqual(32);
  await expect(page.locator(".markdown-body #project-notes-lightweight-writing-stack")).toBeVisible();
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const preview = document.querySelector(".markdown-body");
        const target = document.querySelector("#project-notes-lightweight-writing-stack");
        if (!preview || !target) return Number.NaN;
        return Math.round(
          target.getBoundingClientRect().top - preview.getBoundingClientRect().top,
        );
      }),
    )
    .toBeLessThanOrEqual(2);
});

test("complex Markdown demo renders math and tabbed code previews", async ({ page }) => {
  await page.goto("/web?utm_source=demo_frame&utm_medium=cta&demo=complex");

  await expect(page.locator(".markdown-body .katex").first()).toBeVisible();
  await expect(page.locator(".markdown-body .mermaid-rendered svg").first()).toBeVisible();
  await expect(page.locator(".markdown-body .mermaid-rendered svg").nth(1)).toBeVisible();
  await expect(page.locator(".markdown-body .code-tabset").first()).toBeVisible();
  await expect(page.locator(".markdown-body .code-tabset-tabs label").nth(0)).toHaveText("python");
  await expect(page.locator(".markdown-body .code-tabset-tabs label").nth(1)).toHaveText("bash");
  await expect(page.locator(".markdown-body .code-tabset-tabs label").nth(2)).toHaveText("java");
  await expect(page.locator(".markdown-body .code-tabset-tabs label").nth(3)).toHaveText("javascript");
});

test("dark mode keeps preview code blocks readable", async ({ page }) => {
  await page.goto("/web?utm_source=demo_frame&utm_medium=cta&demo=complex");

  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("tab", { name: "Reading" }).click();
  await page.getByRole("button", { name: "dark" }).click();
  await page.getByRole("button", { name: "Close settings" }).click();

  await expect(page.locator(".app-shell")).toHaveClass(/theme-dark/);
  const codeBlock = page.locator(".markdown-body pre").first();
  await expect(codeBlock).toBeVisible();

  const styles = await codeBlock.evaluate((element) => {
    const block = window.getComputedStyle(element);
    const code = element.querySelector("code") ?? element;
    const token = element.querySelector(".hljs-keyword, .hljs-string, .hljs-title");
    return {
      background: block.backgroundColor,
      text: window.getComputedStyle(code).color,
      token: token ? window.getComputedStyle(token).color : "",
    };
  });

  expect(styles.background).toBe("rgb(17, 22, 17)");
  expect(styles.text).toBe("rgb(237, 242, 235)");
  expect(styles.token).not.toBe(styles.text);
});

test("interactive demo code tabs change displayed language without layout jumps", async ({ page }) => {
  await page.goto("/demo");

  const codeDemo = page.getByLabel("Language tab demo");
  await expect(codeDemo).toBeVisible();

  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.getByRole("tab", { name: "Python" }).evaluate((el) => (el as HTMLButtonElement).click());
  await expect(page.locator(".code-card-meta")).toContainText("Python");
  await page.getByRole("tab", { name: "Bash" }).evaluate((el) => (el as HTMLButtonElement).click());
  await expect(page.locator(".code-card-meta")).toContainText("Bash");
  await page.getByRole("tab", { name: "Java", exact: true }).evaluate((el) => (el as HTMLButtonElement).click());
  await expect(page.locator(".code-card-meta")).toContainText("Java");

  const scrollAfter = await page.evaluate(() => window.scrollY);
  expect(Math.abs(scrollAfter - scrollBefore)).toBeLessThan(8);
});

test("download page presents user-facing preview information", async ({ page }) => {
  await page.goto("/download");

  await expect(page.getByRole("heading", { name: "Download VeloWrite" })).toBeVisible();
  await expect(page.getByLabel("Latest release information")).toContainText("v0.2.9");
  await expect(page.getByLabel("Latest release information")).toContainText("August 23, 2026");
  await expect(page.getByLabel("Latest improvements")).toContainText(
    "Browser tabs now recover after refresh",
  );
  await expect(page.getByLabel("Latest improvements").getByRole("link", { name: "See changelog details" })).toHaveAttribute(
    "href",
    "/changelog?utm_source=download_page&utm_medium=resource#v029",
  );
  await expect(page.getByRole("heading", { name: "macOS Apple Silicon", exact: true })).toBeVisible();
  await expect(
    page.locator(".download-card", { hasText: "macOS Apple Silicon" }).getByRole("link", {
      name: "Download",
    }),
  ).toHaveAttribute(
    "href",
    /VeloWrite_0\.2\.9_aarch64\.dmg/,
  );
  await expect(page.getByRole("heading", { name: "Included now" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Still preview" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Planned Pro path" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What we check before publishing a desktop preview." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Windows 11", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "macOS Apple Silicon preview", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Linux", exact: true })).toBeVisible();
  await expect(page.getByText("Open, save, close, and reopen Markdown files")).toHaveCount(0);
  await expect(page.getByText("Open a .md file through Open with -> VeloWrite.")).toBeVisible();
  await expect(page.getByText("official GitHub Releases page")).toBeVisible();
  await expect(page.getByText("Windows builds are not code-signed yet")).toBeVisible();
  await expect(page.getByText("Free preview keeps the latest 3 local history snapshots")).toBeVisible();
  await expect(page.getByRole("link", { name: "Download PDF Guide" })).toHaveAttribute(
    "href",
    "/markdown-guide.pdf",
  );
  await expect(page.getByText("Current installer assets")).toHaveCount(0);
  await expect(page.getByText("GitHub Actions")).toHaveCount(0);
});

test("download page keeps buttons visually separated from explanatory text", async ({ page }) => {
  await page.goto("/download");

  const downloadButtonGaps = await page.locator(".download-card").evaluateAll((cards) =>
    cards.map((card) => {
      const detail = card.querySelector(".download-detail");
      const action = card.querySelector(".download-action");
      if (!detail || !action) {
        return 99;
      }
      return action.getBoundingClientRect().top - detail.getBoundingClientRect().bottom;
    }),
  );

  expect(Math.min(...downloadButtonGaps)).toBeGreaterThanOrEqual(14);

  const sectionButtonGaps = await page.locator(".download-notes .feedback-actions").evaluateAll((actionGroups) =>
    actionGroups.map((group) => {
      const previous = group.previousElementSibling;
      if (!previous) {
        return 99;
      }
      return group.getBoundingClientRect().top - previous.getBoundingClientRect().bottom;
    }),
  );

  expect(Math.min(...sectionButtonGaps)).toBeGreaterThanOrEqual(16);

  await page.setViewportSize({ width: 390, height: 900 });
  await page.reload();

  const mobileActionGaps = await page.locator(".download-notes .feedback-actions").evaluateAll((actionGroups) =>
    actionGroups.map((group) => {
      const previous = group.previousElementSibling;
      if (!previous) {
        return 99;
      }
      return group.getBoundingClientRect().top - previous.getBoundingClientRect().bottom;
    }),
  );

  expect(Math.min(...mobileActionGaps)).toBeGreaterThanOrEqual(16);
});

test("docs publishes the Markdown code blocks article with tabbed examples", async ({ page }) => {
  await page.goto("/docs");

  await expect(page.getByRole("link", { name: "Markdown Code Blocks and Tabs" })).toBeVisible();
  await expect(page.locator("article", { hasText: "Markdown Code Blocks and Tabs" })).toContainText("Published");

  await page.goto("/docs/markdown-code-blocks");
  await expect(page.getByRole("heading", { name: "Markdown Code Blocks and Tabs" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Tabbed examples" })).toHaveAttribute(
    "href",
    "#tabbed-examples",
  );
  await expect(page.locator(".markdown-body .code-tabset")).toHaveCount(1);
  await expect(page.locator(".markdown-body .code-tabset").first()).toBeVisible();
  await expect(page.locator(".markdown-body .code-tabset-panel").first()).toBeVisible();
  await expect(page.locator(".markdown-body .code-tabset-tabs label").nth(0)).toHaveText("python");
  await expect(page.locator(".markdown-body .code-tabset-tabs label").nth(1)).toHaveText("bash");
  await expect(page.locator(".markdown-body .code-tabset-tabs label").nth(2)).toHaveText("javascript");
  await expect(page.locator(".markdown-body .code-tabset-tabs label").nth(3)).toHaveText("java");
});

test("docs publishes the top-level Markdown introduction", async ({ page }) => {
  await page.goto("/docs");

  await expect(page.getByRole("link", { name: "What Is Markdown?" })).toBeVisible();
  await expect(page.locator("article", { hasText: "What Is Markdown?" })).toContainText("Published");

  await page.goto("/docs/markdown");
  await expect(page.getByRole("heading", { name: "What Is Markdown?" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Markdown vs rich text" })).toHaveAttribute(
    "href",
    "#markdown-vs-rich-text",
  );
  await expect(page.getByRole("link", { name: "Start writing" })).toHaveAttribute(
    "href",
    "#start-writing",
  );
  await expect(page.locator(".markdown-body table").first()).toBeVisible();
  await expect(page.locator(".markdown-body pre code").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Open Web Editor" })).toHaveAttribute("href", /\/web/);
});

test("docs publishes today's meeting notes template", async ({ page }) => {
  await page.goto("/docs");

  await expect(page.getByRole("link", { name: "Markdown Meeting Notes Template" })).toBeVisible();
  await expect(page.locator("article", { hasText: "Markdown Meeting Notes Template" })).toContainText(
    "Published",
  );

  await page.goto("/docs/markdown-meeting-notes");
  await expect(page.getByRole("heading", { name: "Markdown meeting notes template" })).toBeVisible();
  await expect(page.getByRole("link", { name: "The basic template" })).toHaveAttribute(
    "href",
    "#the-basic-template",
  );
  await expect(page.getByText("Reusable meeting notes", { exact: true })).toBeVisible();
  await expect(page.locator(".markdown-body").first()).toContainText("Project check-in");

  const checklist = page.locator(".content-example").filter({ hasText: "A short review checklist" });
  await expect(checklist.locator(".content-example-preview li")).toHaveCount(6);
  await expect(checklist.locator(".content-example-preview")).toContainText(
    "[ ] The title and date are correct",
  );
});

test("docs article shows side and bottom share links with canonical URLs", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto("/docs/markdown?utm_source=e2e&utm_medium=share");

  const sideShare = page.getByRole("navigation", { name: "Share article links" });
  const bottomShare = page.getByRole("navigation", { name: "Share", exact: true });
  await expect(sideShare).toBeVisible();
  await expect(bottomShare).toBeVisible();

  await expect(sideShare.getByLabel("Share on X")).toHaveAttribute(
    "href",
    /https%3A%2F%2Fvelowrite\.app%2Fdocs%2Fmarkdown/,
  );
  await expect(bottomShare.getByLabel("Share on LinkedIn")).toHaveAttribute(
    "href",
    /https%3A%2F%2Fvelowrite\.app%2Fdocs%2Fmarkdown/,
  );
  await expect(page.getByRole("button", { name: /Share article|Link copied/ })).toHaveCount(0);
});

test("docs side share buttons only appear when they have enough breathing room", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/docs/markdown-history");
  await expect(page.locator(".article-share-side")).toBeHidden();

  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto("/docs/markdown-history");
  await expect(page.locator(".article-share-side")).toBeVisible();

  const gap = await page.evaluate(() => {
    const article = document.querySelector(".content-article");
    const share = document.querySelector(".article-share-side");
    if (!article || !share) return 0;
    return share.getBoundingClientRect().left - article.getBoundingClientRect().right;
  });

  expect(gap).toBeGreaterThanOrEqual(28);
});

test("docs publishes the local-first Markdown article and sync guidance", async ({ page }) => {
  await page.goto("/docs");

  await expect(page.getByRole("link", { name: "Local-First Markdown Editing" })).toBeVisible();
  await expect(page.locator("article", { hasText: "Local-First Markdown Editing" })).toContainText(
    "Published",
  );

  await page.goto("/docs/local-first-markdown");
  await expect(page.getByRole("heading", { name: "Local-First Markdown Editing" })).toBeVisible();
  await expect(page.getByRole("link", { name: "History recovery" })).toHaveAttribute(
    "href",
    "#history-recovery",
  );
  await expect(page.getByRole("link", { name: "Sync design" })).toHaveAttribute(
    "href",
    "#sync-design",
  );
  await expect(page.getByRole("heading", { name: "Sync should preserve folder ownership" })).toBeVisible();
  await expect(page.getByText("VeloWrite keeps basic local history in the free preview")).toBeVisible();
  await expect(page.getByText("Many users already have a sync habit")).toBeVisible();
});

test("documentation examples do not turn filenames into links", async ({ page }) => {
  await page.goto("/docs");
  await page.waitForTimeout(200);

  const routes = await page.locator('a[href^="/docs/"]').evaluateAll((links) => [
    ...new Set(
      links
        .map((link) => link.getAttribute("href"))
        .filter((href): href is string => Boolean(href))
        .map((href) => href.split("?")[0]),
    ),
  ]);

  for (const route of routes) {
    await page.goto(route);
    const filenameLinks = await page.locator(".content-example-preview a").evaluateAll((links) =>
      links
        .map((link) => link.getAttribute("href") ?? "")
        .filter((href) => /\.md(?:$|[?#])/i.test(href)),
    );
    expect(filenameLinks, `${route} should keep Markdown filenames as text`).toEqual([]);
  }
});

test("docs publishes the Future of Markdown article with export readiness guidance", async ({ page }) => {
  await page.goto("/docs");

  await expect(page.getByRole("link", { name: "The Future of Markdown Writing" })).toBeVisible();
  await expect(page.locator("article", { hasText: "The Future of Markdown Writing" })).toContainText(
    "Published",
  );

  await page.goto("/docs/future-of-markdown");
  await expect(page.getByRole("heading", { name: "The Future of Markdown Writing" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Export readiness" })).toHaveAttribute(
    "href",
    "#export-readiness",
  );
  await expect(page.getByRole("heading", { name: "Editors will explain whether a draft is ready to export" })).toBeVisible();
  await expect(page.locator(".content-example").first()).toContainText("A source file you can reopen");
  await expect(page.getByText("dedicated PDF export")).toBeVisible();
});

test("docs publishes comparison and Windows installer guidance", async ({ page }) => {
  await page.goto("/docs");

  await expect(page.getByRole("link", { name: "Typora Alternative" })).toBeVisible();
  await expect(page.locator("article", { hasText: "Typora Alternative" })).toContainText("Published");
  await expect(page.getByRole("link", { name: "Markdown Editor for Windows" })).toBeVisible();
  await expect(page.locator("article", { hasText: "Markdown Editor for Windows" })).toContainText("Published");
  await expect(page.getByRole("link", { name: "Markdown Editor for Mac" })).toBeVisible();
  await expect(page.locator("article", { hasText: "Markdown Editor for Mac" })).toContainText("Published");

  await page.goto("/docs/typora-alternative");
  await expect(page.getByRole("heading", { name: "Typora Alternative", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Decision guide" })).toHaveAttribute("href", "#decision-guide");
  await expect(page.getByRole("heading", { name: "A practical decision guide" })).toBeVisible();
  await expect(page.locator(".markdown-body table").first()).toBeVisible();

  await page.goto("/docs/markdown-editor-for-windows");
  await expect(page.getByRole("heading", { name: "Markdown Editor for Windows" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open with" })).toHaveAttribute("href", "#open-with");
  await expect(page.getByRole("heading", { name: "If VeloWrite does not appear in Open with" })).toBeVisible();
  await expect(page.getByText("old VeloMD shortcuts")).toBeVisible();

  await page.goto("/docs/markdown-editor-for-mac");
  await expect(page.getByRole("heading", { name: "Markdown Editor for Mac" })).toBeVisible();
  await expect(page.getByRole("link", { name: "DMG status" })).toHaveAttribute("href", "#dmg-status");
  await expect(page.getByRole("heading", { name: "Version visibility matters on desktop" })).toBeVisible();
  await expect(page.getByText(/Automatic update installation will require a signed update channel/)).toBeVisible();
});

test("docs publishes the Linux Markdown editor guide", async ({ page }) => {
  await page.goto("/docs");

  await expect(page.locator("article", { hasText: "Markdown Editor for Linux" })).toContainText(
    "Published",
  );

  await page.goto("/docs/markdown-editor-for-linux");
  await expect(page.getByRole("heading", { name: "Markdown Editor for Linux" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Package choices" })).toHaveAttribute(
    "href",
    "#package-choices",
  );
  await expect(page.getByRole("heading", { name: "Choose the package that fits your system" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "AppImage" })).toBeVisible();
  await expect(page.locator(".markdown-body pre code").first()).toContainText("VeloWrite_0.2.8");
});

test("docs examples can open their Markdown directly in the web editor", async ({ page }) => {
  await page.goto("/docs/typora-alternative");

  await page.getByRole("button", { name: "Try this in VeloWrite" }).first().click();

  await expect(page).toHaveURL(/\/web\?utm_source=docs_example&utm_medium=cta&example=docs/);
  await expect(page.locator(".cm-content").first()).toContainText("Editor Trial Note");
  await expect(page.getByLabel("Rendered preview")).toContainText("Use the editor only if the file still feels like yours.");
});

test("docs publishes the Markdown math article with rendered KaTeX examples", async ({ page }) => {
  await page.goto("/docs");

  await expect(page.getByRole("link", { name: "Markdown Math with KaTeX" })).toBeVisible();
  await expect(page.locator("article", { hasText: "Markdown Math with KaTeX" })).toContainText(
    "Published",
  );

  await page.goto("/docs/markdown-math");
  await expect(page.getByRole("heading", { name: "Markdown Math with KaTeX" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Inline math" })).toHaveAttribute(
    "href",
    "#inline-math",
  );
  await expect(page.getByRole("link", { name: "Preview workflow" })).toHaveAttribute(
    "href",
    "#preview-workflow",
  );
  await expect(page.locator(".markdown-body .katex").first()).toBeVisible();
  await expect(page.locator(".markdown-body table").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Try Math Preview" })).toHaveAttribute(
    "href",
    /\/web/,
  );
});

test("docs publishes advanced Markdown guidance with practical rendered examples", async ({ page }) => {
  await page.goto("/docs");

  await expect(page.getByRole("link", { name: "Advanced Markdown" })).toBeVisible();
  await expect(page.locator("article", { hasText: "Advanced Markdown" })).toContainText("Published");

  await page.goto("/docs/advanced-markdown");
  await expect(
    page.getByRole("heading", { name: "Advanced Markdown for Maintainable Documents" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Reference links" })).toHaveAttribute(
    "href",
    "#reference-links",
  );
  await expect(page.getByRole("link", { name: "Document contracts" })).toHaveAttribute(
    "href",
    "#document-contracts",
  );
  await expect(page.getByRole("link", { name: "release checklist" }).first()).toHaveAttribute(
    "href",
    "https://example.com/release-checklist",
  );
  await expect(
    page.locator(".markdown-body p").filter({ hasText: "VeloWrite keeps the source file local by default." }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Decision: Store documents as local Markdown" })).toBeVisible();
});

test("docs publishes the preview release policy article", async ({ page }) => {
  await page.goto("/docs/preview-release-policy");

  await expect(page.getByRole("heading", { name: "How VeloWrite Preview Releases Work" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What counts as a VeloWrite preview release?" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "How do I check whether I have the newest app?" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "A quick checklist before downloading" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Check Downloads" })).toHaveAttribute(
    "href",
    "/download?utm_source=release_policy_cta&utm_medium=cta",
  );
  await expect(page.getByRole("link", { name: "Read Changelog" })).toHaveAttribute(
    "href",
    "/changelog?utm_source=release_policy_cta&utm_medium=resource",
  );
});

test("docs publishes download safety guidance for unsigned preview builds", async ({ page }) => {
  await page.goto("/docs");

  await expect(page.getByRole("link", { name: "Download Safety" })).toBeVisible();
  await expect(page.locator("article", { hasText: "Download Safety" })).toContainText("Published");

  await page.goto("/docs/download-safety");
  await expect(page.getByRole("heading", { name: "Download Safety for VeloWrite Preview Builds" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Download only from the official page or GitHub Releases" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Unsigned installer warnings are expected for now" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open Downloads" })).toHaveAttribute(
    "href",
    "/download?utm_source=download_safety_cta&utm_medium=cta",
  );
});

test("docs publishes the Markdown to Blog workflow", async ({ page }) => {
  await page.goto("/docs");

  await expect(page.getByRole("link", { name: "Markdown to Blog" })).toBeVisible();
  await expect(page.locator("article", { hasText: "Markdown to Blog" })).toContainText("Published");

  await page.goto("/docs/markdown-to-blog");
  await expect(page.getByRole("heading", { name: "Markdown to Blog" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Choose an output" })).toHaveAttribute(
    "href",
    "#choose-an-output",
  );
  await expect(page.getByRole("heading", { name: "Choose the output that fits the next step" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Export PDF" })).toBeVisible();
  await expect(page.locator(".markdown-body table").first()).toBeVisible();
});

test("feedback form submits through the public API contract", async ({ page }) => {
  await page.route("**/api/feedback", async (route) => {
    const body = JSON.parse(route.request().postData() || "{}");
    expect(body.email).toBe("tester@example.com");
    expect(body.product).toBe("velowrite");
    expect(body.source).toBe("feedback");
    expect(body.userGroup).toBe("feedback");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto("/feedback");
  await page.getByRole("textbox", { name: "Email" }).fill("tester@example.com");
  await page.getByLabel("Main use case").fill("Technical notes");
  await page.getByLabel("What felt rough?").fill("Need clearer save flow");
  await page.getByLabel("Your feedback").fill("The web preview feels useful. I want stronger desktop history.");
  await page.getByRole("button", { name: "Send feedback" }).click();

  await expect(page.getByText("Thanks. Your feedback was sent.")).toBeVisible();
});
