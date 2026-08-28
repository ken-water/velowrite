import { spawn } from "node:child_process";

const tasks = [
  {
    name: "windows-nsis",
    command: "npm",
    args: ["run", "package:windows"],
  },
  {
    name: "linux-deb-rpm",
    command: "npm",
    args: ["run", "package:linux"],
  },
  {
    name: "linux-appimage",
    command: "npm",
    args: ["run", "package:appimage"],
  },
];

function runTask(task) {
  return new Promise((resolve) => {
    const startedAt = Date.now();
    const child = spawn(task.command, task.args, {
      env: process.env,
      shell: process.platform === "win32",
      stdio: ["ignore", "pipe", "pipe"],
    });

    const prefix = `[${task.name}]`;

    child.stdout.on("data", (chunk) => {
      process.stdout.write(
        chunk
          .toString()
          .split(/\r?\n/)
          .filter(Boolean)
          .map((line) => `${prefix} ${line}`)
          .join("\n") + "\n",
      );
    });

    child.stderr.on("data", (chunk) => {
      process.stderr.write(
        chunk
          .toString()
          .split(/\r?\n/)
          .filter(Boolean)
          .map((line) => `${prefix} ${line}`)
          .join("\n") + "\n",
      );
    });

    child.on("close", (code) => {
      const elapsedSeconds = ((Date.now() - startedAt) / 1000).toFixed(1);
      resolve({
        ...task,
        code,
        elapsedSeconds,
      });
    });
  });
}

const results = await Promise.all(tasks.map(runTask));
const failed = results.filter((result) => result.code !== 0);

for (const result of results) {
  const status = result.code === 0 ? "passed" : `failed (${result.code})`;
  process.stdout.write(`${result.name}: ${status} in ${result.elapsedSeconds}s\n`);
}

if (failed.length > 0) {
  process.stderr.write(
    `Release packaging failed for: ${failed.map((result) => result.name).join(", ")}\n`,
  );
  process.exit(1);
}
