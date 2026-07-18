import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("velowrite:analytics-consent", "declined");
  });
});

test("landing page drives users to web editor and desktop download", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Online Markdown editor/i })).toBeVisible();
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
  await expect(page.getByRole("heading", { name: "Works Today" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Preview Limits" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Planned Pro Path" })).toBeVisible();
  await expect(page.getByText("Windows and macOS builds are not code-signed yet")).toBeVisible();
  await expect(page.getByText("Current installer assets")).toHaveCount(0);
  await expect(page.getByText("GitHub Actions")).toHaveCount(0);
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
