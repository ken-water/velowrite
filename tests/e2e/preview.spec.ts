import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("velowrite:analytics-consent", "declined");
  });
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
  await expect(page.getByLabel("VeloWrite product video")).toBeVisible();
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

  await brandLink.click();
  await expect(page).toHaveURL(/\/$/);
});

test("desktop shell opens in focused editing mode", async ({ page }) => {
  await page.goto("/app");

  await expect(page.getByLabel("VeloWrite editor")).toHaveClass(/desktop-focus/);
  await expect(page.locator(".sidebar")).toBeHidden();
  await expect(page.getByLabel("Markdown editor")).toBeVisible();

  await page.getByRole("button", { name: "Show workspace" }).click();
  await expect(page.getByLabel("VeloWrite editor")).not.toHaveClass(/desktop-focus/);
  await expect(page.locator(".sidebar")).toBeVisible();
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

test("outline navigation syncs the editor and rendered preview", async ({ page }) => {
  await page.goto("/web?utm_source=demo_frame&utm_medium=cta&demo=complex");

  await page.getByRole("button", { name: "Mathematical Notes" }).evaluate((el) => {
    (el as HTMLButtonElement).click();
  });

  await expect(page.locator(".cm-activeLine")).toContainText("## Mathematical Notes");
  await expect(page.locator(".markdown-body #mathematical-notes")).toBeVisible();
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
    /VeloWrite_0\.1\.8_aarch64\.dmg/,
  );
  await expect(page.getByRole("heading", { name: "Works Today" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Preview Limits" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Planned Pro Path" })).toBeVisible();
  await expect(page.getByText("Windows builds are not code-signed yet")).toBeVisible();
  await expect(page.getByRole("link", { name: "Download PDF Guide" })).toHaveAttribute(
    "href",
    "/markdown-guide.pdf",
  );
  await expect(page.getByText("Current installer assets")).toHaveCount(0);
  await expect(page.getByText("GitHub Actions")).toHaveCount(0);
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
