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
  expect(downloadHtml).toContain('"softwareVersion": "0.1.12"');

  const articleHtml = fs.readFileSync(
    path.join(process.cwd(), "dist/docs/online-markdown-editor/index.html"),
    "utf8",
  );

  expect(articleHtml).toContain("<title>Online Markdown Editor - Write, Preview, and Download Markdown</title>");
  expect(articleHtml).toContain(
    '<link rel="canonical" href="https://velowrite.app/docs/online-markdown-editor" />',
  );
  expect(articleHtml).toContain('"@type": "Article"');
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
    page.getByRole("heading", { name: "Online Markdown editor, desktop when it matters." }),
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

test("web editor brand link returns to the homepage", async ({ page }) => {
  await page.goto("/web?utm_source=e2e&utm_medium=brand");

  await page.getByRole("link", { name: /VeloWrite/ }).first().click();
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("heading", { name: "Online Markdown editor, desktop when it matters." }),
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
  await page.getByRole("button", { name: "Download Markdown copy" }).click();
  await download;

  await expect(page.getByLabel("Desktop upgrade prompt")).toBeVisible();
  await expect(page.getByText("Need native local files?")).toBeVisible();
  await expect(page.getByRole("link", { name: /Download Desktop/i })).toHaveAttribute(
    "href",
    /\/download/,
  );
});

test("desktop shell opens in focused editing mode", async ({ page }) => {
  await page.goto("/app");

  await expect(page.getByLabel("VeloWrite editor")).toHaveClass(/desktop-focus/);
  await expect(page.locator(".sidebar")).toBeHidden();
  await expect(page.getByLabel("Markdown editor")).toBeVisible();
  await expect(page.getByLabel("Desktop start")).toBeVisible();
  await expect(page.getByText("Continue writing")).toBeVisible();
  await expect(page.getByRole("button", { name: /Continue Draft/i })).toBeVisible();
  await expect(page.getByText("Unsaved local draft")).toBeVisible();
  await expect(page.getByText(/0 \/ 3 draft snapshots/)).toBeVisible();

  await page.getByRole("button", { name: "Show workspace" }).click();
  await expect(page.getByLabel("VeloWrite editor")).not.toHaveClass(/desktop-focus/);
  await expect(page.locator(".sidebar")).toBeVisible();
});

test("desktop about panel shows the installed app version", async ({ page }) => {
  await page.goto("/app");

  await page.getByRole("button", { name: "Show workspace" }).click();
  await page.getByRole("button", { name: "About" }).click();

  const aboutDialog = page.getByRole("dialog", { name: "VeloWrite" });
  await expect(aboutDialog).toBeVisible();
  await expect(aboutDialog).toContainText("Version");
  await expect(aboutDialog).toContainText("0.1.12");
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

  const saveButton = page.getByRole("button", { name: "Save file" });
  await saveButton.hover();

  await expect
    .poll(async () =>
      saveButton.evaluate((element) => window.getComputedStyle(element, "::after").opacity),
    )
    .toBe("1");
  const tooltipContent = await saveButton.evaluate((element) =>
    window.getComputedStyle(element, "::after").content,
  );
  expect(tooltipContent).toContain("Save file");
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

  await page.getByRole("button", { name: "Mathematical Notes" }).evaluate((el) => {
    (el as HTMLButtonElement).click();
  });

  await expect(page.locator(".cm-activeLine")).toContainText("## Mathematical Notes");
  await expect(page.locator(".markdown-body #mathematical-notes")).toBeVisible();
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
  await expect(page.getByRole("heading", { name: "macOS Apple Silicon" })).toBeVisible();
  await expect(
    page.locator(".download-card", { hasText: "macOS Apple Silicon" }).getByRole("link", {
      name: "Download",
    }),
  ).toHaveAttribute(
    "href",
    /VeloWrite_0\.1\.12_aarch64\.dmg/,
  );
  await expect(page.getByRole("heading", { name: "Works Today" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Preview Limits" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Planned Pro Path" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Install Safety Notes" })).toBeVisible();
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
