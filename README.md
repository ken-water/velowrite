# VeloWrite

VeloWrite is a Tauri-based Markdown editor concept focused on lightweight startup, a clean Typora-like writing surface, AI-native commands, local Git history, and one-click static publishing.

Repository: <https://github.com/ken-water/velowrite>

## Project Status

VeloWrite is an early MVP. It is ready for dogfooding Markdown reading/editing workflows, but it is not yet a polished public beta. Feedback on real writing workflows, packaging, file handling, and history recovery is especially valuable.

## First Version

The current first version includes:

- A real Markdown editing surface at `/app`
- A browser-based Markdown editor at `/web` for online reading, editing, preview, and download
- Browser-to-desktop conversion prompts for native folders, direct save, local history, and offline workflows
- Legal pages at `/privacy`, `/terms`, `/refund`, and `/license`
- Cookie/analytics consent banner with Vercel Analytics loaded only after consent
- Download page preview status for current features, limitations, and planned Pro capabilities
- Pro roadmap page at `/pro` for future AI, sync, publishing, and commercial workflow interest
- CodeMirror 6 editor with Markdown syntax highlighting
- Line numbers, active-line highlight, search, history, bracket matching, and tab indentation
- Live Markdown preview
- Split, writing-only, and preview-only modes
- Document outline generated from Markdown headings
- Editor-to-preview scroll sync
- Word, character, line, and reading-time stats
- Unsaved-change guards for new/open/browser close
- Desktop window title sync with dirty-file indicator
- Desktop recent files list with one-click reopen
- Clear recent files action
- Drag-and-drop Markdown file opening in the browser/WebView surface
- Desktop drag-and-drop opening using native dropped file paths
- Desktop close-request interception for unsaved changes
- Optional desktop autosave to the current file after a normal save/open
- Desktop local history snapshots before overwriting an existing file
- History panel with snapshot list and restore action
- History snapshot preview and delete actions
- History retention capped to recent snapshots per file
- Open/save error messages in the editor status area
- Native desktop menu actions for New, Open, Save, Export HTML, Clear Recent, and view modes
- HTML export with a self-contained readable document stylesheet
- Settings panel for theme mode, editor font size, and default view mode
- Light, dark, and system theme modes
- Browser fallback for opening Markdown files
- Browser fallback for downloading Markdown files
- Draft autosave through `localStorage`
- Desktop-only native open/save commands through Tauri
- Keyboard shortcuts: `Ctrl/Cmd+N`, `Ctrl/Cmd+O`, `Ctrl/Cmd+S`

## Feedback

- Bugs: <https://github.com/ken-water/velowrite/issues/new?template=bug_report.yml>
- Feature requests: <https://github.com/ken-water/velowrite/issues/new?template=feature_request.yml>
- Roadmap: `ROADMAP.md`
- Contributing: `CONTRIBUTING.md`
- Product Hunt launch kit: `docs/PRODUCT_HUNT_LAUNCH.md`

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:1420` for the landing page, `http://localhost:1420/web` for the browser editor, and `http://localhost:1420/app` for the desktop-shell preview.

Run unit tests:

```bash
npm test
```

Run release checks:

```bash
npm run release:check
cargo check --manifest-path src-tauri/Cargo.toml
```

Build local Linux packages:

```bash
npm run package:linux
```

Build a local Windows installer from Linux after installing the Windows GNU Rust target and MinGW toolchain:

```bash
rustup target add x86_64-pc-windows-gnu
npm run package:windows
```

Run the desktop shell:

```bash
npm run tauri:dev
```

## Releases

Versioning and release steps are documented in `RELEASE.md`. User-facing changes are tracked in `CHANGELOG.md`. Local install notes are in `INSTALL.md`.

## Waitlist

The landing form posts to `/api/waitlist` by default. On Vercel, this endpoint creates or updates a Loops contact with `userGroup=waitlist` and `source=velowrite.app`.

```json
{
  "email": "you@example.com",
  "product": "velowrite"
}
```

Required Vercel environment variable:

```text
LOOPS_API_KEY=...
```

Optional Vercel environment variables:

```text
VITE_WAITLIST_ENDPOINT=/api/waitlist
```

Contacts are visible in the Loops dashboard under Contacts. Use the `waitlist` user group or the `velowrite.app` source field to filter general signups. Pro roadmap signups use `userGroup=pro-interest` and `signupPath=/pro`.

## Privacy Notes

- Web editor Markdown content is edited and previewed in the browser; normal edit/preview/download actions do not upload document text to VeloWrite servers.
- Web drafts, editor preferences, and the analytics consent choice use browser localStorage.
- Vercel Web Analytics is mounted only after the visitor allows analytics in the cookie banner.
- Waitlist email addresses are sent to Loops.so for beta invitation and update management.
- Desktop files and local history snapshots stay on the user's device by default.

## Preview and Commercial Boundaries

- Current public builds are free preview builds for evaluation and feedback.
- No paid desktop license, subscription, account system, AI service, sync service, or publishing service is active yet.
- Planned Pro capabilities are directional product signals, not available paid features.
- The `/pro` page collects product interest before pricing is published; it is not a checkout page.
- Current installer assets may lag behind the hosted website version when a release only changes the website, legal pages, or conversion copy.

## Deployment

The landing page is a static Vite build and can be deployed to Vercel, Netlify, or Cloudflare Pages.

```bash
npm run build
```
