import fs from "node:fs";
import path from "node:path";
import packageJson from "../package.json" with { type: "json" };

const root = process.cwd();
const version = packageJson.version;
const requireAll = process.argv.includes("--require");

const artifactSpecs = [
  {
    id: "windows-nsis",
    label: "Windows NSIS installer",
    relativePath: `src-tauri/target/x86_64-pc-windows-gnu/release/bundle/nsis/VeloWrite_${version}_x64-setup.exe`,
    minBytes: 5 * 1024 * 1024,
  },
  {
    id: "macos-dmg",
    label: "macOS Apple Silicon DMG",
    relativePath: `src-tauri/target/release/bundle/dmg/VeloWrite_${version}_aarch64.dmg`,
    minBytes: 5 * 1024 * 1024,
  },
  {
    id: "linux-appimage",
    label: "Linux AppImage",
    relativePath: `src-tauri/target/release/bundle/appimage/VeloWrite_${version}_amd64.AppImage`,
    minBytes: 20 * 1024 * 1024,
  },
  {
    id: "linux-deb",
    label: "Linux DEB package",
    relativePath: `src-tauri/target/release/bundle/deb/VeloWrite_${version}_amd64.deb`,
    minBytes: 5 * 1024 * 1024,
  },
  {
    id: "linux-rpm",
    label: "Linux RPM package",
    relativePath: `src-tauri/target/release/bundle/rpm/VeloWrite-${version}-1.x86_64.rpm`,
    minBytes: 5 * 1024 * 1024,
  },
];

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function findCurrentArtifacts() {
  return artifactSpecs.map((spec) => {
    const filePath = path.join(root, spec.relativePath);
    if (!fs.existsSync(filePath)) {
      return { ...spec, exists: false, size: 0 };
    }

    const size = fs.statSync(filePath).size;
    return { ...spec, exists: true, size };
  });
}

function checkCurrentArtifacts() {
  const artifacts = findCurrentArtifacts();
  const existing = artifacts.filter((artifact) => artifact.exists);
  const missing = artifacts.filter((artifact) => !artifact.exists);

  if (requireAll && missing.length > 0) {
    fail(`Missing required package artifacts: ${missing.map((artifact) => artifact.id).join(", ")}`);
  }

  for (const artifact of existing) {
    assert(
      artifact.size >= artifact.minBytes,
      `${artifact.label} looks too small: ${artifact.relativePath} (${artifact.size} bytes)`,
    );
  }

  if (existing.length === 0) {
    const mode = requireAll ? "required" : "optional";
    console.log(`artifact-check: no current v${version} artifacts found (${mode} mode)`);
    return;
  }

  console.log(`artifact-check: ${existing.length}/${artifacts.length} current v${version} artifacts passed`);
  for (const artifact of existing) {
    const sizeMb = (artifact.size / (1024 * 1024)).toFixed(1);
    console.log(`artifact-check: ${artifact.id} ${sizeMb} MB`);
  }

  if (!requireAll && missing.length > 0) {
    console.log(`artifact-check: missing optional artifacts: ${missing.map((artifact) => artifact.id).join(", ")}`);
  }
}

function checkDownloadPageNames() {
  const publicPages = fs.readFileSync(path.join(root, "src/publicPages.tsx"), "utf8");
  const expectedNames = [
    "VeloWrite_${downloadVersion}_x64-setup.exe",
    "VeloWrite_${downloadVersion}_aarch64.dmg",
    "VeloWrite_${downloadVersion}_amd64.AppImage",
    "VeloWrite_${downloadVersion}_amd64.deb",
    "VeloWrite-${downloadVersion}-1.x86_64.rpm",
  ];

  for (const fileName of expectedNames) {
    assert(publicPages.includes(fileName), `Download page is missing ${fileName}`);
  }
}

checkDownloadPageNames();
checkCurrentArtifacts();
