"use strict";
// Recreates the Electron `window.veyro` bridge on top of Tauri, so the exact
// same renderer design runs unchanged. Loaded before renderer.js.

(function () {
  const T = window.__TAURI__;
  if (!T) {
    console.error("Tauri API not found — is withGlobalTauri enabled?");
    return;
  }
  const invoke = T.core.invoke;
  const listen = T.event.listen;

  // Wrap a Tauri event subscription in the Electron-style (cb) -> unsubscribe API.
  function subscribe(eventName, callback) {
    const unlistenP = listen(eventName, (e) => callback(e.payload));
    return () => { unlistenP.then((off) => off()).catch(() => {}); };
  }

  window.veyro = {
    engineStatus: () => invoke("engine_status"),
    getState: () => invoke("state_get"),

    // Engine picker is a no-op here (backend is built in), kept for API parity.
    chooseEngine: () => invoke("engine_status"),
    clearEngine: () => invoke("engine_status"),

    listDevices: () => invoke("list_devices"),
    scan: (udid) => invoke("scan", { udid: udid || null }),
    addManualCard: (cardId, label) => invoke("add_manual_card", { cardId, label: label || "" }),
    onCardDetected: (callback) => subscribe("card-detected", callback),

    applyDesign: (cardId, pngBytes, designId, designName, label) =>
      invoke("apply_design", {
        cardId,
        png: Array.from(pngBytes),
        designId: designId || null,
        designName: designName || "Custom",
        label: label || "",
      }),
    applyUpload: (cardId, pngBytes, name, label) =>
      invoke("apply_upload", {
        cardId,
        png: Array.from(pngBytes),
        name: name || "",
        label: label || "",
      }),
    undo: (cardId, udid) => invoke("undo_card", { cardId, udid: udid || null }),

    pushToPhone: (udid) => invoke("push_to_phone", { udid }),
    onApplyProgress: (callback) => subscribe("apply-progress", callback),

    skinUrl: (cardId) => invoke("skin_url", { cardId }),
    openExternal: (url) => invoke("open_external", { url }),
  };
})();
