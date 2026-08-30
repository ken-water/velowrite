# VeloWrite

VeloWrite is a local-first Markdown editor with a browser workspace and a lightweight Tauri desktop app. Use the browser for quick drafts, or open local Markdown files on Windows, macOS, and Linux.

[![Try the web editor](https://img.shields.io/badge/Try-Web%20Editor-1f6f58?style=flat-square)](https://velowrite.app/web)
[![Download desktop](https://img.shields.io/badge/Download-Desktop%20Preview-173b31?style=flat-square)](https://velowrite.app/download)
[![Read the docs](https://img.shields.io/badge/Read-Markdown%20Docs-6b7280?style=flat-square)](https://velowrite.app/docs)

<p align="center">
  <img src="https://raw.githubusercontent.com/ken-water/velowrite/main/public/home-preview.png" alt="VeloWrite Markdown editor with writing and preview panes" width="920">
</p>

## Start here

- Try the browser editor: [Open the online Markdown editor](https://velowrite.app/web)
- See the workflow: [Open the interactive demo](https://velowrite.app/demo)
- Use local files: [Download the desktop preview](https://velowrite.app/download)
- Learn Markdown: [Browse the Markdown library](https://velowrite.app/docs)
- Check releases: [Read the changelog](https://velowrite.app/changelog)
- Follow product decisions: [View the public roadmap](https://velowrite.app/roadmap)

## What VeloWrite does

### Browser editor

- Write Markdown and see the rendered result while you work.
- Use writing, split, and preview modes.
- Keep browser drafts local to the current browser.
- Open complex examples with tables, code, math, Mermaid, and images.
- Download Markdown and export HTML or PDF from the web workspace.

### Desktop app

- Open and save real local Markdown files.
- Work offline without a hosted account.
- Use recent files and multiple document tabs.
- Keep view mode and history independent per tab.
- Review local history snapshots and restore an earlier version.
- Export readable HTML and PDF documents.
- Detect external file changes before replacing the current draft.

### Markdown rendering

- Tables and nested lists.
- Highlighted code blocks and multi-language code examples.
- KaTeX mathematical expressions.
- Mermaid diagrams.
- Relative local images.
- Unicode and CJK text in the preview and PDF export path.

## Why it exists

Many Markdown tools are either too small for serious documents or too large for opening one file quickly. VeloWrite focuses on a direct writing workflow:

- Browser access for a quick draft.
- Local files and offline work for documents that matter.
- A visible preview and export path before sharing.
- A public roadmap and release notes instead of hidden product promises.

The core editing workflow is local-first. The web editor does not upload Markdown text for normal editing, preview, or download. Desktop files and local history stay on the user's device by default.

## Current preview scope

The public build is a free preview. The current focus is Markdown editing, preview, local files, history, and export.

Not active yet:

- AI writing actions.
- Hosted account and private sync.
- Encrypted sharing.
- One-click publishing.
- Paid Pro checkout.

Preview limitations:

- Windows installers are not code-signed yet.
- The macOS DMG is an unsigned Apple Silicon preview build.
- Keep important documents backed up while testing preview releases.

See [Preview Release Policy](https://velowrite.app/docs/preview-release-policy), [Download Safety](https://velowrite.app/docs/download-safety), and the [public roadmap](https://velowrite.app/roadmap) before installing.

## Development

Requirements:

- Node.js 24 or compatible current Node release.
- Rust stable for desktop commands.
- Tauri system dependencies for the target platform.

Install dependencies and start the web development server:

```bash
npm ci
npm run dev
```

Useful local routes:

- `http://localhost:1420/` for the product site
- `http://localhost:1420/web` for the browser editor
- `http://localhost:1420/demo` for the interactive demo
- `http://localhost:1420/app` for the desktop-shell preview

Run checks:

```bash
npm test
npm run build
cargo check --manifest-path src-tauri/Cargo.toml
```

Run the desktop shell:

```bash
npm run tauri:dev
```

Build Linux packages locally:

```bash
npm run package:linux
npm run package:appimage
```

Build a Windows installer from Linux when the Windows GNU target and MinGW toolchain are installed:

```bash
rustup target add x86_64-pc-windows-gnu
npm run package:windows
```

The macOS DMG workflow is intentionally manual and runs in GitHub Actions:

```text
Actions -> Build macOS DMG -> Run workflow
```

## Testing and Release Checks

The repository includes unit tests, browser end-to-end tests, preview static checks, native Rust tests, and packaging checks.

```bash
npm test
npm run e2e
npm run preview:check
npm run release:check
```

Read [Release Process](RELEASE.md) for versioning, local builds, tags, and release notes.

## Feedback and Contributions

- [Report a bug](https://github.com/ken-water/velowrite/issues/new?template=bug_report.yml)
- [Request a feature](https://github.com/ken-water/velowrite/issues/new?template=feature_request.yml)
- [Read the feedback roadmap](docs/FEEDBACK_ROADMAP.md)
- [Read the contribution guide](CONTRIBUTING.md)
- [Read the Product Hunt launch kit](docs/PRODUCT_HUNT_LAUNCH.md)

Keep pull requests focused. Add tests for rendering, file handling, history, export, or other risky behavior. Do not commit tokens, local environment files, or generated installers.

## Privacy and Waitlist

- Browser Markdown editing, preview, and download work locally in the browser.
- Browser drafts, preferences, and analytics consent use browser storage.
- Analytics scripts load only after the visitor allows analytics.
- Waitlist and feedback submissions are sent to Loops.so for product communication and feedback management.
- Desktop files and local history snapshots stay on the user's device by default.

The website privacy details are documented at [Privacy Policy](https://velowrite.app/privacy).

## Project Documents

- [Roadmap](ROADMAP.md)
- [Changelog](CHANGELOG.md)
- [Release Process](RELEASE.md)
- [Install Notes](INSTALL.md)
- [Contributing](CONTRIBUTING.md)
- [Markdown guide](docs/MARKDOWN_GUIDE.md)

## License

See the [VeloWrite license page](https://velowrite.app/license).
