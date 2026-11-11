# Veyro — Mac app

Restyle the card art in Apple Wallet from your Mac. Built with Electron.

```bash
cd app
npm install
npm start
```

Veyro has no preview or demo mode and never shows fake cards. On launch it
looks for your iPhone and, until one is reachable, shows a short "Connect your
iPhone" guide (plug in, unlock, tap Trust, open Wallet). The design gallery is
always browsable. Reading the cards on the phone and writing new artwork are
done by a separate device **engine** you configure — see
[ENGINE.md](./ENGINE.md). Without an engine, Veyro cannot detect a phone and
says so; it never pretends a write happened.

## What it does

- Reads the cards available on a connected iPhone (via the engine) and mirrors
  them in a Wallet-style preview.
- A gallery of CSS-defined designs plus drag-and-drop of your own PNG/JPG/WebP.
- Rasterises each choice to the exact 1536×969 card image on a canvas.
- Saves every card's original artwork the first time it changes, so **undo** is
  always real.
- "Update iPhone" hands the rendered skins to the engine, which performs the
  on-device write.

## What it does not do

- It does not change card numbers, balances, or anything about Apple Pay. Only
  the picture.
- It does not contain or reimplement the iOS exploit used to write to the
  device. That lives in the separately-configured engine. See ENGINE.md.

## Build a .dmg

```bash
npm run dist     # needs build/icon.icns
```

## Layout

| Path | Role |
| --- | --- |
| `src/main/main.js` | Electron main: window + IPC handlers |
| `src/main/engine.js` | The only device boundary; JSON contract to the engine |
| `src/main/store.js` | On-disk state: skins, saved originals, undo |
| `src/preload/preload.js` | Narrow `window.veyro` bridge |
| `src/renderer/*` | The interface, gallery, canvas rasteriser, Wallet preview |
| `src/shared/designs.js` | Card designs + SVG builder, shared by both sides |
