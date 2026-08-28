# Release Process

VeloWrite uses semantic versioning: `MAJOR.MINOR.PATCH`.

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
   npm run release:package
   ```

   `release:package` runs the local platform packages in parallel where safe, so Windows and Linux packaging do not block each other. Use the macOS GitHub Action separately only when the maintainer explicitly asks for a DMG build.

## Local Packaging

Linux packages from a Linux host:

```bash
npm run package:linux
```

Outputs:

```text
src-tauri/target/release/bundle/deb/
src-tauri/target/release/bundle/rpm/
```

Windows packages from a Linux host require the Windows GNU Rust target and MinGW toolchain:

```bash
rustup target add x86_64-pc-windows-gnu
npm run package:windows
```

For a release gate, prefer:

```bash
npm run release:package
```

This keeps the local Windows and Linux packaging in parallel, then leaves macOS DMG to the explicit GitHub Action path.

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
https://github.com/ken-water/velowrite
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
