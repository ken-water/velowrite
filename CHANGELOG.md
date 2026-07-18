# Changelog

All notable changes to VeloWrite are documented here.

This project follows semantic versioning while it is pre-1.0. During `0.x`, minor versions may still reshape product scope, but user data compatibility must be called out explicitly.

## Unreleased

### Added

## [0.1.3] - 2026-07-18

### Added

- Pro roadmap page at `/pro` describing free preview boundaries and future paid workflow directions.
- Pro interest waitlist path that marks signups with `userGroup=pro-interest`.
- Navigation and footer links to the Pro roadmap page.
- Product Hunt launch kit with submission copy, maker comment, FAQ, outreach copy, asset plan, and launch checklist.

## [0.1.2] - 2026-07-18

### Added

- Privacy, Terms of Service, Refund Policy, and License pages for the hosted preview.
- Cookie and analytics consent banner with Vercel Analytics mounted only after consent.
- Download page preview status sections for current working features, preview limits, and planned Pro capabilities.
- Footer legal links across the landing, download, and legal pages.

### Changed

- Download page now separates website preview version from the current installer asset version.

## [0.1.1] - 2026-07-11

### Added

- Download page with direct links to GitHub Release installers.
- Local install guide for Linux and Windows testers.
- First-run editor guidance for opening and creating Markdown files.
- Local Linux and Windows packaging scripts.

### Fixed

- Allowed native Tauri dialog commands so Open, Save, Export HTML, and close confirmations work in desktop builds.
- Added Windows icon resource required for cross-built NSIS installers.

### Changed

- Rebuilt Linux and Windows local installers for the ACL fix.

## [0.1.0] - 2026-07-11

### Added

- Contributor guide, roadmap, security policy, issue templates, and pull request template.
- In-app About panel with repository, issues, roadmap, and release links.
- Clearer README project status and feedback links.

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
