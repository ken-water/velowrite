# VeloWrite Feedback Roadmap

This document turns early user feedback into product decisions. It is separate from the content plan: content pages help discovery, while this file tracks what we should build, defer, or reserve for Pro.

## Product Principles

- Preview should make core Markdown editing feel trustworthy.
- Free features should remove friction and build daily-use habits.
- Pro features should add high-value workflows, not lock basic writing behind a paywall.
- Sync and AI should be designed private-first instead of rushed into a generic account system.

## Current Feedback Signals

### Browser to desktop handoff

Signal:
- Users understand the idea of starting in the browser and moving serious work to desktop.
- Local history makes the desktop app feel safer for real files.

Decision:
- Keep this as the main product funnel.
- Improve the handoff copy and first-run desktop experience before adding heavier features.
- The desktop shell now opens directly into a focused writing surface and no longer shows website analytics consent UI.

Version target:
- Preview / Free: continue improving in `0.1.x` and `0.2.x`.

Pro status:
- Not Pro. This is core positioning.

### Local history and recovery

Signal:
- Users notice the value of local history when paste mistakes or accidental rewrites happen.

Decision:
- Keep local history in the free desktop preview.
- Improve discoverability, snapshot browsing, and restore confidence.
- Basic history comparison and restore are shipped; long-document diff navigation and deeper recovery remain preview hardening work.

Version target:
- Free: history timeline polish and diff preview in `0.2.x`.

Pro status:
- Basic local history should stay free.
- Advanced retention rules, named checkpoints, encrypted history, or team/commercial history policies can be Pro candidates later.

### External file changes

Signal:
- Local-first users often edit the same Markdown file through Git, scripts, IDEs, AI tools, or another editor.
- Silent overwrites would quickly damage trust.

Decision:
- Treat external-file change detection as a free desktop reliability feature.
- The desktop app now detects when the open file changes on disk and offers Compare, Reload, or Keep current.
- Autosave pauses when a disk change is pending, and manual Save asks before overwriting the disk version.
- Continue improving the compare flow so large changed files are easy to review.

Version target:
- Preview / Free: `0.2.x`, high priority.

Pro status:
- Not Pro. Protecting local files is part of the core editor promise.

### Images and attachments

Signal:
- Markdown documents with images often break after moving files, syncing folders, or sharing notes.
- Users want plain Markdown files, but they also need assets to stay portable.

Decision:
- Keep relative local image rendering in the free editor.
- Desktop drag-and-drop now inserts a Markdown image reference for supported local image files.
- The editor now summarizes image portability risks, including absolute local paths and remote images that may fail offline.
- Continue toward document-local assets folders, paste-to-assets, duplicate-safe filenames, deeper missing-file checks, and path repair after moves.

Version target:
- Preview / Free: basic image references in `0.2.x`; fuller asset management after more file workflow testing.

Pro status:
- Basic local image handling should stay free.
- Team asset libraries, cloud storage connectors, and publishing pipelines can become Pro candidates later.

### Editor and preview sync scrolling

Signal:
- Daily Markdown users expect side-by-side editor and preview panes to stay aligned.
- This is especially painful in long documents with headings, tables, math, and code blocks.

Decision:
- Treat sync scrolling as a preview-completion feature, not a Pro feature.
- The current build supports split synchronization in both directions and outline-driven pane alignment.
- Continuous matching still needs broader validation for long documents, tables, math, Mermaid, images, and uneven block heights.

Version target:
- Preview / Free: `0.2.x`, high priority.

Pro status:
- Not Pro. Charging for this would make the editor feel incomplete.

### Focused writing polish

Signal:
- The desktop app needs to feel like a dedicated writing tool from the first screen.
- Too much browser-like chrome, dense controls, or unclear hover behavior can make users doubt the app experience even when the editor works.
- Long-document writers need a fast way to return to the paragraph they were editing after navigation or document cleanup actions.

Decision:
- Keep reducing unnecessary interface weight in the desktop shell.
- Make the default desktop state a calm writing surface, with file actions and structure tools available without dominating the page.
- Prepare last-session restore so returning desktop users can reopen the most recent local Markdown file without hunting through folders.
- Improve templates, focus mode, hover affordances, document quality tools, and empty states as part of the free product experience.
- The current editor includes a tighter fullscreen focus surface and a sidebar tool panel for table formatting, image checks, code block coverage, and quick mark navigation.
- Table formatting now keeps the current editing location, and each tab can keep its own quick mark.

Version target:
- Preview / Free: continue in `0.1.x` and `0.2.x`.

Pro status:
- Not Pro. The writing surface is the core product promise.

### Outline and structure map

Signal:
- Long-form writers need to understand document structure before polishing the final draft.
- Headings already give Markdown a natural outline, but the current outline should become more useful than a simple jump list.

Decision:
- Improve the outline panel with active-section clarity, folding, and better long-document navigation.
- A read-only structure map generated from Markdown headings is shipped.
- Improve active-section feedback, folding, diagnostics, and long-document navigation before attempting a full visual editor.
- Keep the first version deterministic and local so it stays fast and testable.
- Evaluate editable visual mapping and AI-assisted outline expansion after the outline workflow proves useful.

Version target:
- Free structure workflow: `0.2.x`.
- Advanced visual and AI-assisted structure workflows: `0.3.x+`.

Pro status:
- Better outline navigation and a basic read-only structure map should be free.
- AI-assisted outline expansion, advanced visual editing, and exportable visual maps can be Pro candidates later.

