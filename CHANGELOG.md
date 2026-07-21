# Changelog

All notable changes to VeloWrite are documented here.

This project follows semantic versioning while it is pre-1.0. During `0.x`, minor versions may still reshape product scope, but user data compatibility must be called out explicitly.

## Unreleased

### Added

- Published the first two staged Markdown library articles under `/docs`: Online Markdown Editor and Markdown Basics.
- Added article-specific SEO metadata and sitemap entries for the two public articles while keeping the remaining article queue planned.
- Added stricter docs routing so unknown `/docs/*` paths use the friendly 404 page.
- Expanded Markdown Basics with a table of contents, more examples, and plainer wording across the first two public articles.
- Added rendered Markdown previews beside article example input blocks.
- Refined Markdown Basics so math stays in advanced guides instead of the basics article.

### Fixed

- Aligned the 404 page navigation and background with the main website style.

## [0.1.7] - 2026-07-20

### Added

- Public Markdown library index at `/docs` with the planned long-tail article structure.
- First long-tail article at `/docs/online-markdown-editor`.
- Product Hunt roadmap update copy for sharing recorded user feedback publicly.
- Vercel Speed Insights integration behind the existing analytics consent gate.
- Documentation article layout now uses a left-side table of contents with the article content on the right.
- Footer links are grouped into Product, Resources, Community, and Legal columns.
- Desktop close handling now exits reliably after the unsaved-changes guard, including File > Exit.
- Document outline clicks now synchronize both the editor and preview panes.
- Desktop shell no longer shows website analytics consent UI.
- Desktop shell opens in focused writing mode by default.
- Public roadmap now reflects shipped preview polish without marking unfinished sync-scroll work as complete.

## [0.1.6] - 2026-07-19

### Added

- Dedicated FAQ page for natural search and AI retrieval.
- SEO and GEO support with canonical metadata, FAQPage schema, `llms.txt`, sitemap entries, and breadcrumb data.
- Homepage and interactive demo improvements so the embedded editor is easier to scan and no longer clips the right edge.
- Free preview positioning focused on browser editing, desktop downloads, guide links, and feedback collection.

## [0.1.5] - 2026-07-19

### Added

- Feedback page, feedback API endpoint, Loops contact grouping, and product entry points from download, legal, footer, and desktop About surfaces.
- Privacy policy wording for feedback submissions.
- Coverage command and preview hardening tests for feedback/waitlist APIs, Loops payload handling, math rendering, and tabbed code previews.
- Playwright smoke tests for the landing page, web editor modes, complex Markdown rendering, demo code tabs, download page, and feedback form.
- Desktop shell polish for window close, Exit menu, outline sizing, and editor/preview sync from outline clicks.
- Markdown quick start guide added in Markdown source and PDF form for new users.

### Changed

- Cleaned public website copy to remove internal release, hosting, and launch-planning language from user-facing pages.

## [0.1.4] - 2026-07-18

### Added

- Shared complex Markdown sample for the web demo and desktop first-run document.
- KaTeX math, syntax-highlighted code fences, and tabbed multi-language code examples in the preview renderer.
- Product Hunt demo improvements, including dedicated demo-frame content and homepage video placement.
- Browser favicon, app icons, and web manifest for stronger product identity.
- Release downloads now include Windows, Linux AppImage, Linux deb/rpm, and unsigned Apple Silicon DMG assets.

### Fixed

- Prevented code-tab clicks from shifting the preview scroll position.
- Expanded preview-only editor mode to use the full workspace instead of leaving an empty side margin.
- Clarified browser save shortcut wording so web users understand it downloads a Markdown copy.

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
