import fs from "node:fs";
import path from "node:path";
import packageJson from "../package.json" with { type: "json" };

const root = process.cwd();
const version = packageJson.version;
const distDir = path.join(root, "dist");
const sitemapPath = path.join(root, "public", "sitemap.xml");
const llmsPath = path.join(root, "public", "llms.txt");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(filePath) {
  assert(fs.existsSync(filePath), `Missing file: ${path.relative(root, filePath)}`);
  return fs.readFileSync(filePath, "utf8");
}

function routeToOutput(route) {
  return route === "/" ? path.join(distDir, "index.html") : path.join(distDir, route.slice(1), "index.html");
}

function checkSitemapRoutes() {
  const sitemap = read(sitemapPath);
  const routes = [...sitemap.matchAll(/<loc>https:\/\/velowrite\.app([^<]*)<\/loc>/g)]
    .map((match) => match[1] || "/")
    .filter((route) => !route.includes("?"));

  assert(routes.length >= 30, `Sitemap has too few routes: ${routes.length}`);
  for (const route of routes) {
    const outputPath = routeToOutput(route);
    assert(fs.existsSync(outputPath), `Sitemap route has no generated HTML: ${route}`);
    const html = read(outputPath);
    assert(/<title>[^<]+<\/title>/.test(html), `Missing title: ${route}`);
    assert(html.includes(`rel="canonical" href="https://velowrite.app${route}"`), `Canonical mismatch: ${route}`);
  }

  console.log(`static-check: ${routes.length} sitemap routes have generated metadata`);
}

function checkLlms() {
  const llms = read(llmsPath);
  assert(/^# VeloWrite\s/m.test(llms), "llms.txt must contain a VeloWrite H1");
  assert((llms.match(/^- \[[^\]]+\]\(https?:\/\/[^)]+\)/gm) ?? []).length >= 10, "llms.txt has too few Markdown links");
  assert(llms.includes(`The current public version is v${version}`), "llms.txt version is stale");
  console.log("static-check: llms.txt format, links, and version passed");
}

function checkVersionAndDownloadMetadata() {
  const downloadHtml = read(path.join(distDir, "download", "index.html"));
  assert(downloadHtml.includes(`"softwareVersion": "${version}"`), "Download page softwareVersion is stale");

  const assetText = fs
    .readdirSync(path.join(distDir, "assets"))
    .filter((fileName) => fileName.endsWith(".js"))
    .map((fileName) => read(path.join(distDir, "assets", fileName)))
    .join("\n");

  assert(assetText.includes(`j="${version}"`), "Download bundle version is stale");
  for (const assetSuffix of [
    "x64-setup.exe",
    "aarch64.dmg",
    "amd64.AppImage",
    "amd64.deb",
    "x86_64.rpm",
  ]) {
    assert(assetText.includes(assetSuffix), `Download bundle is missing ${assetSuffix}`);
  }

  console.log(`static-check: download metadata matches v${version}`);
}

function check404() {
  const notFound = read(path.join(distDir, "404.html"));
  assert(notFound.includes("Page Not Found - VeloWrite"), "404 page is missing its friendly heading");
  assert(notFound.includes("VeloWrite"), "404 page is missing product branding");
  console.log("static-check: friendly 404 passed");
}

checkSitemapRoutes();
checkLlms();
checkVersionAndDownloadMetadata();
check404();
console.log("static-check: preview release metadata passed");
