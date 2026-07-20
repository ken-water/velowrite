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
- Add history diff preview before promoting the desktop app as stable for heavier work.

Version target:
- Free: history timeline polish and diff preview in `0.2.x`.

Pro status:
- Basic local history should stay free.
- Advanced retention rules, named checkpoints, encrypted history, or team/commercial history policies can be Pro candidates later.

### Editor and preview sync scrolling

Signal:
- Daily Markdown users expect side-by-side editor and preview panes to stay aligned.
- This is especially painful in long documents with headings, tables, math, and code blocks.

Decision:
- Treat sync scrolling as a preview-completion feature, not a Pro feature.
- Implement carefully to avoid jumpy behavior.
- Support editor-to-preview first; evaluate two-way sync after testing.
- Outline clicks now synchronize both the editor and preview panes. Continuous long-document scroll matching remains in progress.

Version target:
- Preview / Free: `0.2.x`, high priority.

Pro status:
- Not Pro. Charging for this would make the editor feel incomplete.

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

## Feature Classification

### Preview Completion

These are required before the preview feels solid enough for broader promotion:

- Stable editor/preview sync scroll.
- Better local history browsing and diff preview.
- More complete image handling and relative asset behavior.
- Markdown edge-case rendering tests for math, code, tables, and tabs.
- Cross-platform smoke tests for open, edit, save, export, and close behavior.

### Free Product

These should remain free because they form the basic editor promise:

- Web Markdown editing and live preview.
- Import and download Markdown.
- Basic HTML export.
- Desktop native file open/save.
- Recent files.
- Local history snapshots.
- Theme and view-mode settings.
- No-login local-first workflow.

### Pro Candidates

These are reasonable paid features because they add ongoing value or cost:

- AI writing commands with user-provided or managed provider keys.
- Private multi-device sync.
- Advanced export: polished PDF, DOCX, custom templates, branded outputs.
- One-click publishing to GitHub Pages, Vercel, static blogs, or CMS targets.
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

1. Finish stable continuous sync scrolling for editor and preview.
2. Improve local history discoverability and add diff preview.
3. Design a lightweight web-to-desktop handoff flow.
4. Add tests around long Markdown documents with headings, math, code tabs, images, and tables.
5. Revisit Pro packaging only after the free preview workflow feels complete.
