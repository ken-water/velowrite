# Installing VeloMD

VeloMD is currently an MVP build for dogfooding and early tester feedback.

## Local Build Artifacts

After running the local package commands, installers are generated under `src-tauri/target`.

Linux:

```text
src-tauri/target/release/bundle/deb/VeloMD_0.1.0_amd64.deb
src-tauri/target/release/bundle/rpm/VeloMD-0.1.0-1.x86_64.rpm
```

Windows, cross-built from Linux:

```text
src-tauri/target/x86_64-pc-windows-gnu/release/bundle/nsis/VeloMD_0.1.0_x64-setup.exe
```

## Linux

Debian or Ubuntu:

```bash
sudo apt install ./src-tauri/target/release/bundle/deb/VeloMD_0.1.0_amd64.deb
```

Fedora, RHEL, or compatible distributions:

```bash
sudo dnf install ./src-tauri/target/release/bundle/rpm/VeloMD-0.1.0-1.x86_64.rpm
```

## Windows

Run:

```text
VeloMD_0.1.0_x64-setup.exe
```

The current Windows installer is not code-signed. Windows SmartScreen may show a warning until VeloMD has a signing certificate and reputation. For trusted internal testing, choose the advanced option and continue.

## Known MVP Notes

- Native Open, Save, Export HTML, close confirmation, and external links require Tauri ACL permissions. Builds after commit `4eca575` include those permissions.
- The Windows installer is cross-built from Linux and unsigned.
- History snapshots are local-only and are created before overwriting an existing saved file.
- Private sync, AI commands, and one-click publishing are planned but not enabled yet.

## Build Commands

```bash
npm run release:check
cargo check --manifest-path src-tauri/Cargo.toml
npm run package:linux
npm run package:windows
```
