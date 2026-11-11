"use strict";

// Direct AirCard backend integration for Veyro.
// Replaces the external engine model with direct native execution of
// aircard_backend.py, aircard.py, and apply_card_skin.py.

const { spawn, execFile } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const store = require("./store");

// Root locations to locate aircard scripts & native binaries
function getRootDirs() {
  return [
    path.resolve(__dirname, "../../.."), // /Users/.../Veyro
    path.resolve(__dirname, "../.."),    // /Users/.../Veyro/app
    process.cwd(),
  ];
}

function findScript(name) {
  for (const r of getRootDirs()) {
    const p = path.join(r, name);
    if (fs.existsSync(p)) return p;
  }
  return path.resolve(__dirname, "../../..", name);
}

function findBinary(name) {
  for (const r of getRootDirs()) {
    const p = path.join(r, "bin", name);
    if (fs.existsSync(p)) return p;
    const pApp = path.join(r, "desktop", "bin", name);
    if (fs.existsSync(pApp)) return pApp;
  }
  const sysApp = path.join("/Applications/AirCard.app/Contents/Resources/bin", name);
  if (fs.existsSync(sysApp)) return sysApp;
  return null;
}

function isConfigured() {
  return true;
}

/**
 * Execute a command on aircard_backend.py and parse output JSON.
 */
function runPython(args, { timeout = 120000, onProgress } = {}) {
  return new Promise((resolve, reject) => {
    const backendScript = findScript("aircard_backend.py");
    const scriptDir = path.dirname(backendScript);

    const proc = spawn("python3", [backendScript, ...args], {
      cwd: scriptDir,
      env: {
        ...process.env,
        PYTHONUNBUFFERED: "1",
        PATH: `${path.join(scriptDir, "bin")}:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:${process.env.PATH || ""}`,
      },
    });

    let lastJson = null;
    let stdoutBuffer = "";
    let stderrBuffer = "";

    proc.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      stdoutBuffer += text;
      const lines = text.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
          const parsed = JSON.parse(trimmed);
          if (parsed && typeof parsed === "object") {
            lastJson = parsed;
            if (parsed.type === "progress" && onProgress) {
              onProgress(parsed);
            }
          }
        } catch {
          // Non-JSON log line
        }
      }
    });

    proc.stderr.on("data", (chunk) => {
      stderrBuffer += chunk.toString();
    });

    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      reject(new Error(`Operation timed out after ${timeout / 1000}s`));
    }, timeout);

    proc.on("close", (code) => {
      clearTimeout(timer);
      if (lastJson) {
        return resolve(lastJson);
      }
      if (code === 0) {
        return resolve({ ok: true, output: stdoutBuffer });
      }
      const err = stderrBuffer.trim() || stdoutBuffer.trim() || `Process exited with code ${code}`;
      reject(new Error(err));
    });

    proc.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

async function status() {
  return {
    mode: "live",
    backend: "aircard",
    platform: process.platform,
  };
}

// -> { ok, mode, devices, error }
async function listDevices() {
  try {
    const out = await runPython(["devices"], { timeout: 30000 });
    if (!out) {
      return { ok: true, mode: "live", devices: [], error: null };
    }
    if (out.connected === false && out.error === "no_device") {
      return { ok: true, mode: "live", devices: [], error: null };
    }
    if (out.error && out.connected === false) {
      return { ok: false, mode: "live", devices: [], error: out.error };
    }

    const rawList = Array.isArray(out.devices) ? out.devices : [];
    const devices = rawList.map((d) => ({
      udid: d.udid,
      name: d.name || "iPhone",
      version: d.version ? (d.version.startsWith("iOS") ? d.version : `iOS ${d.version}`) : "",
      product: d.product || "",
      airliftCompatible: d.airlift_compatible !== false,
      connected: d.connected !== false,
    }));

    return { ok: true, mode: "live", devices, error: null };
  } catch (err) {
    return { ok: false, mode: "live", devices: [], error: err.message };
  }
}

// Background syslog listener instance per device
let activeSyslogProc = null;
let activeSyslogUdid = null;

function stopSyslogMonitor() {
  if (activeSyslogProc) {
    try { activeSyslogProc.kill("SIGTERM"); } catch {}
    activeSyslogProc = null;
    activeSyslogUdid = null;
  }
}

