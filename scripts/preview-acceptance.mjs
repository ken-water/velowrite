import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { chromium } from "playwright";
import packageJson from "../package.json" with { type: "json" };

const execFileAsync = promisify(execFile);
const version = packageJson.version;
const baseUrl = "http://127.0.0.1:1420";
const releaseApiUrl = `https://api.github.com/repos/ken-water/velowrite/releases/tags/v${version}`;
const expectedAssets = [
  `VeloWrite_${version}_x64-setup.exe`,
  `VeloWrite_${version}_aarch64.dmg`,
  `VeloWrite_${version}_amd64.AppImage`,
  `VeloWrite_${version}_amd64.deb`,
  `VeloWrite-${version}-1.x86_64.rpm`,
];

function log(message) {
  console.log(`acceptance: ${message}`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function waitForServer(url, timeoutMs = 30000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const request = http.get(url, (response) => {
          response.resume();
          response.statusCode && response.statusCode < 500
            ? resolve()
            : reject(new Error(`HTTP ${response.statusCode}`));
        });
        request.on("error", reject);
        request.setTimeout(1200, () => {
          request.destroy(new Error("timeout"));
        });
      });
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function checkReleaseAssets() {
  const response = await fetch(releaseApiUrl, {
    headers: { Accept: "application/vnd.github+json" },
  });
  assert(response.ok, `Could not read GitHub release v${version}: ${response.status}`);
  const release = await response.json();
  const assetNames = new Set((release.assets ?? []).map((asset) => asset.name));

  for (const assetName of expectedAssets) {
    assert(assetNames.has(assetName), `Missing release asset: ${assetName}`);
  }

  log(`GitHub release v${version} has all platform assets`);
}

function checkLocalAssets() {
  const optionalAssets = [
    `/tmp/VeloWrite_${version}_x64-setup.exe`,
    `/tmp/VeloWrite_${version}_amd64.AppImage`,
    `/tmp/VeloWrite_${version}_amd64.deb`,
    `/tmp/VeloWrite-${version}-1.x86_64.rpm`,
  ];
  const missing = optionalAssets.filter((filePath) => !fs.existsSync(filePath));
  if (missing.length) {
    log(`local /tmp assets not all present, skipped: ${missing.map((filePath) => path.basename(filePath)).join(", ")}`);
    return;
  }

  log("local /tmp Windows and Linux assets are present");
}

async function checkDesktopShell(page) {
  await page.goto(`${baseUrl}/app`, { waitUntil: "networkidle" });
  const shellClass = await page.locator(".app-shell").first().getAttribute("class");
  assert(shellClass?.includes("desktop-surface"), "Desktop shell class is missing");
  assert(shellClass?.includes("desktop-focus"), "Desktop shell should open in focused editing mode");
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("tab", { name: "Reading" }).click();
  await page.getByRole("button", { name: "paper", exact: true }).click();
  await page.getByRole("button", { name: "serif", exact: true }).click();
  await page.reload({ waitUntil: "networkidle" });
  const persisted = await page.evaluate(() => ({
    palette: localStorage.getItem("velowrite:reading-palette"),
    font: localStorage.getItem("velowrite:reading-font"),
    fontFamily: getComputedStyle(document.querySelector(".markdown-body")).fontFamily,
  }));
  assert(persisted.palette === "paper", "Reading palette did not persist");
  assert(persisted.font === "serif", "Reading font did not persist");
  assert(persisted.fontFamily.includes("Georgia"), "Serif preview font was not applied");
  log("desktop shell and reading preferences passed");
}

async function checkBidirectionalScroll(page) {
  const longMarkdown = Array.from(
    { length: 44 },
    (_, index) =>
      `## Section ${index + 1}\n\nThis paragraph is long enough to make both panes scroll while keeping the source readable.\n`,
  ).join("\n");

  await page.goto(`${baseUrl}/web?utm_source=acceptance&utm_medium=scroll`, {
    waitUntil: "networkidle",
  });
  await page.evaluate((markdown) => {
    localStorage.clear();
    localStorage.setItem("velowrite:draft", markdown);
    localStorage.setItem("velowrite:draft-name", "acceptance-scroll.md");
    localStorage.setItem("velowrite:analytics-consent", "declined");
  }, longMarkdown);
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Split", exact: true }).click();

  const editorScroller = page.locator(".cm-scroller").first();
  const preview = page.locator(".markdown-body").first();
  await preview.evaluate((element) => {
    element.scrollTop = element.scrollHeight * 0.55;
    element.dispatchEvent(new Event("scroll", { bubbles: true }));
  });
  const editorTop = await editorScroller.evaluate((element) => Math.round(element.scrollTop));
  assert(editorTop > 0, "Preview-to-editor scroll sync failed");

  await editorScroller.evaluate((element) => {
    element.scrollTop = element.scrollHeight * 0.25;
    element.dispatchEvent(new Event("scroll", { bubbles: true }));
  });
  const previewTop = await preview.evaluate((element) => Math.round(element.scrollTop));
  assert(previewTop > 0, "Editor-to-preview scroll sync failed");
  log("bidirectional split scrolling passed");
}

async function checkPdfExport(page) {
  const pdfPath = path.join(os.tmpdir(), `velowrite-acceptance-${version}.pdf`);
  await page.goto(`${baseUrl}/web?utm_source=acceptance&utm_medium=pdf`, {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem(
      "velowrite:draft",
      "# PDF Acceptance\n\n1. First numbered item.\n\n2. Second numbered item.\n\n3. Third numbered item.\n",
    );
    localStorage.setItem("velowrite:draft-name", "pdf-acceptance.md");
    localStorage.setItem("velowrite:analytics-consent", "declined");
  });
  await page.reload({ waitUntil: "networkidle" });
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByLabel("Output actions")
    .getByRole("button", { name: "Export PDF file", exact: true })
    .click();
  const download = await downloadPromise;
  await download.saveAs(pdfPath);

  const header = fs.readFileSync(pdfPath).subarray(0, 5).toString("latin1");
  assert(header === "%PDF-", "Downloaded PDF does not start with a PDF header");

  try {
    const { stdout } = await execFileAsync("pdftotext", ["-layout", pdfPath, "-"]);
    assert(stdout.includes("1. First numbered item."), "PDF text is missing item 1");
    assert(stdout.includes("2. Second numbered item."), "PDF text is missing item 2");
    assert(stdout.includes("3. Third numbered item."), "PDF text is missing item 3");
    assert(!stdout.includes("tauri.localhost"), "PDF contains WebView host text");
  } catch (error) {
    throw new Error(`PDF text verification failed: ${error.message}`);
  }

  log("PDF export numbering passed");
}

async function checkResponsiveOverflow(page) {
  const routes = ["/", "/download", "/docs/markdown-editor-for-linux", "/web?utm_source=acceptance"];
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 1000 },
  ]) {
    await page.setViewportSize(viewport);
    for (const route of routes) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      assert(overflow <= 1, `${route} overflows by ${overflow}px at ${viewport.width}px`);
    }
  }

  log("responsive overflow checks passed");
}

async function main() {
  await checkReleaseAssets();
  checkLocalAssets();

  const server = spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1"], {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, BROWSER: "none" },
    detached: process.platform !== "win32",
  });
  server.stdout.on("data", (chunk) => process.stdout.write(chunk));
  server.stderr.on("data", (chunk) => process.stderr.write(chunk));

  try {
    await waitForServer(baseUrl);
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await checkDesktopShell(page);
    await checkBidirectionalScroll(page);
    await checkPdfExport(page);
    await checkResponsiveOverflow(page);
    await browser.close();
  } finally {
    if (process.platform === "win32") {
      server.kill("SIGTERM");
    } else {
      try {
        process.kill(-server.pid, "SIGTERM");
      } catch {
        server.kill("SIGTERM");
      }
    }
  }

  log("preview acceptance passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
