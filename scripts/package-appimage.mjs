import { chmod, mkdir, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const toolsDir = process.env.VELOWRITE_APPIMAGE_TOOLS_DIR ?? path.join(os.homedir(), '.cache', 'velowrite', 'appimage-tools');

const tools = [
  {
    name: 'linuxdeploy',
    file: 'linuxdeploy-x86_64.AppImage',
    url: 'https://github.com/linuxdeploy/linuxdeploy/releases/download/1-alpha-20251107-1/linuxdeploy-x86_64.AppImage',
    minBytes: 15 * 1024 * 1024,
  },
  {
    name: 'linuxdeploy-plugin-appimage',
    file: 'linuxdeploy-plugin-appimage-x86_64.AppImage',
    url: 'https://github.com/linuxdeploy/linuxdeploy-plugin-appimage/releases/download/1-alpha-20250213-1/linuxdeploy-plugin-appimage-x86_64.AppImage',
    minBytes: 5 * 1024 * 1024,
  },
  {
    name: 'appimagetool',
    file: 'appimagetool-x86_64.AppImage',
    url: 'https://github.com/AppImage/appimagetool/releases/download/continuous/appimagetool-x86_64.AppImage',
    minBytes: 8 * 1024 * 1024,
  },
];

async function download(url, filePath) {
  const result = spawnSync(
    'curl',
    ['-L', '--fail', '--retry', '3', '--retry-delay', '2', '-C', '-', '-o', filePath, url],
    { stdio: 'inherit' },
  );
  if (result.status !== 0) {
    throw new Error(`Failed to download ${url}`);
  }
  await chmod(filePath, 0o755);
}

async function ensureTool(tool) {
  const downloaded = path.join(toolsDir, tool.file);
  const wrapper = path.join(toolsDir, tool.name);

  try {
    const info = await stat(downloaded);
    if (info.size < tool.minBytes) {
      throw new Error('too small');
    }
  } catch {
    process.stdout.write(`Downloading ${tool.name}...\n`);
    await download(tool.url, downloaded);
  }

  const wrapperSource = `#!/usr/bin/env bash
set -euo pipefail
APPIMAGE_EXTRACT_AND_RUN=1 exec "$(dirname "$0")/${tool.file}" "$@"
`;
  await writeFile(wrapper, wrapperSource, 'utf8');
  await chmod(wrapper, 0o755);
}

async function main() {
  if (process.platform !== 'linux') {
    throw new Error('AppImage packaging is only supported on Linux hosts.');
  }

  await mkdir(toolsDir, { recursive: true });
  for (const tool of tools) {
    await ensureTool(tool);
  }

  const env = {
    ...process.env,
    PATH: `${toolsDir}:${process.env.PATH ?? ''}`,
  };

  const result = spawnSync('npm', ['exec', 'tauri', '--', 'build', '--bundles', 'appimage'], {
    stdio: 'inherit',
    env,
  });

  if (result.status !== 0) {
    throw new Error(`AppImage packaging failed with exit code ${result.status ?? 'unknown'}.`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exit(1);
});
