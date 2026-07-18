export const complexDemoMarkdown = `# Project Notes: Lightweight Writing Stack

This sample document shows how VeloWrite handles real Markdown: notes, tables, equations, diagrams, and multi-language code blocks.

## Summary

VeloWrite is useful when you want a clean place to draft Markdown quickly, then move important files into a local-first desktop workflow.

> Start in the browser. Keep serious work on your own machine.

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

## Writing Workflow

| Task | Web editor | Desktop app |
| --- | --- | --- |
| Quick draft | Instant start | Native app launch |
| Save | Download Markdown copy | Save directly to local file |
| Privacy | Browser-local draft | Local files and history |
| Recovery | Browser autosave | Local history snapshots |

## Document Flow

\`\`\`mermaid
flowchart LR
  Draft[Draft notes] --> Preview[Live preview]
  Preview --> Export[Export Markdown or HTML]
  Preview --> Desktop[Open in desktop app]
  Desktop --> Archive[Keep local history]
\`\`\`

## Checklist

- [x] Write Markdown without an account
- [x] Preview tables, code, and math
- [x] Download Markdown or HTML
- [x] Use desktop local files and history
- [ ] AI writing commands
- [ ] Private sync
- [ ] One-click publishing

## Code Sample

\`\`\`ts
type WritingMode = "write" | "split" | "preview";

function nextMode(mode: WritingMode) {
  return mode === "write" ? "split" : "preview";
}
\`\`\`

## Language Gallery

\`\`\`python
from pathlib import Path

def count_words(text: str) -> int:
    return len(text.split())

print(count_words(Path("notes.md").read_text()))
\`\`\`

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

mkdir -p exports
cp notes.md exports/notes.backup.md
\`\`\`

\`\`\`java
public record NoteTask(String title, boolean done) {
    public String label() {
        return done ? "[x] " + title : "[ ] " + title;
    }
}
\`\`\`

\`\`\`javascript
const tasks = ["draft", "preview", "export"];
const ready = tasks.every(Boolean);
console.log({ ready });
\`\`\`
`;
