import fs from "node:fs";
import path from "node:path";
import packageJson from "../package.json" with { type: "json" };

const root = process.cwd();
const version = packageJson.version;
const requiredFileAssociations = ["md", "markdown", "mdown"];
const requiredPermissions = [
  "core:window:allow-close",
  "core:window:allow-set-fullscreen",
  "core:window:allow-set-title",
  "deep-link:default",
  "dialog:allow-message",
  "dialog:allow-open",
  "dialog:allow-save",
  "shell:allow-open",
];

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readText(relativePath) {
  const filePath = path.join(root, relativePath);
  assert(fs.existsSync(filePath), `Missing file: ${relativePath}`);
  return fs.readFileSync(filePath, "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function extractStringConstant(source, name, relativePath) {
  const match = source.match(new RegExp(`const\\s+${name}\\s*=\\s*"([^"]+)"`));
  assert(match, `Missing ${name} constant in ${relativePath}`);
  return match[1];
}

function extractExportedStringConstant(source, name, relativePath) {
  const match = source.match(new RegExp(`export\\s+const\\s+${name}\\s*=\\s*"([^"]+)"`));
  assert(match, `Missing ${name} export in ${relativePath}`);
  return match[1];
}

function checkPackage() {
  assert(packageJson.name === "velowrite", `package.json name should be velowrite, got ${packageJson.name}`);
  assert(/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version), `Invalid package version: ${version}`);
}

function checkTauriConfig() {
  const config = readJson("src-tauri/tauri.conf.json");
  const serialized = JSON.stringify(config);

  assert(config.productName === "VeloWrite", `Tauri productName should be VeloWrite, got ${config.productName}`);
  assert(config.version === version, `Tauri version should be ${version}, got ${config.version}`);
  assert(config.identifier === "app.velowrite.desktop", `Unexpected Tauri identifier: ${config.identifier}`);
  assert(config.bundle?.publisher === "VeloWrite", "Tauri bundle publisher should be VeloWrite");
  assert(!/velomd/i.test(serialized), "Tauri config still contains old VeloMD naming");

  const mainWindow = config.app?.windows?.[0];
  assert(mainWindow?.title === "VeloWrite", "Main window title should be VeloWrite");
  assert(mainWindow.width >= 1100 && mainWindow.height >= 700, "Main window default size is unexpectedly small");
  assert(mainWindow.minWidth >= 900 && mainWindow.minHeight >= 600, "Main window minimum size is too small");
  assert(mainWindow.resizable === true, "Main window must stay resizable");

  const scheme = config.plugins?.["deep-link"]?.desktop?.schemes ?? [];
  assert(scheme.includes("velowrite"), "Missing velowrite:// deep link scheme");

  const associations = config.bundle?.fileAssociations ?? [];
  const markdownAssociation = associations.find((item) => item.name === "Markdown Document");
  assert(markdownAssociation, "Missing Markdown Document file association");
  for (const extension of requiredFileAssociations) {
    assert(markdownAssociation.ext?.includes(extension), `Missing .${extension} file association`);
  }
  assert(markdownAssociation.role === "Editor", "Markdown file association role should be Editor");
  assert(
    markdownAssociation.mimeType === "text/markdown",
    "Markdown file association mimeType should be text/markdown",
  );

  for (const icon of config.bundle?.icon ?? []) {
    assert(fs.existsSync(path.join(root, "src-tauri", icon)), `Missing Tauri icon: ${icon}`);
  }
  assert(
    config.bundle?.windows?.nsis?.startMenuFolder === "VeloWrite",
    "Windows Start Menu folder should be VeloWrite",
  );
}

function checkCargoConfig() {
  const cargoToml = readText("src-tauri/Cargo.toml");
  assert(/^name = "velowrite"$/m.test(cargoToml), "Cargo package name should be velowrite");
  assert(new RegExp(`^version = "${version.replaceAll(".", "\\.")}"$`, "m").test(cargoToml), "Cargo version is stale");
  assert(/^name = "velowrite_lib"$/m.test(cargoToml), "Cargo library name should be velowrite_lib");
}

