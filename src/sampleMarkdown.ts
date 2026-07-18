export const complexDemoMarkdown = `# Research Memo: VeloWrite Launch

This document is intentionally dense so the demo can show real Markdown editing, not just a tiny note.

## Executive Summary

VeloWrite starts as a free online Markdown editor, then converts serious writers to a lightweight Tauri desktop app.

> The web editor is for instant trust. The desktop app is for local-first daily work.

## Mathematical Notes

Inline math works inside normal text: $E = mc^2$, $a^2 + b^2 = c^2$, and $\\Delta G = \\Delta H - T\\Delta S$.

Block equations are rendered cleanly:

$$
\\int_0^\\infty e^{-x^2}\\,dx = \\frac{\\sqrt{\\pi}}{2}
$$

$$
\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\varepsilon_0}
\\qquad
P(\\theta \\mid D) = \\frac{P(D \\mid \\theta)P(\\theta)}{P(D)}
$$

## Launch Metrics

| Funnel step | Current preview | Desktop conversion |
| --- | ---: | ---: |
| Open editor | Instant web page | Native app launch |
| Save workflow | Download copy | Direct local save |
| Privacy | Browser storage | Local-first files |
| Recovery | Browser draft | History snapshots |

## Product Flow

\`\`\`mermaid
flowchart LR
  Visitor[Product Hunt visitor] --> Web[Web editor]
  Web --> Preview[Live preview]
  Preview --> Export[Markdown / HTML export]
  Preview --> Desktop[Desktop preview]
  Desktop --> Pro[Future Pro: AI + Sync + Publish]
\`\`\`

## Engineering Checklist

- [x] Web editor loads without signup
- [x] Split preview supports tables, code, and math
- [x] Desktop preview supports native files
- [ ] AI-native commands
- [ ] Private sync
- [ ] One-click publishing

## Code Sample

\`\`\`ts
type Workflow = "write" | "preview" | "publish";

function nextStep(step: Workflow) {
  return step === "write" ? "preview" : "publish";
}
\`\`\`

## Language Gallery

\`\`\`python
from pathlib import Path

def count_words(text: str) -> int:
    return len(text.split())

print(count_words(Path("launch.md").read_text()))
\`\`\`

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

npm run build
npm run package:linux
\`\`\`

\`\`\`java
public record LaunchStep(String title, boolean done) {
    public String label() {
        return done ? "[x] " + title : "[ ] " + title;
    }
}
\`\`\`

\`\`\`javascript
const steps = ["write", "preview", "publish"];
const ready = steps.filter(Boolean).length > 0;
console.log({ ready });
\`\`\`
`;
