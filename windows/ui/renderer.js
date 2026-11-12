"use strict";
(function () {

const DESIGNS = window.VEYRO_DESIGNS;
const byId = Object.fromEntries(DESIGNS.map((d) => [d.id, d]));
const api = window.veyro;

const state = {
  device: null,
  cards: [],            // [{id, label}]
  cardState: {},        // id -> {skinPath, designId, designName, source, appliedToPhone}
  selected: null,
  cat: "all",
  query: "",
};

const el = (sel) => document.querySelector(sel);
const CATS = ["all", "metal", "gradient", "pattern", "light", "dark", "warm", "cool", "minimal"];

// ---- boot --------------------------------------------------------------
init();

function startClock() {
  const node = el("#sbTime");
  if (!node) return;
  const tick = () => {
    const d = new Date();
    node.textContent = `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  };
  tick();
  setInterval(tick, 10000);
}

async function init() {
  wireStaticUI();
  startClock();
  renderChips();
  renderGallery();
  renderTray();

  const status = await api.engineStatus();
  setMode(status);

  const snap = await api.getState();
  state.cardState = snap.cards || {};

  // Listen for live card detection from iPhone syslog
  if (api.onCardDetected) {
    api.onCardDetected((card) => {
      if (!card || !card.id) return;
      const idx = state.cards.findIndex((c) => c.id === card.id);
      if (idx >= 0) {
        const prev = state.cards[idx];
        const merged = { ...prev, ...card };
        // A completion signal with no art (read failed) must not wipe art we
        // already have, and always clears the loading state.
        if (!card.artUrl) merged.artUrl = prev.artUrl || null;
        if (card.artDone) merged.artLoading = false;
        state.cards[idx] = merged;
        renderWallet();
      } else {
        state.cards.push(card);
        renderWallet();
        toast(`✨ Card detected: ${card.label || card.id.slice(0, 8)}`);
      }
    });
  }

  await refreshDevice();
}

function setMode(status) {
  const badge = el("#modeBadge");
  if (!badge) return;
  if (status && status.mode === "live") {
    badge.textContent = "Veyro Live";
    badge.classList.add("live");
    badge.classList.remove("hidden");
  } else {
    badge.textContent = "";
    badge.classList.remove("live");
    badge.classList.add("hidden");
  }
}

async function refreshDevice() {
  const res = await api.listDevices();
  const devices = (res && res.devices) || [];
  state.device = devices[0] || null;
  const pill = el("#devicePill");

  if (state.device) {
    // A real iPhone is reachable — show Wallet, hide connect guide
    el("#connectPanel").classList.add("hidden");
    el("#walletWrap").classList.remove("hidden");
    pill.classList.add("on");
    el("#deviceName").textContent = `${state.device.name} · ${state.device.version || ""}`.trim();

    const hint = el("#scanHint");
    hint.textContent = "Reading your Wallet cards…";
    hint.classList.remove("hidden");
    const scan = await api.scan(state.device.udid);
    state.cards = (scan && scan.cards) || [];
    if (scan && scan.error) {
      hint.textContent = "Could not read Wallet: " + scan.error;
      hint.classList.remove("hidden");
      toast("Scan notice: " + scan.error);
    } else if (!state.cards.length) {
      hint.textContent = "Open Wallet on your iPhone and tap each card to detect it.";
      hint.classList.remove("hidden");
    } else {
      hint.classList.add("hidden");
    }
    renderWallet();
  } else {
    // No iPhone — show 4-step connect guide
    el("#walletWrap").classList.add("hidden");
    el("#connectPanel").classList.remove("hidden");
    pill.classList.remove("on");
    el("#deviceName").textContent = "Not connected";

    const cs = el("#connectStatus");
    if (res && res.error) {
      cs.textContent = "Notice: " + res.error;
      cs.classList.add("error");
    } else {
      cs.textContent = "Looking for your iPhone… Connect USB and unlock.";
      cs.classList.remove("error");
    }
    state.cards = [];
    renderWallet();
  }
  updateApplyUI();
}

// ---- static wiring -----------------------------------------------------
function wireStaticUI() {
  const rescanBtn = el("#rescanBtn") || el("#engineBtn");
  if (rescanBtn) {
    rescanBtn.addEventListener("click", async () => {
      toast("Checking device…");
      await refreshDevice();
    });
  }

  const addMock = el("#addMock");
  if (addMock) {
    addMock.addEventListener("click", async () => {
      const cardHash = prompt("Enter card hash/identifier (e.g. from syslog or Wallet pass):");
      if (!cardHash || !cardHash.trim()) return;
      const clean = cardHash.trim();
      await api.addManualCard(clean, `Card (${clean.slice(0, 8)}…)`);
      if (!state.cards.some((c) => c.id === clean)) {
        state.cards.push({ id: clean, label: `Card (${clean.slice(0, 8)}…)` });
        state.selected = clean;
        renderWallet();
      }
      toast("Card added");
    });
  }

  el("#updateBtn").addEventListener("click", pushToPhone);
  el("#reconnectBtn").addEventListener("click", async () => {
    el("#connectStatus").textContent = "Looking for your iPhone…";
    el("#connectStatus").classList.remove("error");
    await refreshDevice();
  });

  const search = el("#search");
  search.addEventListener("input", () => {
    state.query = search.value.trim().toLowerCase();
    renderGallery();
  });

  // Upload tray
  const drop = el("#dropZone");
  const file = el("#fileInput");
  drop.addEventListener("click", () => file.click());
  file.addEventListener("change", () => {
    if (file.files[0]) handleUpload(file.files[0], state.selected);
    file.value = "";
  });
  ["dragenter", "dragover"].forEach((ev) =>
    drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("hot"); }),
  );
  ["dragleave", "drop"].forEach((ev) =>
    drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("hot"); }),
  );
  drop.addEventListener("drop", (e) => {
    const f = e.dataTransfer.files[0];
    if (f) handleUpload(f, state.selected);
  });
}

// ---- gallery / tray / chips -------------------------------------------
function renderChips() {
  const wrap = el("#catChips");
  wrap.innerHTML = "";
  CATS.forEach((c) => {
    const b = document.createElement("button");
    b.className = "chip" + (c === state.cat ? " active" : "");
    b.textContent = c === "all" ? "All" : c[0].toUpperCase() + c.slice(1);
    b.addEventListener("click", () => { state.cat = c; renderChips(); renderGallery(); });
    wrap.appendChild(b);
  });
}

function filteredDesigns() {
  return DESIGNS.filter((d) => {
    const catOk = state.cat === "all" || d.tags.includes(state.cat);
    const q = state.query;
    const qOk = !q || d.name.toLowerCase().includes(q) || d.tags.some((t) => t.includes(q));
    return catOk && qOk;
  });
}

function makeFace(design, { drag = false } = {}) {
  const face = document.createElement("div");
  face.className = "card-face";
  if (design.img) {
    face.style.backgroundColor = "#111";
    face.style.backgroundImage = `url("${design.img}")`;
  } else {
    face.style.background = design.css;
  }
  if (drag) {
    face.draggable = true;
    face.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/veyro-design", design.id);
      e.dataTransfer.effectAllowed = "copy";
      face.classList.add("dragging");
      // Small, consistent drag preview instead of the full-size gallery card.
      const ghost = document.createElement("div");
      ghost.style.cssText =
        "position:fixed;top:-1000px;left:-1000px;width:132px;height:84px;border-radius:10px;" +
        "background-size:cover;background-position:center;box-shadow:0 12px 26px rgba(0,0,0,.55);";
      if (design.img) {
        ghost.style.backgroundColor = "#111";
        ghost.style.backgroundImage = `url("${design.img}")`;
      } else {
        ghost.style.background = design.css;
      }
      document.body.appendChild(ghost);
      e.dataTransfer.setDragImage(ghost, 66, 42);
      setTimeout(() => ghost.remove(), 0);
    });
    face.addEventListener("dragend", () => face.classList.remove("dragging"));
  }
  return face;
}

function renderGallery() {
  const list = filteredDesigns();
  const g = el("#gallery");
  g.innerHTML = "";
  list.forEach((d) => {
    const card = document.createElement("div");
    card.className = "g-card";
    const face = makeFace(d, { drag: true });
    face.addEventListener("click", () => applyDesign(state.selected, d.id));
    const name = document.createElement("div");
    name.className = "g-name";
    name.textContent = d.name;
    card.append(face, name);
    g.appendChild(card);
  });
  el("#countLabel").textContent = `${list.length} design${list.length === 1 ? "" : "s"}`;
}

function renderTray() {
  const tray = el("#trayCards");
  tray.innerHTML = "";
  ["8cq1E7PpGz", "Ckzksw0UQb", "g5lm22n1ym", "BpK2IddcN7", "r6381QWUmy", "8ETnWyn0tf"].forEach((id) => {
    const d = byId[id];
    const face = makeFace(d, { drag: true });
    face.addEventListener("click", () => applyDesign(state.selected, d.id));
    tray.appendChild(face);
  });
}

// ---- wallet preview ----------------------------------------------------
function renderWallet() {
  const stack = el("#walletStack");
  stack.innerHTML = "";
  const selIdx = state.cards.findIndex((c) => c.id === state.selected);
  state.cards.forEach((card, i) => {
    const w = document.createElement("div");
    w.className = "w-card";
    w.dataset.id = card.id;
    if (card.id === state.selected) w.classList.add("selected");
    // Drop the card right below the selected one so the selected card is fully
    // revealed, like tapping a card in Apple Wallet.
    if (selIdx >= 0 && i === selIdx + 1) w.classList.add("reveal-above");

    const cs = state.cardState[card.id];
    const design = cs && cs.designId ? byId[cs.designId] : null;
    const light = !design || design.ink === "light";
    if (cs) w.classList.add("touched");

    // Face background: design image/css, uploaded skin, or real card artwork!
    if (design && design.img) {
      w.style.backgroundColor = "#111";
      w.style.backgroundImage = `url("${design.img}")`;
      w.style.backgroundSize = "cover";
      w.style.backgroundPosition = "center";
      w.style.backgroundRepeat = "no-repeat";
    } else if (design) {
      w.style.background = design.css;
    } else if (cs && cs.source === "upload") {
      w.style.background = "#1b1c22";
      api.skinUrl(card.id).then((url) => {
        if (url) {
          w.style.backgroundImage = `url("${url}")`;
          w.style.backgroundSize = "cover";
          w.style.backgroundPosition = "center";
        }
      });
    } else if (card.artUrl) {
      if (card.backgroundColor) w.style.backgroundColor = card.backgroundColor;
      else w.style.backgroundColor = "#1b1c22";
      w.style.backgroundImage = `url("${card.artUrl}")`;
      w.style.backgroundSize = "cover";
      w.style.backgroundPosition = "center";
      w.style.backgroundRepeat = "no-repeat";
    } else if (card.artLoading) {
      // Art is still being read off the iPhone (reads are serialized, so this
      // card is either in the queue or being fetched). Show a clear loading
      // state instead of a placeholder that looks like real art.
      w.classList.add("loading");
      w.style.background = "linear-gradient(135deg,#23242b,#15161a)";
    } else {
      if (card.backgroundColor) {
        w.style.backgroundColor = card.backgroundColor;
      } else {
        w.style.background = "linear-gradient(135deg,#2b2d35,#15161a)";
      }
      api.skinUrl(card.id).then((url) => {
        if (url) {
          w.style.backgroundImage = `url("${url}")`;
          w.style.backgroundSize = "cover";
          w.style.backgroundPosition = "center";
          w.style.backgroundRepeat = "no-repeat";
        }
      });
    }

    const ink = card.foregroundColor || (light ? "rgba(255,255,255,.92)" : "rgba(17,17,20,.9)");

    const loadingOverlay = card.artLoading
      ? `<div class="w-loading"><span class="w-spinner"></span><span>Yüklənir…</span></div>`
      : "";

    // Real card art is self-labelling, so only show the card name when the card
    // has no artwork yet (plain/placeholder), the way an empty Wallet card reads.
    const hasArt = !!((design && design.img) || card.artUrl || (cs && cs.source === "upload"));
    const nameTag = (!hasArt && !card.artLoading)
      ? `<div class="w-name" style="color:${ink}">${escapeHtml(card.label || "Card")}</div>`
      : "";

    w.innerHTML =
      `<button class="w-undo" title="Revert skin" aria-label="Revert skin">↺</button>` +
      nameTag +
      loadingOverlay;

    w.addEventListener("click", (e) => {
      if (e.target.closest(".w-undo")) return;
      state.selected = card.id;
      renderWallet();
    });
    w.querySelector(".w-undo").addEventListener("click", (e) => {
      e.stopPropagation();
      undoCard(card.id);
    });

    // Drag targets
    w.addEventListener("dragover", (e) => {
      e.preventDefault();
      w.classList.add("drop-hot");
      e.dataTransfer.dropEffect = "copy";
    });
    w.addEventListener("dragleave", () => w.classList.remove("drop-hot"));
    w.addEventListener("drop", (e) => {
      e.preventDefault();
      w.classList.remove("drop-hot");
      const designId = e.dataTransfer.getData("text/veyro-design");
      if (designId) return applyDesign(card.id, designId);
      const f = e.dataTransfer.files[0];
      if (f) handleUpload(f, card.id);
    });

    stack.appendChild(w);
  });
}

// ---- rasteriser (1536x969 canvas) --------------------------------------
const R_W = 1536;
const R_H = 969;

function createCanvas() {
  const c = document.createElement("canvas");
  c.width = R_W;
  c.height = R_H;
  return c;
}

function canvasToBytes(c) {
  return new Promise((resolve) => {
    c.toBlob((blob) => {
      const r = new FileReader();
      r.onloadend = () => resolve(new Uint8Array(r.result));
      r.readAsArrayBuffer(blob);
    }, "image/png");
  });
}

async function rasterizeDesign(design) {
  const c = createCanvas();
  const ctx = c.getContext("2d");
  const svg = window.VEYRO_RENDER_SVG ? window.VEYRO_RENDER_SVG(design) : null;
  if (svg) {
    const url = "data:image/svg+xml;utf8," + encodeURIComponent(svg);
    const img = await loadImg(url);
    ctx.drawImage(img, 0, 0, R_W, R_H);
  } else {
    ctx.fillStyle = "#18191f";
    ctx.fillRect(0, 0, R_W, R_H);
  }
  return canvasToBytes(c);
}

async function rasterizeImage(src) {
  const c = createCanvas();
  const ctx = c.getContext("2d");
  const img = await loadImg(src);
  drawCover(ctx, img, R_W, R_H);
  return canvasToBytes(c);
}

async function rasterizeUpload(file) {
  const url = URL.createObjectURL(file);
  try {
    return await rasterizeImage(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function drawCover(ctx, img, w, h) {
  const sRatio = img.width / img.height;
  const dRatio = w / h;
  let sw, sh, sx, sy;
  if (sRatio > dRatio) {
    sh = img.height;
    sw = img.height * dRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = img.width / dRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
}

function loadImg(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

// ---- apply actions -----------------------------------------------------
async function applyDesign(cardId, designId) {
  if (!guardCard(cardId)) return;
  const design = byId[designId];
  const png = design.img ? await rasterizeImage(design.img) : await rasterizeDesign(design);
  const res = await api.applyDesign(cardId, png, designId, design.name, labelOf(cardId));
  state.cardState[cardId] = res.card;
  state.selected = cardId;
  renderWallet();
  updateApplyUI();
  toast(`${design.name} fitted to ${labelOf(cardId)}`);
}

async function handleUpload(file, cardId) {
  if (!guardCard(cardId)) return;
  if (!/image\/(png|jpeg|webp)/.test(file.type)) return toast("Use a PNG, JPG or WebP image");
  const png = await rasterizeUpload(file);
  const res = await api.applyUpload(cardId, png, file.name, labelOf(cardId));
  state.cardState[cardId] = res.card;
  state.selected = cardId;
  renderWallet();
  updateApplyUI();
  toast(`Your image fitted to ${labelOf(cardId)}`);
}

async function undoCard(cardId) {
  const udid = state.device ? state.device.udid : null;
  const res = await api.undo(cardId, udid);
  if (res.card) state.cardState[cardId] = res.card;
  else delete state.cardState[cardId];
  renderWallet();
  updateApplyUI();
  toast("Reverted");
}

async function pushToPhone() {
  if (!state.device) return toast("Connect your iPhone first");
  setApplyState("pending", "Writing to Apple Wallet… 0%");
  el("#updateBtn").disabled = true;

  // Live percentage, like CardLARP, driven by the backend's write progress.
  const bar = el("#applyProgress");
  const fill = el("#applyProgressFill");
  if (bar) bar.classList.remove("hidden");
  if (fill) fill.style.width = "0%";
  let unsub = null;
  if (api.onApplyProgress) {
    unsub = api.onApplyProgress((p) => {
      const pct = Math.max(0, Math.min(100, Math.round(p.percent || 0)));
      if (fill) fill.style.width = pct + "%";
      setApplyState("pending", `Writing to Apple Wallet… ${pct}%`);
    });
  }

  try {
    const res = await api.pushToPhone(state.device.udid);

    if (res.nothing) {
      setApplyState("done", "Nothing to update");
      return;
    }

    const applied = res.applied || [];
    for (const id of applied) {
      if (state.cardState[id]) state.cardState[id].appliedToPhone = true;
    }
    renderWallet();

    if (!res.ok) {
      const done = applied.length ? ` (${applied.length} cards updated)` : "";
      setApplyState(applied.length ? "pending" : "", applied.length ? "Partly applied" : "Update failed");
      toast((res.error || "Could not write artwork to iPhone.") + done);
      return;
    }

    setApplyState("done", "Applied to Apple Wallet");
    toast("🎉 Success! Close and reopen Apple Wallet on your iPhone.");
    launchConfetti();
  } catch (err) {
    setApplyState("", "Update failed");
    toast("Failed: " + (err.message || "Device communication error"));
  } finally {
    if (unsub) unsub();
    if (fill) fill.style.width = "100%";
    setTimeout(() => { if (bar) bar.classList.add("hidden"); }, 500);
    updateApplyUI(true);
  }
}

// ---- helpers -----------------------------------------------------------
function guardCard(cardId) {
  if (!state.device) { toast("Connect your iPhone first"); return false; }
  if (!cardId) { toast("Pick a card on the right first"); return false; }
  return true;
}

function labelOf(cardId) {
  const c = state.cards.find((x) => x.id === cardId);
  return (c && c.label) || "card";
}

function pendingCount() {
  return Object.values(state.cardState).filter((c) => c && c.skinPath && !c.appliedToPhone).length;
}

function updateApplyUI(keepDone) {
  const n = pendingCount();
  const btn = el("#updateBtn");
  btn.disabled = n === 0 || !state.device;
  if (n > 0) setApplyState("pending", `${n} card${n === 1 ? "" : "s"} ready`);
  else if (!keepDone) {
    const anyApplied = Object.values(state.cardState).some((c) => c && c.appliedToPhone);
    setApplyState(anyApplied ? "done" : "", anyApplied ? "Applied to iPhone" : "No changes yet");
  }
}

function setApplyState(kind, text) {
  const s = el("#applyState");
  s.className = "apply-state" + (kind ? " " + kind : "");
  el("#applyText").textContent = text;
}

// Confetti raining from the top on a successful write, like CardLARP.
function launchConfetti() {
  let canvas = el("#confettiCanvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "confettiCanvas";
    canvas.style.cssText =
      "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;";
    document.body.appendChild(canvas);
  }
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const colors = ["#ff375f", "#ff6c8a", "#ffd166", "#06d6a0", "#4cc9f0", "#b388ff", "#ffffff"];
  const parts = [];
  for (let i = 0; i < 150; i++) {
    parts.push({
      x: Math.random() * W,
      y: -20 - Math.random() * H * 0.4,
      w: 6 + Math.random() * 6,
      h: 9 + Math.random() * 8,
      vx: (Math.random() - 0.5) * 2.4,
      vy: 2.4 + Math.random() * 3.6,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: colors[(Math.random() * colors.length) | 0],
      sway: Math.random() * Math.PI * 2,
    });
  }

  const start = performance.now();
  const DURATION = 3200;
  function frame(now) {
    const t = now - start;
    ctx.clearRect(0, 0, W, H);
    let alive = false;
    for (const p of parts) {
      p.sway += 0.05;
      p.x += p.vx + Math.sin(p.sway) * 0.8;
      p.y += p.vy;
      p.rot += p.vr;
      const fade = t > DURATION - 700 ? Math.max(0, (DURATION - t) / 700) : 1;
      if (p.y < H + 30 && fade > 0) alive = true;
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (t < DURATION && alive) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, W, H);
      canvas.remove();
    }
  }
  requestAnimationFrame(frame);
}

let toastTimer;
function toast(msg) {
  const t = el("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

})();
