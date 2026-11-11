"use strict";

// Local, on-disk state. Nothing leaves the Mac. Holds the engine path, the
// skin assigned to each card, and — crucially — the ORIGINAL artwork saved the
// first time a card is touched, so every change can be undone.

const { app } = require("electron");
const fs = require("fs");
const path = require("path");
const os = require("os");

const dir = () => (app && typeof app.getPath === "function" ? app.getPath("userData") : path.join(os.homedir(), ".veyro"));
const skinsDir = () => path.join(dir(), "skins");
const originalsDir = () => path.join(dir(), "originals");
const statePath = () => path.join(dir(), "veyro-state.json");

function ensure() {
  for (const d of [dir(), skinsDir(), originalsDir()]) {
    try { fs.mkdirSync(d, { recursive: true }); } catch {}
  }
}

function read() {
  ensure();
  try {
    return JSON.parse(fs.readFileSync(statePath(), "utf8"));
  } catch {
    return { enginePath: "", cards: {}, history: {} };
  }
}

function write(state) {
  ensure();
  fs.writeFileSync(statePath(), JSON.stringify(state, null, 2));
}

/** Persist a rendered skin PNG for a card and return its file path. */
function saveSkin(cardId, pngBuffer, meta) {
  ensure();
  const file = path.join(skinsDir(), `${safe(cardId)}.png`);
  fs.writeFileSync(file, pngBuffer);
  const state = read();
  const prev = state.cards[cardId];
  // First time we skin this card, remember what was there so undo is real.
  if (prev && prev.skinPath && !state.history[cardId]) {
    state.history[cardId] = { ...prev };
  }
  state.cards[cardId] = {
    skinPath: file,
    label: meta.label || "",
    designId: meta.designId || null,
    designName: meta.designName || "Custom",
    source: meta.source || "design",
    appliedToPhone: false,
    updatedAt: Date.now(),
  };
  write(state);
  return { file, state };
}

function markApplied(cardIds) {
  const state = read();
  for (const id of cardIds) {
    if (state.cards[id]) state.cards[id].appliedToPhone = true;
  }
  write(state);
  return state;
}

/** Undo one card: drop its current skin, restoring the previous record. */
function undo(cardId) {
  const state = read();
  const prev = state.history[cardId];
  if (prev) {
    state.cards[cardId] = { ...prev, appliedToPhone: false, updatedAt: Date.now() };
    delete state.history[cardId];
  } else {
    delete state.cards[cardId];
  }
  write(state);
  return state;
}

function setEnginePath(p) {
  const state = read();
  state.enginePath = p || "";
  write(state);
  return state;
}

function safe(s) {
  return String(s).replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 64);
}

module.exports = { read, write, saveSkin, markApplied, undo, setEnginePath, skinsDir, originalsDir, safe };
