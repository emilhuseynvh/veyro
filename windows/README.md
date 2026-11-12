# Veyro (Windows)

**Apple Wallet card skinner & lockscreen passcode themer for iOS 18.0–27.0.1 and iOS 27.2 beta 1–2 (no jailbreak).** The Windows counterpart to the Veyro macOS app: the **same web UI** (shared `renderer`) wrapped in a [Tauri](https://tauri.app) window, driven by a native Rust device engine. Based on the open-source Lumid-Off Windows port with a working AirTraffic handshake on Windows (including **iOS 26.x**). **iOS 27.2 beta 3+ is patched.**

> **Build it:** see [BUILD.windows.md](BUILD.windows.md). Short version: on a Windows PC with Rust + Tauri CLI, run `cargo tauri build` in this folder → `target\release\bundle\nsis\Veyro_1.3.5_x64-setup.exe`.

**Tutorial Bahasa Indonesia:** [TUTORIAL.id.md](TUTORIAL.id.md)

> Unofficial. Back up the iPhone first. Apple can patch this path; skins can vanish after an iOS update.

## Compatibility

Same Airlift / AirTraffic write path as the macOS app ([Mak5er/AirCard](https://github.com/Mak5er/AirCard)). If Apple patches it on Mac, it is patched here too.

| iOS Version | Status | Notes |
| :--- | :--- | :--- |
| **iOS 18.0 – 27.0.1** | ✅ Supported | Full support for Wallet skins and lockscreen passcode themes |
| **iOS 27.2 beta 1 – beta 2** | ✅ Supported | Working |
| **iOS 27.2 beta 3+** | ❌ Patched | Apple patched the underlying `airlift` exploit. Flashing will not work. |

> [!IMPORTANT]
> Do not update to **iOS 27.2 beta 3 or newer** if you want to continue using Veyro. The underlying AirTraffic sync exploit was patched by Apple in beta 3.

Verified on **iPhone 18,2 / iOS 26.6**. A reporter confirmed Wallet skins on **iOS 27.0** with the v1.3.3 upstream build.

## How the Windows handshake works

On Windows the host often dies with **AirTraffic sync timed out** or **`SyncFailed` ErrorCode 4** because it sends a broken Grappa blob. This tree:

1. Uses `ATHostConnectionCreateWithLibrary` + `RequestingSync` with a replayable Grappa handshake.
2. Batches Wallet (and passcode) file writes into **one** Books sync instead of one handshake per file.

Verified on **iPhone 18,2 / iOS 26.6** over USB.

## Features

- Custom Apple Pay / Apple Cash card artwork (PNG / JPG / WebP / **PDF** for Suica-style art)
- Distinct Wallet sizes: **@3x 1536×969** and **@2x 1024×646** (not a copy of @3x)
- **Save original** / **Restore original** (Airlift export into `%LOCALAPPDATA%\Veyro\wallet-originals`; never overwrites a saved original). **Revert last Veyro skin** is a different action — it only restores the previous skin this app wrote.
- iOS 27 cache invalidation: relocate `FrontFace` / `PlaceHolder` / `Preview` out of the pass cache so Wallet rebuilds (do not overwrite those files with dummy bytes)
- Pan / zoom crop before flash
- Named saved cards, last-image reapply, revert previous Veyro skin
- Cowabunga / Nugget `.passthm` lockscreen keypad themes, including **Bold Text** (`--white-bold`) caches
- Mac-style keypad creator: poster-slice a wallpaper, or load `0.png`…`9.png`
- Same UI as the macOS app (Tauri + the system WebView2), one small installer, no Python runtime
- Syslog card-hash scan while you tap a card in Wallet
- Books state snapshot + restore after the write
- Optional CLI (`veyro.exe --probe` / `--flash` / `--save-original` / `--restore-original` / `--passcode`) for debugging

## Requirements

- Windows 10 / 11 (64-bit)
- [Apple Mobile Device Support](https://support.apple.com/en-us/HT210384) or the **Apple Devices** / 64-bit iTunes package
- Lightning or USB-C **data** cable

Quit **iTunes** and **Apple Devices** while flashing. Keep the iPhone unlocked; open **Books** once.

## Install / build

This project lives in the `windows/` folder of the Veyro repo. Full steps are in
[BUILD.windows.md](BUILD.windows.md). On a Windows PC with Rust + the Tauri CLI,
from inside `windows/`:

```powershell
cargo tauri build
```

Installer: `target\release\bundle\nsis\Veyro_1.3.5_x64-setup.exe`.
For a plain runnable binary instead, `cargo build --release` → `target\release\veyro.exe`.

The GUI is the main app. The same binary also has a debug CLI:

```powershell
.\veyro.exe --probe
.\veyro.exe --flash "CARD_HASH" "D:\art.png"
.\veyro.exe --flash "CARD_HASH" "D:\suica.pdf"
.\veyro.exe --save-original "CARD_HASH"
.\veyro.exe --restore-original "CARD_HASH"
.\veyro.exe --passcode "D:\theme.passthm"
.\veyro.exe --passcode "D:\theme.passthm" TelephonyUI-10 English
```

### AirTraffic handshake probe

Run `veyro.exe --probe` from PowerShell or cmd with one USB-connected, unlocked iPhone; open Books once beforehand. The probe tests `SyncAllowed` → `RequestingSync` → `ReadyForSync` and then releases the connection. It does not run AFC cleanup, stage files, or write Wallet assets. It still sends the handshake messages to the device. The command attaches to the invoking Windows console to print progress and, on `SyncFailed`, only a numeric `ErrorCode` when available. `VEYRO_PROBE_ONLY=1` is kept as an alias (including with leftover `--flash` args). In the GUI, **Probe** runs the same handshake on the selected phone. Normal GUI launch remains windowed.

**Single-device validation:** Manually verified on Windows with iPhone15,4 / iOS 18.7.1. The handshake probe reached `ReadyForSync`, and a subsequent full Wallet artwork application succeeded. This is one real-device observation, not a claim of support for every iOS 18.x device or version.

## Wallet skins

1. USB, unlocked, **Trust this Computer**.
2. Wallet tab → **Scan**. Open Wallet (or double-click Side button), tap the card, **Stop**. Transit cards on iOS 27 often hide the pass id unless you open the card → **…** → **Card Details** → **Turn on Service Mode**, then Scan.
3. **Save original** once **before** the first skin. That copies the Apple artwork via Airlift; later saves are skipped so the backup is never overwritten. **Restore original** writes that backup back. **Revert last Veyro skin** only undoes the previous Veyro PNG.
4. **Choose Image...** (PNG / JPG / WebP / PDF). Use the frame sliders to pan/zoom. Saved cards can be renamed; **Apply last image** reloads the path you used last.
5. **Apply Card Skin**. The write uses a real @2x (1024×646) plus @3x **and a PDF companion** (same as the macOS app), then moves Wallet cache faces so iOS 27 does not keep a stale preview.
6. Force-close Wallet on the iPhone and reopen it.

## Passcode themes

1. Passcode tab → choose a `.passthm`, **or** slice a wallpaper / load a folder of `0.png`…`9.png`.
2. Cache: **TelephonyUI-10** (iOS 18+), **9** (16–17), **8** (legacy).
3. **Apply Passcode Theme**. Regular and **Bold Text** caches (`--white.png` and `--white-bold.png`) are both written.
4. Lock the phone. Bold Text can stay ON.

## Troubleshooting

| Symptom | Try |
|--------|-----|
| No device | Cable, Trust, Apple Mobile Device Service running |
| Stuck on SyncAllowed | Unlocked screen, open Books once |
| SyncFailed / timeout | Quit iTunes / Apple Devices; run `--probe` first |
| Skin not visible | Force-close Wallet or reboot; iOS 27 cache faces are moved, not overwritten |
| StreamingZip / `kAMDEOFError` / send failed | Leftover Books staging after Save original. Retry; this build cleans staging first and resends the zip in 32 KiB chunks |
| Transit hash not found | Wallet → card → … → Card Details → Turn on Service Mode, then Scan |
| Restore original disabled | Click **Save original** before the first custom skin |
| iOS 27.2 beta 3 or newer | Airlift is patched. Flashing will not work; stay on 27.0.1 or 27.2 beta 1–2 |

If the iPhone is still missing after that, Apple USB drivers on Windows are often the cause. Optional last resort:

1. Disconnect the iPhone.
2. Install **[3uTools](https://www.3u.com/)** → **Toolbox → Repair Driver → Repair Now**.
3. Reconnect, tap **Trust**, launch Veyro.

3uTools is third-party (not Apple). Prefer repairing with Apple Mobile Device Support first.

## Credits

Veyro's Windows client is built on these open-source projects:

- Windows port: [@Lumid-Off](https://github.com/Lumid-Off) — [Lumid-Off/AirCard-Windows](https://github.com/Lumid-Off/AirCard-Windows)
- macOS app: [@mak5er](https://github.com/mak5er) — [Mak5er/AirCard](https://github.com/Mak5er/AirCard)
- Windows Grappa handshake + batch flash: [@dhava-gautama](https://github.com/dhava-gautama)
- Core write path: `airlift` (AirTraffic Books sync)
- Theme format: [Cowabunga](https://github.com/leminlimez/Cowabunga) / [Nugget](https://github.com/leminlimez/Nugget)

MIT — see [LICENSE](LICENSE).