### Web to desktop draft handoff

Signal:
- Users want to start a draft in the browser and continue in desktop without manual copy/download steps.
- Some users are open to accounts, but others prefer local folders.

Decision:
- Do not rush into account-based cloud sync.
- First design a lightweight handoff path:
  - browser export/open in desktop
  - local file or folder handoff
  - optional File System Access API where supported
  - clear privacy explanation

Version target:
- Free: improved manual handoff in `0.2.x`.
- Pro candidate: automatic cross-device sync after the local-first workflow is proven.

Pro status:
- Manual draft handoff should be free.
- Account-based or managed private sync can be Pro.

### Private, no-account sync

Signal:
- Users explicitly care about avoiding heavy cloud accounts.
- Suggestions include File System Access, local folder sync, and a small handoff file.

Decision:
- Evaluate local-first sync models before building a hosted sync service.
- Keep user-owned files as the source of truth.
- Avoid requiring login for core editing.

Version target:
- Research / prototype: `0.2.x`.
- Productized sync: `0.3.x+`.

Pro status:
- Folder-based local workflows should remain free where possible.
- Managed encrypted sync, multi-device conflict handling, and private cloud connectors are strong Pro candidates.

### Low-friction web editor

Signal:
- Users appreciate trying the editor without installing another app.
- Web should be useful immediately but should naturally lead to desktop for offline and local-file work.

Decision:
- Keep the web editor free and fast.
- Continue using the web editor for Product-Led Growth.
- Do not make web so restricted that users cannot judge product quality.

Version target:
- Preview / Free: ongoing.

Pro status:
- Not Pro for basic editing, preview, import, and download.
- Advanced export, publishing, AI, and sync can become Pro.

### Better export and publishing preparation

Signal:
- Users need finished documents that look good outside the editor.
- HTML export is useful today, but PDF/DOCX quality and publish-ready templates will matter for writers, students, founders, and teams.

Decision:
- Improve print/PDF styling first because it builds on the current rendered preview.
- The desktop app now has a dedicated PDF export path with Unicode font handling, page controls, table styling, contents, and preview watermark behavior.
- The web editor provides Markdown download and HTML export without application chrome.
- Keep basic Markdown, HTML, and PDF output as part of the free editor baseline.
- Treat DOCX, branded templates, batch export, and one-click publishing as later workflow packaging.

Version target:
- Free export baseline: `0.2.x`.
- Advanced export and publishing workflows: `0.3.x+`.

Pro status:
- Basic export should stay free.
- Advanced export, branded templates, publishing automation, and team/commercial workflows are strong Pro candidates.

## Feature Classification

### Preview Hardening

These are the remaining improvements needed before the preview feels solid enough for broader promotion:

- Stable editor/preview sync scroll.
- Cursor-preserving Markdown editing and formatting behavior.
- Focused desktop writing polish for first-run behavior, focus mode, and long-session comfort.
- Better outline navigation around the shipped read-only structure map.
- Better local history browsing and diff preview.
- Image asset management beyond current relative-path rendering and portability warnings.
- Export consistency across the shipped HTML and dedicated PDF paths.
- Markdown edge-case rendering tests for math, code, tables, and tabs.
- Cross-platform smoke tests for open, edit, save, export, close, and external file changes.

### Free Product

These should remain free because they form the basic editor promise:

- Web Markdown editing and live preview.
- Import and download Markdown.
- Basic HTML export.
- Desktop native file open/save.
- Recent files.
- Local history snapshots.
- Better outline navigation and the shipped basic document structure view.
- Theme and view-mode settings.
- Document quality tools for image path risks, table cleanup, and code block language coverage.
- No-login local-first workflow.

### Pro Candidates

These are reasonable paid features because they add ongoing value or cost:

- AI writing commands with user-provided or managed provider keys.
- Private multi-device sync.
- Advanced export: polished PDF, DOCX, custom templates, branded outputs.
- One-click publishing to GitHub Pages, Vercel, static blogs, or CMS targets.
- AI-assisted outline expansion and advanced visual structure editing.
- Encrypted vault/history options.
- Commercial/team license features.
- Advanced themes and custom CSS packages.

## Reply Guidance

When replying publicly, do not promise a date unless the work is already scheduled for release. The best pattern is:

1. Confirm the specific workflow the user mentioned.
2. Say whether it is core preview work, free roadmap work, or a Pro candidate.
3. Explain why the classification makes sense.
4. Ask one targeted follow-up only when the answer would affect implementation.

Examples:

- Sync scroll: "This belongs in the core editor, so it should not be a Pro-only feature."
- Manual web-to-desktop handoff: "This should stay lightweight and free."
- Automatic multi-device sync: "This is a possible Pro workflow, but only if we can keep it private-first."
- Local history: "Basic recovery should stay free; advanced retention and encrypted history may become Pro later."

## Near-Term Priorities

1. Finish stable continuous sync scrolling for long and structurally uneven documents.
2. Improve cursor preservation and formatting behavior in the Markdown editor.
3. Add image asset management, deeper missing-file diagnostics, and safe path repair.
4. Improve local history discoverability and long-document diff review.
5. Add export consistency tests across preview, HTML, PDF, math, Mermaid, tables, images, and code.
6. Expand cross-platform smoke tests for open, edit, save, export, close, and external file changes.
7. Design a conflict-aware folder sync prototype without requiring an account for core editing.
8. Revisit Pro packaging only after the free preview workflow feels complete.
