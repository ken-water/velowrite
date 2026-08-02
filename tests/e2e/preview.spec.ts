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
  expect(downloadHtml).toContain('"softwareVersion": "0.2.3"');

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
  expect(markdownHtml).toContain('"dateModified": "2026-08-01"');

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
    page.getByRole("heading", { name: "Markdown that stays yours." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Open Web Editor/i }).first()).toHaveAttribute(
    "href",
    /\/web/,
  );
  await expect(page.getByRole("link", { name: /Download Desktop/i }).first()).toHaveAttribute(
    "href",
    /\/download/,
  );
  await expect(page.getByRole("heading", { name: /Web for a quick draft/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /A preview build should still be clear/i })).toBeVisible();
  await expect(page.getByText("Private by default")).toBeVisible();
  await expect(page.getByLabel("VeloWrite product video")).toBeVisible();
  await expect(page.locator(".product-frame .editor-grid")).toHaveClass(/mode-preview/);
});

test("roadmap shows recommended next priorities", async ({ page }) => {
  await page.goto("/roadmap");

  await expect(page.getByRole("heading", { name: "What we are building next." })).toBeVisible();
  await expect(page.getByText("Recommended next")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "See what has shipped, what is active, and what may become Pro later." }),
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
  await expect(page.getByRole("heading", { name: "Native-feeling desktop preview" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Long-document recovery clarity" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Export readiness before Pro export" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "What should be true before Pro work becomes the main focus." }),
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

test("web editor brand link returns to the homepage", async ({ page }) => {
  await page.goto("/web?utm_source=e2e&utm_medium=brand");

  await page.getByRole("link", { name: /VeloWrite/ }).first().click();
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("heading", { name: "Markdown that stays yours." }),
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
    "/docs/markdown-math",
    "/docs/local-first-markdown",
    "/docs/markdown-to-blog",
    "/docs/typora-alternative",
    "/docs/markdown-editor-for-windows",
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

test("docs index publishes the Markdown history article", async ({ page }) => {
  await page.goto("/docs");

  const historyLink = page.getByRole("link", { name: "A Short History of Markdown" });
  await expect(historyLink).toHaveAttribute("href", "/docs/markdown-history");
  await expect(historyLink.locator("..")).toContainText("Published");

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

test("PDF table export preferences are kept for the dedicated PDF engine", async ({ page }) => {
  await page.addInitScript(() => {
    window.print = () => {
      window.localStorage.setItem("velowrite:e2e-print-called", "true");
    };
  });
  await page.goto("/web?utm_source=e2e&utm_medium=print-preferences");

  await page.getByRole("button", { name: "Settings" }).click();
  const settings = page.getByRole("dialog", { name: "Settings" });
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
    .poll(() => page.evaluate(() => window.localStorage.getItem("velowrite:table-export-style")))
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
  await expect(page.getByLabel("Export readiness")).toBeVisible();
  await expect(page.getByLabel("Export readiness")).toContainText("Ready baseline");
  await expect(page.getByLabel("Export readiness")).toContainText("Ready for a clean Markdown or HTML export.");
  await expect(page.getByLabel("Export readiness")).toContainText("H1 title");
  await expect(page.getByLabel("Export readiness")).toContainText("Code blocks");
  await expect(page.getByLabel("Export actions")).toContainText("MD");
  await expect(page.getByLabel("Export actions")).toContainText("HTML");
});

test("desktop about panel shows the installed app version", async ({ page }) => {
  await page.goto("/app");

  await page.getByRole("button", { name: "Show workspace" }).click();
  await page.getByRole("button", { name: "About" }).click();

  const aboutDialog = page.getByRole("dialog", { name: "VeloWrite" });
  await expect(aboutDialog).toBeVisible();
  await expect(aboutDialog).toContainText("Version");
  await expect(aboutDialog).toContainText("0.2.2");
});

test("desktop focus mode hides chrome and can be exited", async ({ page }) => {
  await page.goto("/app");

  await page.getByRole("button", { name: "Enter focus mode" }).click();
  await expect(page.getByLabel("VeloWrite editor")).toHaveClass(/writing-focus/);
  await expect(page.locator(".topbar")).toBeHidden();
  await expect(page.getByRole("button", { name: "Exit focus mode" })).toBeVisible();

  await page.getByRole("button", { name: "Exit focus mode" }).click();
  await expect(page.getByLabel("VeloWrite editor")).not.toHaveClass(/writing-focus/);
  await expect(page.locator(".topbar")).toBeVisible();
});

test("desktop toolbar shows immediate icon tooltips", async ({ page }) => {
  await page.goto("/app");

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

  await page.getByRole("button", { name: "Show workspace" }).click();
  const sidebarHtmlButton = page.getByLabel("Export actions").getByRole("button", {
    name: "Export HTML file",
  });
  await sidebarHtmlButton.hover();
  await expect
    .poll(async () =>
      sidebarHtmlButton.evaluate((element) => window.getComputedStyle(element, "::after").opacity),
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
  await expect(page.getByText("The current document already matches this snapshot.")).toBeVisible();
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
  await expect(page.locator(".cm-scroller").first()).toHaveJSProperty("scrollTop", 0);
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
  await expect(page.locator(".markdown-body .code-tabset").first()).toBeVisible();
  await expect(page.locator(".markdown-body .code-tabset-tabs label").nth(0)).toHaveText("python");
  await expect(page.locator(".markdown-body .code-tabset-tabs label").nth(1)).toHaveText("bash");
  await expect(page.locator(".markdown-body .code-tabset-tabs label").nth(2)).toHaveText("java");
  await expect(page.locator(".markdown-body .code-tabset-tabs label").nth(3)).toHaveText("javascript");
});

test("dark mode keeps preview code blocks readable", async ({ page }) => {
  await page.goto("/web?utm_source=demo_frame&utm_medium=cta&demo=complex");

  await page.getByRole("button", { name: "Settings" }).click();
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
  await expect(page.getByRole("heading", { name: "macOS Apple Silicon", exact: true })).toBeVisible();
  await expect(
    page.locator(".download-card", { hasText: "macOS Apple Silicon" }).getByRole("link", {
      name: "Download",
    }),
  ).toHaveAttribute(
    "href",
    /VeloWrite_0\.2\.3_aarch64\.dmg/,
  );
  await expect(page.getByRole("heading", { name: "Works Today" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Preview Limits" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Planned Pro Path" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Install Safety Notes" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What we verify before calling a desktop preview usable." })).toBeVisible();
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
  await expect(page.getByText("basic local history recovery in the free foundation")).toBeVisible();
  await expect(page.getByText("Many users already have a sync habit")).toBeVisible();
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
  await expect(page.locator(".content-example").first()).toContainText("A future-proof source file");
  await expect(page.getByText("dedicated PDF export")).toBeVisible();
});

test("docs publishes comparison and Windows installer guidance", async ({ page }) => {
  await page.goto("/docs");

  await expect(page.getByRole("link", { name: "Typora Alternative" })).toBeVisible();
  await expect(page.locator("article", { hasText: "Typora Alternative" })).toContainText("Published");
  await expect(page.getByRole("link", { name: "Markdown Editor for Windows" })).toBeVisible();
  await expect(page.locator("article", { hasText: "Markdown Editor for Windows" })).toContainText("Published");

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
