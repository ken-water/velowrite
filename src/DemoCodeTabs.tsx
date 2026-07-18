import React from "react";
import { Copy, Terminal } from "lucide-react";
import { highlightCode } from "./markdown";

const samples = {
  python: {
    label: "Python",
    title: "Data check",
    code: `from math import sqrt

def summarize(values):
    mean = sum(values) / len(values)
    spread = sqrt(sum((v - mean) ** 2 for v in values))
    return round(mean, 2), round(spread, 2)

print(summarize([12, 14, 19, 23, 28]))`,
  },
  bash: {
    label: "Bash",
    title: "Launch flow",
    code: `#!/usr/bin/env bash
set -euo pipefail

npm run build
npm run package:linux
cp dist/*.AppImage ~/Desktop/`,
  },
  java: {
    label: "Java",
    title: "Snapshot model",
    code: `public record Snapshot(String id, String fileName, long createdAt) {
    public String label() {
        return fileName + "@" + createdAt;
    }
}`,
  },
  javascript: {
    label: "JavaScript",
    title: "Publish helper",
    code: `const publish = async (file) => {
  const response = await fetch("/api/publish", {
    method: "POST",
    body: JSON.stringify(file),
  });

  return response.ok;
};`,
  },
} as const;

type SampleKey = keyof typeof samples;

export default function DemoCodeTabs() {
  const [active, setActive] = React.useState<SampleKey>("javascript");
  const sample = samples[active];

  const highlighted = React.useMemo(() => {
    return highlightCode(sample.code, active);
  }, [active, sample.code]);

  async function copyCode() {
    await navigator.clipboard.writeText(sample.code);
  }

  return (
    <section className="demo-code-block" aria-label="Language tab demo">
      <div className="section-heading">
        <span>Code preview</span>
        <h2>Tabbed syntax highlighting for real snippets.</h2>
      </div>
      <div className="code-card">
        <div className="code-card-toolbar">
          <div className="code-tabs" role="tablist" aria-label="Code languages">
            {(Object.entries(samples) as [SampleKey, (typeof samples)[SampleKey]][]).map(
              ([key, entry]) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={active === key}
                  className={active === key ? "active" : ""}
                  onClick={() => setActive(key)}
                  type="button"
                >
                  {entry.label}
                </button>
              ),
            )}
          </div>
          <button className="code-copy" type="button" onClick={() => void copyCode()}>
            <Copy size={14} />
            Copy
          </button>
        </div>

        <div className="code-card-body">
          <div className="code-card-meta">
            <Terminal size={15} />
            <strong>{sample.title}</strong>
            <span>{sample.label}</span>
          </div>
          <pre className="code-sample">
            <code className={`hljs language-${active}`} dangerouslySetInnerHTML={{ __html: highlighted }} />
          </pre>
        </div>
      </div>
    </section>
  );
}