function checkTauriPermissions() {
  const capability = readJson("src-tauri/capabilities/default.json");
  assert(capability.windows?.includes("main"), "Default capability should apply to the main window");

  const permissions = capability.permissions ?? [];
  for (const permission of requiredPermissions) {
    assert(permissions.includes(permission), `Missing Tauri permission: ${permission}`);
  }
}

function checkPublicManifest() {
  const manifest = readJson("public/site.webmanifest");
  assert(manifest.name === "VeloWrite", `Manifest name should be VeloWrite, got ${manifest.name}`);
  assert(manifest.short_name === "VeloWrite", `Manifest short_name should be VeloWrite, got ${manifest.short_name}`);

  for (const icon of manifest.icons ?? []) {
    const iconPath = icon.src?.startsWith("/") ? icon.src.slice(1) : icon.src;
    assert(iconPath, "Manifest icon is missing src");
    assert(fs.existsSync(path.join(root, "public", iconPath)), `Missing manifest icon: ${icon.src}`);
  }
}

function checkFrontendVersionConstants() {
  const main = readText("src/main.tsx");
  const publicPages = readText("src/publicPages.tsx");
  const editorCore = readText("src/editorCore.ts");
  const indexHtml = readText("index.html");
  const contentPages = readText("src/contentPages.ts");
  const llms = readText("public/llms.txt");

  assert(
    extractStringConstant(main, "downloadVersion", "src/main.tsx") === version,
    "src/main.tsx downloadVersion is stale",
  );
  assert(
    extractStringConstant(publicPages, "downloadVersion", "src/publicPages.tsx") === version,
    "src/publicPages.tsx downloadVersion is stale",
  );
  assert(
    extractExportedStringConstant(editorCore, "appVersion", "src/editorCore.ts") === version,
    "src/editorCore.ts appVersion is stale",
  );
  assert(indexHtml.includes(`"softwareVersion": "${version}"`), "index.html softwareVersion is stale");
  assert(contentPages.includes(`title: "${version} preview"`), "Changelog is missing the current preview version");
  assert(
    contentPages.includes(`{ label: "${version}", href: "#v${version.replaceAll(".", "")}" }`),
    "Changelog directory is missing the current version",
  );
  assert(llms.includes(`The current public version is v${version}`), "llms.txt current version is stale");
}

function checkDownloadMetadata() {
  const publicPages = readText("src/publicPages.tsx");
  const expectedAssets = [
    `VeloWrite_\${downloadVersion}_x64-setup.exe`,
    `VeloWrite_\${downloadVersion}_aarch64.dmg`,
    `VeloWrite_\${downloadVersion}_amd64.AppImage`,
    `VeloWrite_\${downloadVersion}_amd64.deb`,
    `VeloWrite-\${downloadVersion}-1.x86_64.rpm`,
  ];

  assert(
    publicPages.includes("https://github.com/ken-water/velowrite/releases/download"),
    "Download page should use GitHub Releases",
  );
  assert(
    publicPages.includes("https://github.com/ken-water/velowrite/releases/tag"),
    "Download page should link to the release tag",
  );

  for (const asset of expectedAssets) {
    assert(publicPages.includes(asset), `Download metadata is missing ${asset}`);
  }
}

function checkDesktopSourceBasics() {
  const lib = readText("src-tauri/src/lib.rs");
  assert(lib.includes("tauri_plugin_single_instance"), "Desktop app should keep single-instance file handoff enabled");
  assert(lib.includes("tauri_plugin_deep_link"), "Desktop app should keep deep-link support enabled");
  assert(lib.includes("open_file"), "Desktop app should expose native file opening");
  assert(lib.includes("save_file"), "Desktop app should expose native file saving");
}

checkPackage();
checkTauriConfig();
checkCargoConfig();
checkTauriPermissions();
checkPublicManifest();
checkFrontendVersionConstants();
checkDownloadMetadata();
checkDesktopSourceBasics();

console.log(`client-smoke: desktop and release metadata passed for v${version}`);
