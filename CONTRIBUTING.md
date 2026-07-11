# Contributing to VeloMD

Thanks for helping make VeloMD better.

## Development Setup

```bash
npm install
npm run dev
```

Open `http://localhost:1420/app` for the editor preview.

Run the desktop app:

```bash
npm run tauri:dev
```

## Verification

Before opening a pull request, run:

```bash
npm test
npm run build
cargo check --manifest-path src-tauri/Cargo.toml
```

For release preparation, run:

```bash
npm run release:check
```

## Pull Request Guidelines

- Keep changes focused.
- Include tests for pure logic and risky behavior.
- Update `README.md`, `CHANGELOG.md`, or `RELEASE.md` when user-facing behavior changes.
- Do not mix broad refactors with feature work.
- Do not commit secrets, tokens, local `.env` files, or generated build output.

## Good First Areas

- Markdown editing polish.
- Export improvements.
- Local history diff view.
- Accessibility checks.
- Linux/macOS/Windows packaging feedback.
- Documentation and screenshots.

## Commit Style

Prefer concise conventional-style commits:

```text
feat: add history preview
fix: handle failed file save
docs: document release process
chore: update ci
```
