# Building Veyro for Windows

This folder is a **Tauri** app: the same web UI as the Veyro macOS app
(`ui/`), driven by the native Rust device engine (`src/`). Building it on a
Windows PC produces a single downloadable installer (`Veyro_..._x64-setup.exe`).

You only need to do this **on Windows** (the app talks to private Apple device
DLLs and the Windows registry, so it cannot be built or run on macOS/Linux).

---

## 1. One-time setup on the Windows PC

1. **Rust (MSVC toolchain)** — install from <https://rustup.rs>. Accept the
   default `stable-x86_64-pc-windows-msvc`.
2. **Visual Studio C++ Build Tools** — Tauri needs the MSVC linker. Install
   "Desktop development with C++" from the
   [Build Tools installer](https://visualstudio.microsoft.com/visual-cpp-build-tools/).
3. **WebView2 Runtime** — preinstalled on Windows 11 and most Windows 10. If
   missing, grab the *Evergreen Bootstrapper* from Microsoft and run it.
4. **Tauri CLI**:
   ```powershell
   cargo install tauri-cli --version "^2.0"
   ```

> Nothing from Node/npm is required — the UI is plain static files.

## 2. Build the installer

From **inside this `windows/` folder** (the one holding `Cargo.toml` and
`tauri.conf.json`):

```powershell
cargo tauri build
```

The first build downloads crates + NSIS and takes a while. When it finishes the
installer is at:

```
windows\target\release\bundle\nsis\Veyro_1.3.5_x64-setup.exe
```

That `.exe` is the file to send back / put on the website for download.

### Fallback (no installer, just the program)

If `cargo tauri build` has trouble, this still produces a runnable program:

```powershell
cargo build --release
```

→ `windows\target\release\veyro.exe` (needs the WebView2 runtime present).

## 3. What the END USER needs (not the builder)

The person running Veyro on their PC needs **Apple Mobile Device Support** —
i.e. **iTunes** or the **Apple Devices** app (64-bit) from Apple. Veyro loads
Apple's `MobileDevice.dll` / `AirTrafficHost.dll` from that install to talk to
the iPhone. Tell users to quit iTunes / Apple Devices while flashing.

## 4. Quick smoke test

- Launch `veyro.exe`. The Veyro window should open with the gallery on the left
  and the "Connect your iPhone" panel on the right.
- Plug in an unlocked, trusted iPhone → it should appear and let you scan cards.
- A console-only handshake test (no UI): `veyro.exe --probe`.

## 5. If the build fails

Send me the full error output. The device modules (`apple.rs`, `afc.rs`,
`airlift.rs`, `airtraffic.rs`, `device.rs`, `flasher.rs`, `scanner.rs`,
`wallet_backup.rs`) are the proven upstream Windows port; most first-build
errors will be in the thin Tauri layer (`main.rs`, `commands.rs`, `store.rs`)
or a crate version, which are quick to fix.