const CARD_REGEXES = [
  /\/(?:Cards|Passes\/Cards)\/([-A-Za-z0-9_+=]{20,44})(?:\.pkpass|\.cache|\.pkcache|\/|\s|"|'|\)|,|$)/,
  /\/([-A-Za-z0-9_+=]{20,44})\.(?:pkpass|cache|pkcache)/,
  /(?<![A-Za-z0-9+/_-])([A-Za-z0-9+/_-]{27}=)(?![A-Za-z0-9+/_-])/,
];
const IGNORED_HASHES = new Set([
  "M6nDwZrkYbFlsodLgCbvyFZQ1cc=",
  "kJL-D0rr-SZhbj2c8nK-OQ9hCMY=",
  "hwAtAmHKYwsQrJbT5cTNDsaxVME=",
]);

function startSyslogMonitor(udid, onCardDetected) {
  if (activeSyslogUdid === udid && activeSyslogProc) return;
  stopSyslogMonitor();

  const helper = findBinary("device_helper");
  if (!helper || !udid) return;

  try {
    const proc = spawn(helper, ["syslog", udid], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    activeSyslogProc = proc;
    activeSyslogUdid = udid;

    proc.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      const lines = text.split("\n");
      for (const line of lines) {
        const lower = line.toLowerCase();
        const isWallet =
          lower.includes("passd") ||
          lower.includes("passbook") ||
          lower.includes("passkit") ||
          lower.includes("stockholm") ||
          lower.includes("nanopassd") ||
          lower.includes("wallet") ||
          lower.includes("/cards/");
        if (!isWallet) continue;

        for (const regex of CARD_REGEXES) {
          const match = regex.exec(line);
          if (match && match[1]) {
            const h = match[1].trim().replace(/['"]/g, "").replace(/[.,]$/, "");
            if (h.length === 36 && h.includes("-")) continue;
            if (IGNORED_HASHES.has(h)) continue;
            if (h.length >= 16) {
              // Loyalty/store/ticket/coupon passes are not reskinnable — never
              // surface them even when the user taps one in Wallet.
              if (isExcludedCard(h)) continue;
              // Found card hash from iPhone Wallet
              saveDiscoveredCard(h);
              const cardArt = getCardArtwork(h, udid);
              const cardObj = {
                id: h,
                label: `Card (${h.slice(0, 8)}…)`,
                artUrl: cardArt,
                artLoading: !cardArt,
              };
              if (onCardDetected) {
                onCardDetected(cardObj);
              }
              // Attempt to fetch artwork in background if not yet cached, then
              // report completion so the card stops showing as loading.
              if (!cardArt) {
                fetchDeviceCardArtworkAsync(udid, h, (artUrl) => {
                  if (onCardDetected) {
                    onCardDetected({ id: h, label: cardObj.label, artUrl: artUrl || null, artDone: true });
                  }
                });
              }
            }
          }
        }
      }
    });

    proc.on("close", () => {
      if (activeSyslogProc === proc) {
        activeSyslogProc = null;
        activeSyslogUdid = null;
      }
    });
  } catch {}
}

function saveDiscoveredCard(cardHash) {
  try {
    const storePath = path.join(os.homedir(), ".aircard_cards.json");
    let cards = [];
    if (fs.existsSync(storePath)) {
      try { cards = JSON.parse(fs.readFileSync(storePath, "utf8")); } catch {}
    }
    if (!Array.isArray(cards)) cards = [];
    if (!cards.includes(cardHash)) {
      cards.push(cardHash);
      fs.writeFileSync(storePath, JSON.stringify(cards, null, 2), "utf8");
    }
  } catch {}
}

const CANDIDATE_IMAGE_NAMES = [
  "cardBackgroundCombined@3x.png",
  "cardBackgroundCombined@2x.png",
  "cardBackgroundCombined.png",
  "strip@3x.png",
  "strip@2x.png",
  "strip.png",
  "background@3x.png",
  "background@2x.png",
  "background.png",
  "thumbnail@3x.png",
  "thumbnail@2x.png",
  "logo@3x.png",
  "logo@2x.png",
];

function extractPassArtwork(passDir) {
  for (const imgName of CANDIDATE_IMAGE_NAMES) {
    const p = path.join(passDir, imgName);
    if (fs.existsSync(p)) {
      try {
        const buf = fs.readFileSync(p);
        return `data:image/png;base64,${buf.toString("base64")}`;
      } catch {}
    }
  }
  return null;
}

// Pass types that carry no reskinnable card face (strip/logo art only). Shown
// they look wrong and their device read fails, so they are hidden everywhere.
const EXCLUDED_PASS_TYPES = ["boardingPass", "eventTicket", "storeCard", "coupon", "generic"];

// True when this card id maps to a locally-synced pass of an excluded type.
// Payment/transit cards with no local bundle are never excluded (returns false).
function isExcludedCard(cid) {
  try {
    const pj = path.join(os.homedir(), "Library/Passes/Cards", `${cid}.pkpass`, "pass.json");
    if (fs.existsSync(pj)) {
      const d = JSON.parse(fs.readFileSync(pj, "utf8"));
      return EXCLUDED_PASS_TYPES.some((k) => k in d);
    }
  } catch {}
  return false;
}

function getCardArtwork(cid) {
  // 1. Check local pass on Mac
  const passDir = path.join(os.homedir(), "Library/Passes/Cards", `${cid}.pkpass`);
  if (fs.existsSync(passDir)) {
    const art = extractPassArtwork(passDir);
    if (art) return art;
  }
  // 2. Check saved original in store.originalsDir()
  const orig = path.join(store.originalsDir(), `${store.safe(cid)}.png`);
  if (fs.existsSync(orig)) {
    try {
      const buf = fs.readFileSync(orig);
      return `data:image/png;base64,${buf.toString("base64")}`;
    } catch {}
  }
  return null;
}

// Every device read/write uses the same iOS sync exploit, which momentarily
// moves files around on the iPhone and restores them. Two of these running at
// once race on the device and fail (or bring back the wrong/blank art). On
// connect we fire a read for every card, so they MUST be serialized — run
// strictly one at a time through this queue.
let deviceOpQueue = Promise.resolve();
function enqueueDeviceOp(fn) {
  const run = deviceOpQueue.then(fn, fn);
  deviceOpQueue = run.then(() => {}, () => {});
  return run;
}

function fetchDeviceCardArtworkAsync(udid, cardId, callback) {
  if (!udid || !cardId) return;
  const orig = path.join(store.originalsDir(), `${store.safe(cardId)}.png`);
  if (fs.existsSync(orig)) {
    try {
      const buf = fs.readFileSync(orig);
      return callback(`data:image/png;base64,${buf.toString("base64")}`);
    } catch {}
  }
  const readAsDataUrl = () => {
    if (fs.existsSync(orig)) {
      try {
        return `data:image/png;base64,${fs.readFileSync(orig).toString("base64")}`;
      } catch {}
    }
    return null;
  };
  enqueueDeviceOp(() => {
    // Another queued read may already have fetched it while we waited.
    const cached = readAsDataUrl();
    if (cached) {
      callback(cached);
      return;
    }
    return runPython(["read-art", udid, cardId, orig], { timeout: 35000 })
      // Always report completion (art on success, null on failure) so the UI
      // can stop showing the card as still loading.
      .then(() => callback(readAsDataUrl()))
      .catch(() => callback(null));
  });
}

// -> { ok, cards, error }
async function scan(udid, onCardDetected) {
  const cards = [];
  const seenIds = new Set();

  // 1. Read locally-synced Wallet passes on macOS (~/Library/Passes/Cards)
  const base = path.join(os.homedir(), "Library/Passes/Cards");
  const cardIdRegex = /^[-A-Za-z0-9_+=]{20,64}$/;
  if (fs.existsSync(base)) {
    try {
      const files = fs.readdirSync(base);
      for (const file of files) {
        if (!file.endsWith(".pkpass")) continue;
        const cid = file.slice(0, -7);
        if (!cardIdRegex.test(cid)) continue;
        const passDir = path.join(base, file);
        const passJsonPath = path.join(passDir, "pass.json");
        let name = "Apple Wallet Card";
        let backgroundColor = null;
        let foregroundColor = null;
        let labelColor = null;

        if (fs.existsSync(passJsonPath)) {
          try {
            const d = JSON.parse(fs.readFileSync(passJsonPath, "utf8"));
            // Only payment + transit passes carry a reskinnable 1536x969 card
            // face (cardBackgroundCombined). Store/loyalty, coupon, ticket,
            // boarding and generic passes only have strip/logo art, which would
            // display stretched and wrong, and whose device read fails with
            // "artwork not found". Hide them, matching the Python backend's
            // cmd_local_cards exclusion, and keep them hidden in later steps.
            if (["boardingPass", "eventTicket", "storeCard", "coupon", "generic"].some((k) => k in d)) {
              seenIds.add(cid);
              continue;
            }
            name = d.description || d.organizationName || name;
            backgroundColor = d.backgroundColor || null;
            foregroundColor = d.foregroundColor || null;
            labelColor = d.labelColor || null;
          } catch {}
        }

        const artUrl = extractPassArtwork(passDir);

        if (!seenIds.has(cid)) {
          seenIds.add(cid);
          cards.push({
            id: cid,
            label: name,
            artUrl,
            backgroundColor,
            foregroundColor,
            labelColor,
          });
        }
      }
    } catch {}
  }

  // 2. Read saved card hashes from ~/.aircard_cards.json & store
  try {
    const savedOut = await runPython(["cards"], { timeout: 15000 });
    const savedHashes = (savedOut && Array.isArray(savedOut.cards)) ? savedOut.cards : [];
    savedHashes.forEach((id, index) => {
      if (!seenIds.has(id)) {
        seenIds.add(id);
        if (isExcludedCard(id)) return;
        const artUrl = getCardArtwork(id);
        const label = `Card ${index + 1} (${id.slice(0, 8)}…)`;
        const willLoad = !artUrl && !!udid;
        cards.push({ id, label, artUrl, artLoading: willLoad });
        if (willLoad) {
          fetchDeviceCardArtworkAsync(udid, id, (loadedArt) => {
            if (onCardDetected) {
              onCardDetected({ id, label, artUrl: loadedArt || null, artDone: true });
            }
          });
        }
      }
    });
  } catch {}

  // Also include any cards touched in store.js
  const stored = store.read().cards || {};
  Object.keys(stored).forEach((id) => {
    if (!seenIds.has(id)) {
      seenIds.add(id);
      if (isExcludedCard(id)) return;
      const artUrl = getCardArtwork(id);
      cards.push({
        id,
        label: stored[id].label || `Card (${id.slice(0, 8)}…)`,
        artUrl,
      });
    }
  });

  // 3. Start syslog monitor on device if connected, to detect cards as user taps them
  if (udid) {
    startSyslogMonitor(udid, onCardDetected);
  }

  return { ok: true, cards, error: null };
}

/**
 * Apply a set of {cardId, pngPath} to a device.
 * Directly invokes aircard_backend.py flash <udid> <cardId> <pngPath>.
 */
async function apply(udid, items, onProgress) {
  const ids = items.map((i) => i.cardId);

  if (!udid) {
    return {
      ok: false,
      applied: [],
      failed: ids,
      error: "No iPhone is connected. Please connect and unlock your iPhone.",
    };
  }

  const applied = [];
  const failed = [];
  let lastError = null;
  const totalItems = items.length;
  let doneItems = 0;

  for (const item of items) {
    try {
      // Share the device queue so a write never overlaps a background art read.
      const res = await enqueueDeviceOp(() =>
        runPython(["flash", udid, item.cardId, item.pngPath], {
          timeout: 180000,
          // Turn the backend's per-card step/total into one 0-100 percent
          // across every card being written.
          onProgress: (p) => {
            if (!onProgress) return;
            const frac = p && p.total ? Math.min(Math.max(p.step / p.total, 0), 1) : 0;
            const percent = Math.round(((doneItems + frac) / totalItems) * 100);
            onProgress({ percent, message: (p && p.message) || "", cardId: item.cardId });
          },
        }),
      );

      if (res && res.type === "error") {
        failed.push(item.cardId);
        lastError = res.message || "Failed to flash artwork.";
      } else {
        applied.push(item.cardId);
      }
    } catch (e) {
      failed.push(item.cardId);
      lastError = e.message;
    }
    doneItems++;
    if (onProgress) {
      onProgress({ percent: Math.round((doneItems / totalItems) * 100), message: "", cardId: item.cardId });
    }
  }

  const ok = applied.length > 0 && failed.length === 0;
  return {
    ok,
    applied,
    failed,
    error: ok ? null : (lastError || "Could not write all cards to iPhone."),
  };
}

async function restoreOriginal(udid, cardId) {
  if (!udid || !cardId) return { ok: false };
  try {
    const res = await runPython(["restore-original", udid, cardId], { timeout: 30000 });
    return res;
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

module.exports = {
  status,
  listDevices,
  scan,
  apply,
  restoreOriginal,
  saveDiscoveredCard,
  stopSyslogMonitor,
  isConfigured,
  getCardArtwork,
};
