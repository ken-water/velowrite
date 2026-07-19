# VeloWrite Roadmap

This roadmap is intentionally practical. VeloWrite should become useful for daily Markdown work before growing into AI publishing workflows.

## Now: 0.1.x

- Stabilize Markdown editing, preview, file open/save, autosave, and local history.
- Improve project documentation and feedback loops.
- Verify packaging on Linux, macOS, and Windows.
- Add screenshots and short demos to the landing page.
- Use early Product Hunt feedback to decide which items are core preview work, free product work, or Pro candidates.

## Next: 0.2.x

- History diff preview.
- Editor and preview sync scrolling for long Markdown documents.
- Lightweight web-to-desktop draft handoff design.
- Better image handling and relative asset paths.
- Find/replace polish.
- Mermaid preview.
- PDF export.
- E2E smoke tests for core editor flows.

## Later: 0.3.x

- AI command panel with user-provided API keys.
- `/ai polish`, `/ai summarize`, `/ai continue`.
- Provider abstraction for OpenAI-compatible APIs and local Ollama.
- Private-first sync prototype after the local file workflow is stable.
- Static site export improvements.

## Before 1.0

- Cross-platform installer builds.
- Automatic update path.
- Signed releases where practical.
- Migration strategy for settings and history data.
- Clear privacy and telemetry policy.
- Enough real-user feedback to lock the core workflow.

## Principles

- Local-first by default.
- Fast startup and low idle overhead.
- No hidden cloud dependency for core editing.
- User files and history must remain inspectable and recoverable.

## Feedback Triage

Product feedback is tracked in [docs/FEEDBACK_ROADMAP.md](docs/FEEDBACK_ROADMAP.md). The main rule is simple: features required for trustworthy Markdown editing stay in Preview/Free, while AI, managed sync, publishing automation, advanced export, and commercial workflows can become Pro.
