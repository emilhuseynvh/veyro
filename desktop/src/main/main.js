"use strict";

const { app, BrowserWindow, ipcMain, dialog, shell, nativeImage } = require("electron");
const fs = require("fs");
const path = require("path");

const store = require("./store");
const engine = require("./engine");

// Show "Veyro" (not "Electron") in the menu bar and Dock, even in dev.
app.setName("Veyro");

let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 1040,
    minHeight: 680,
    titleBarStyle: "hiddenInset",
    backgroundColor: "#0b0b0d",
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  win.loadFile(path.join(__dirname, "../renderer/index.html"));
}

app.whenReady().then(() => {
  // Show the Veyro mark in the Dock (packaged builds use build/icon.icns).
  if (process.platform === "darwin" && app.dock) {
    try { app.dock.setIcon(path.join(__dirname, "../../build/icon.png")); } catch {}
  }
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  engine.stopSyslogMonitor();
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  engine.stopSyslogMonitor();
});

// ---- IPC ---------------------------------------------------------------

ipcMain.handle("state:get", () => {
  const s = store.read();
  return { cards: s.cards, history: Object.keys(s.history || {}) };
});

ipcMain.handle("engine:status", () => engine.status());

ipcMain.handle("engine:choose", async () => {
  // Built-in backend is active, no need to choose external binary.
  return engine.status();
});

ipcMain.handle("engine:clear", () => {
  return engine.status();
});

ipcMain.handle("device:list", () => engine.listDevices());

ipcMain.handle("device:scan", (_e, udid) => {
  return engine.scan(udid, (card) => {
    if (win && !win.isDestroyed()) {
      win.webContents.send("device:card-detected", card);
    }
  });
});

ipcMain.handle("card:addManual", (_e, { cardId, label }) => {
  if (cardId) {
    engine.saveDiscoveredCard(cardId);
    return { ok: true };
  }
  return { ok: false };
});

// The renderer rasterises the card to a 1536x969 PNG on a canvas and sends the
// bytes here. The main process only persists them and tracks undo state.
ipcMain.handle("card:applyDesign", (_e, { cardId, pngBytes, designId, designName, label }) => {
  const { state } = store.saveSkin(cardId, Buffer.from(pngBytes), {
    label, designId, designName, source: "design",
  });
  return { card: state.cards[cardId] };
});

ipcMain.handle("card:applyUpload", (_e, { cardId, pngBytes, name, label }) => {
  const { state } = store.saveSkin(cardId, Buffer.from(pngBytes), {
    label,
    designName: name ? name.replace(/\.[^.]+$/, "") : "Your image",
    source: "upload",
  });
  return { card: state.cards[cardId] };
});

ipcMain.handle("card:undo", async (_e, { cardId, udid }) => {
  const state = store.undo(cardId);
  if (udid) {
    await engine.restoreOriginal(udid, cardId);
  }
  return { card: state.cards[cardId] || null };
});

ipcMain.handle("device:apply", async (_e, udid) => {
  const s = store.read();
  const items = Object.entries(s.cards)
    .filter(([, c]) => c.skinPath && !c.appliedToPhone && fs.existsSync(c.skinPath))
    .map(([cardId, c]) => ({ cardId, pngPath: c.skinPath }));
  if (!items.length) return { ok: true, applied: [], failed: [], nothing: true };
  const result = await engine.apply(udid, items, (p) => {
    if (win && !win.isDestroyed()) win.webContents.send("device:progress", p);
  });
  // Mark ONLY the cards the engine actually confirmed it wrote.
  if (result.applied && result.applied.length) store.markApplied(result.applied);
  return result;
});

// Return a skin or original artwork as a data URL so the sandboxed renderer can show it.
ipcMain.handle("skin:url", (_e, cardId) => {
  const c = store.read().cards[cardId];
  if (c && c.skinPath && fs.existsSync(c.skinPath)) {
    const img = nativeImage.createFromPath(c.skinPath);
    return img.resize({ width: 640 }).toDataURL();
  }
  const art = engine.getCardArtwork(cardId);
  if (art) return art;
  return null;
});

ipcMain.handle("app:open", (_e, url) => {
  if (/^https?:\/\//.test(url)) shell.openExternal(url);
});
