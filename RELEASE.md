# Release Process

VeloMD uses semantic versioning: `MAJOR.MINOR.PATCH`.

## Version Rules

- `PATCH`: bug fixes, copy fixes, styling fixes, packaging fixes, no behavior or data-format changes.
- `MINOR`: new features or improvements that keep existing user data compatible.
- `MAJOR`: breaking data format, sync protocol, plugin/API, licensing, or core behavior changes.

Before `1.0.0`, use minor versions for meaningful MVP milestones and document compatibility risks in `CHANGELOG.md`.

## Required Files

Every release must update these together:

- `package.json`
- `package-lock.json`
- `src-tauri/tauri.conf.json`
- `CHANGELOG.md`

## Checklist

1. Decide the version: `MAJOR.MINOR.PATCH`.
2. Update versions:

   ```bash
   npm version 0.2.0 --no-git-tag-version
   npm run version:sync
   ```

3. Update `CHANGELOG.md`.
4. Run local verification:

   ```bash
   npm run release:check
   cargo check --manifest-path src-tauri/Cargo.toml
   ```

5. Build the desktop app before a public/beta release:

   ```bash
   npm run tauri:build
   ```

   Prefer local builds first. Do not add or trigger GitHub Actions release builds unless the maintainer explicitly asks for it.

## Local Packaging

Linux packages from a Linux host:

```bash
npm run tauri -- build --bundles deb,rpm
```

Outputs:

```text
src-tauri/target/release/bundle/deb/
src-tauri/target/release/bundle/rpm/
```

Windows packages from a Linux host require the Windows GNU Rust target and MinGW toolchain:

```bash
rustup target add x86_64-pc-windows-gnu
npm run tauri -- build --target x86_64-pc-windows-gnu --bundles nsis
```

Do not rely on GitHub Actions for Windows packaging until local build attempts have been exhausted or the maintainer explicitly requests CI packaging.

6. Commit release changes:

   ```bash
   git add .
   git commit -m "chore: release v0.2.0"
   ```

7. Tag and push:

   ```bash
   git tag v0.2.0
   git push origin main --tags
   ```

8. Create a GitHub Release using the `CHANGELOG.md` notes.

## GitHub Repository

Canonical repository:

```text
https://github.com/ken-water/velomd
```

Suggested branch model:

- `main`: releasable code.
- `develop`: integration branch.
- `feature/*`: feature branches.
- `release/*`: release hardening branches.
- `hotfix/*`: emergency patch branches.

## Release Note Template

```md
## v0.2.0

### Added
- ...

### Changed
- ...

### Fixed
- ...

### Known Issues
- ...
```
