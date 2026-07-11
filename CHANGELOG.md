# Changelog

All notable changes to VeloMD are documented here.

This project follows semantic versioning while it is pre-1.0. During `0.x`, minor versions may still reshape product scope, but user data compatibility must be called out explicitly.

## Unreleased

### Added

- Contributor guide, roadmap, security policy, issue templates, and pull request template.
- In-app About panel with repository, issues, roadmap, and release links.
- Clearer README project status and feedback links.

## [0.1.0] - 2026-07-11

### Added

- Tauri desktop shell with React/Vite frontend.
- Markdown editing with CodeMirror 6.
- Live Markdown preview with generated heading anchors.
- Split, writing-only, and preview-only modes.
- Document outline, word/character/line stats, and reading-time estimate.
- Local file open/save in Tauri and browser fallback import/download.
- Recent files list for desktop.
- Unsaved-change guards for new/open/browser close and desktop close requests.
- Native desktop menu actions for New, Open, Save, Export HTML, Clear Recent, and view modes.
- HTML export with a self-contained readable stylesheet.
- Light, dark, and system theme modes.
- Settings panel for theme, editor font size, and default view mode.
- Optional desktop autosave to the current file.
- Browser/WebView drag-and-drop Markdown opening.
- Desktop drag-and-drop opening using native dropped file paths.
- Desktop local history snapshots before overwriting an existing file.
- History panel with snapshot preview, restore, delete, and retention.
- Waitlist landing page shell.
- Unit tests for Markdown utilities.

### Known Issues

- Editor chunk is larger than 500KB because CodeMirror is bundled in the editor page.
- No production installer build has been verified yet.
- No E2E test covers real Tauri open/save dialogs yet.
- Mermaid, PDF export, image asset management, and AI commands are not implemented yet.
