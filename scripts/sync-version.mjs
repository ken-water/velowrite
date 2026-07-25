import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const packagePath = path.join(root, "package.json");
const tauriConfigPath = path.join(root, "src-tauri", "tauri.conf.json");
const cargoTomlPath = path.join(root, "src-tauri", "Cargo.toml");
const checkOnly = process.argv.includes("--check");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

const packageJson = readJson(packagePath);
const tauriConfig = readJson(tauriConfigPath);
const cargoToml = fs.readFileSync(cargoTomlPath, "utf8");
const version = packageJson.version;

if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) {
  console.error(`Invalid package version: ${version}`);
  process.exit(1);
}

if (checkOnly) {
  if (tauriConfig.version !== version) {
    console.error(
      `Version mismatch: package.json=${version}, src-tauri/tauri.conf.json=${tauriConfig.version}`,
    );
    process.exit(1);
  }

  const cargoVersionMatch = cargoToml.match(/^version = "([^"]+)"/m);
  if (!cargoVersionMatch || cargoVersionMatch[1] !== version) {
    console.error(
      `Version mismatch: package.json=${version}, src-tauri/Cargo.toml=${cargoVersionMatch?.[1] ?? "missing"}`,
    );
    process.exit(1);
  }

  console.log(`Version check passed: ${version}`);
  process.exit(0);
}

tauriConfig.version = version;
writeJson(tauriConfigPath, tauriConfig);
fs.writeFileSync(
  cargoTomlPath,
  cargoToml.replace(/^version = "[^"]+"/m, `version = "${version}"`),
);
console.log(`Synced Tauri and Cargo versions to ${version}`);
