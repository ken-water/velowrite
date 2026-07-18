# Installing VeloWrite

VeloWrite is currently an MVP build for dogfooding and early tester feedback.

## Local Build Artifacts

After running the local package commands, installers are generated under `src-tauri/target`.

Linux:

```text
src-tauri/target/release/bundle/deb/VeloWrite_0.1.4_amd64.deb
src-tauri/target/release/bundle/rpm/VeloWrite-0.1.4-1.x86_64.rpm
src-tauri/target/release/bundle/appimage/VeloWrite_0.1.4_amd64.AppImage
```

Windows, cross-built from Linux:

```text
src-tauri/target/x86_64-pc-windows-gnu/release/bundle/nsis/VeloWrite_0.1.4_x64-setup.exe
```

## Linux

Debian or Ubuntu:

```bash
sudo apt install ./src-tauri/target/release/bundle/deb/VeloWrite_0.1.4_amd64.deb
```

Fedora, RHEL, or compatible distributions:

```bash
sudo dnf install ./src-tauri/target/release/bundle/rpm/VeloWrite-0.1.4-1.x86_64.rpm
```

Portable AppImage:

```bash
chmod +x ./src-tauri/target/release/bundle/appimage/VeloWrite_0.1.4_amd64.AppImage
./src-tauri/target/release/bundle/appimage/VeloWrite_0.1.4_amd64.AppImage
```

## Windows

Run:

```text
VeloWrite_0.1.4_x64-setup.exe
```

The current Windows installer is not code-signed. Windows SmartScreen may show a warning until VeloWrite has a signing certificate and reputation. For trusted internal testing, choose the advanced option and continue.

## macOS

Download the Apple Silicon DMG from the GitHub release:

```text
VeloWrite_0.1.4_aarch64.dmg
```

The current macOS DMG is generated on a GitHub macOS runner and is not Apple Developer signed or notarized yet. A public-quality macOS release should add Apple Developer signing and notarization.

## Known MVP Notes

- Native Open, Save, Export HTML, close confirmation, and external links require Tauri ACL permissions. Builds after commit `4eca575` include those permissions.
- The Windows installer is cross-built from Linux and unsigned.
- AppImage is available for Linux testing, but the `.deb` and `.rpm` packages remain the primary Linux install targets.
- macOS DMG is available for Apple Silicon testing, but it is unsigned and not notarized.
- History snapshots are local-only and are created before overwriting an existing saved file.
- Private sync, AI commands, and one-click publishing are planned but not enabled yet.

## Build Commands

```bash
npm run release:check
cargo check --manifest-path src-tauri/Cargo.toml
npm run package:linux
npm run package:appimage
npm run package:windows
```
