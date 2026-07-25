# Changelog

All notable changes to VeloWrite are documented here.

This project follows semantic versioning while it is pre-1.0. During `0.x`, minor versions may still reshape product scope, but user data compatibility must be called out explicitly.

## Unreleased

## [0.1.12] - 2026-07-25

### Added

- Added Windows file association metadata for `.md`, `.markdown`, and `.mdown` documents.
- Added launch-argument handling so Windows Explorer "Open with" can open a Markdown file directly in VeloWrite.
- Added single-instance file handoff so opening a Markdown file while VeloWrite is already running focuses the app and opens the requested file.
- Added a VeloWrite Start Menu folder for the Windows NSIS installer shortcut.

## [0.1.11] - 2026-07-25

### Changed

- Set the free preview history policy to the latest 3 local snapshots across browser drafts, unsaved desktop drafts, and native desktop file history.
- Added a clearer desktop Continue Draft start panel with current draft name and 3-snapshot recovery status.
- Changed the editor status bar to show history as `0 / 3`, `1 / 3`, `2 / 3`, or `3 / 3` snapshots instead of an open-ended count.
- Improved desktop save feedback so users know when the previous version was kept or when the oldest snapshot rotated out.
- Added the installed app version to the desktop About panel.
- Improved website/editor control spacing and synchronized LLM release metadata.

## [0.1.10] - 2026-07-25

### Added

- Added build-time static SEO HTML generation for public website routes so crawlers can read route-specific title, description, canonical, and structured data before JavaScript runs.
- Added generated `404.html` output so static hosting can keep the friendly 404 page while returning a real 404 status for unknown routes.
- Added more natural-language FAQ coverage for private online Markdown editing, lightweight Windows Markdown editing, Typora comparison, offline use, and private notes.

### Changed

- Updated sitemap `lastmod` dates during the SEO build step.
- Simplified Vercel routing so known pages are served as static clean URLs instead of using a full SPA catch-all rewrite.

### Fixed

- Fixed desktop history so unsaved drafts can keep local recovery snapshots before the document has been saved as a real file.
- Reworked the history restore dialog so long diffs reserve space for the actual changed lines instead of letting summary text dominate the panel.
- Changed matching history snapshots to show a clear "No differences" state in the default Changes view instead of showing unchanged document text.
- Fixed outline navigation timing so the editor and preview panes stay aligned when jumping between headings after changing view modes.
- Improved dark-mode preview code blocks with readable syntax colors, stronger code backgrounds, and dark-aware tabbed-code styling.

## [0.1.9] - 2026-07-25

### Added

- Added a desktop start panel with local file actions, recent-file recovery, history access, and practical templates before a real file is opened.
- Added a real desktop Focus Mode that hides application chrome while keeping a visible exit control.
- Reworked the editor status bar into a file trust strip showing storage scope, save state, and available history snapshots.
- Fixed Tauri startup so the installed desktop app opens the desktop editor shell instead of the marketing homepage.
- Changed the homepage embedded editor to open in preview mode so first-time visitors see polished rendered Markdown immediately.
- Made desktop focused writing feel less like a code editor by reducing toolbar noise and visually de-emphasizing line gutters.
- Tightened the mobile analytics consent banner so it stays compliant without covering as much of the first screen.
- Replaced the heavy default sample document with a friendlier starter draft for first-time web and desktop users.
- Improved the homepage and interactive demo loading state with an editor-shaped skeleton instead of a large blank loading panel.
- Changed first-time mobile web editing to open in write mode instead of split mode for better small-screen usability.
- Added contextual desktop upgrade prompts after browser-only save/export and local-file-limited actions.
- Added practical editor templates for quick notes, meeting notes, README files, and article drafts in the web and desktop shells.
- Added an explicit confirmation step before restoring a history snapshot and clarified the diff legend for older versus current lines.
- Added homepage trust signals for privacy, recovery, public roadmap tracking, and visible preview limits.
- Reworked download preview notes into clearer install safety guidance for official sources, unsigned installer warnings, backups, and web-first evaluation.
- Added the macOS Apple Silicon DMG to the download page now that the release asset is available.
- Published `/docs/local-first-markdown` as the sixth staged Markdown library article, covering file ownership, recovery, and local-first sync design.
- Expanded the public roadmap with clearer sync and recovery policy notes, while keeping advanced paid-plan framing on the Pro page.
- Fixed the web editor tablet and small-desktop layout so the preview no longer clips when the browser is around 834-1024px wide.
- Refined the homepage product showcase, footer link hierarchy, cookie consent banner, mobile landing header, desktop focused editor width, responsive editor toolbar, and documentation code examples.
- Improved the download page platform cards and added a mobile web editor brand link back to the homepage.

## [0.1.8] - 2026-07-24

### Added

- Published the first two staged Markdown library articles under `/docs`: Online Markdown Editor and Markdown Basics.
- Published `/docs/markdown-for-writers` as the third staged Markdown library article.
- Published `/docs/markdown-for-developers` as the fourth staged Markdown library article.
- Published `/docs/markdown-code-blocks` as the fifth staged Markdown library article, with examples for fenced code, syntax highlighting, long commands, and tabbed multi-language snippets.
- Added article-specific SEO metadata and sitemap entries for the four public articles while keeping the remaining article queue planned.
- Updated the public roadmap to show four staged learning articles and docs examples that open in the web editor.
- Added stricter docs routing so unknown `/docs/*` paths use the friendly 404 page.
- Expanded Markdown Basics with a table of contents, more examples, and plainer wording across the first two public articles.
- Added rendered Markdown previews beside article example input blocks.
- Refined Markdown Basics so math stays in advanced guides instead of the basics article.
- Added editor toolbar actions to copy Markdown source and rendered HTML.
- Added an `Open in Web Editor` action to documentation examples.
- Added a web-to-desktop draft handoff button that downloads the current Markdown draft before opening desktop downloads.
- Prepared `velowrite://` desktop handoff links so the next desktop build can import web drafts directly, with Markdown download kept as the fallback.
- Added a line-level desktop history restore preview so users can review changes before restoring a snapshot.
- Added browser-local web history snapshots with compare, restore, and delete actions.
- Added immediate CSS tooltips for desktop toolbar icon buttons.

### Fixed

- Aligned the 404 page navigation and background with the main website style.
- Expanded the developer article with language-labeled syntax highlighting examples and tabbed multi-language code examples.
- Made desktop history easier to find from the sidebar, toolbar, and File menu, including an empty-state explanation before snapshots exist.
- Changed the desktop shell to open in a focused editing layout by default, with a workspace toggle for the sidebar and outline.
- Fixed tabbed code previews so separate rendered examples no longer interfere with each other's default selected tab.
- Fixed the web editor brand link so clicking VeloWrite returns to the homepage.

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
