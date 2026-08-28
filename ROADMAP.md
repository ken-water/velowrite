# VeloWrite Roadmap

This roadmap reflects what is shipped, what still needs preview hardening, and what may become Pro later. VeloWrite should be dependable for daily Markdown work before it grows into AI publishing workflows.

## Shipped: 0.2.9 preview

- Markdown editing and live preview.
- Desktop local file open/save, file associations, recent files, and multiple document tabs.
- Independent Write, Split, and Preview modes per document tab.
- Local history snapshots with compare and restore flows.
- Outline navigation and a read-only H1/H2/H3 structure map.
- Tables, syntax-highlighted code, tabbed code examples, KaTeX math, Mermaid diagrams, and relative local images.
- Markdown download, HTML export, and dedicated PDF export with Unicode fonts, page controls, tables, and watermarks.
- Desktop external-file change handling with compare, reload, and keep-current choices.
- Desktop image drag-and-drop can insert Markdown image references for local files.
- Document quality tools now summarize image path risks, table issues, and code block language coverage.
- Markdown table insertion and table formatting are available in the editor sidebar.
- Table formatting now keeps the current editing location instead of jumping to another part of the document.
- Quick mark lets writers save and jump back to a working line in long documents.
- Web-to-desktop handoff, update-check status, cross-platform installers, release notes, and public feedback tracking.
- Browser workspace recovery, browser-local image embedding, and independent browser history per document tab.

## Next: Preview hardening

- Stabilize continuous editor and preview synchronization for long and structurally uneven documents.
- Continue improving cursor preservation and formatting behavior while editing Markdown.
- Extend image asset management beyond inserted references: paste-to-assets, deduplication, deeper missing-file checks, and safe path repair after moves.
- Improve long-document history review and make changed lines easier to locate.
- Add export consistency tests across preview, HTML, PDF, math, Mermaid, tables, images, and code blocks.
- Expand Windows, macOS, and Linux smoke tests for open, edit, save, export, close, and external file changes.
- Polish find/replace, typewriter-like focus behavior, outline navigation, and first-run desktop behavior.

## Free product direction

- Keep the web editor, live preview, Markdown import/export, basic HTML/PDF export, local files, tabs, and basic history free.
- Keep the no-account local-first workflow as the default.
- Continue improving the shipped read-only document structure view without requiring a database or hosted service.

## Later: 0.3.x and Pro research

- AI command panel with user-provided API keys.
- `/ai polish`, `/ai summarize`, `/ai continue`.
- Provider abstraction for OpenAI-compatible APIs and local Ollama.
- Private-first folder sync with visible conflict handling.
- DOCX export, custom export templates, branded output, and batch export.
- Footnotes, citations, BibTeX, Zotero, and bibliography workflows.
- Static site publishing to GitHub Pages, Vercel, or compatible targets.
- AI-assisted outlines and advanced visual structure editing.

## Before 1.0

- More complete cross-platform regression coverage.
- Automatic update installation only after the update safety model is ready.
- Signed releases where practical and affordable.
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
