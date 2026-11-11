"use strict";

const { contextBridge, ipcRenderer } = require("electron");

// Clean, explicit bridge between sandboxed renderer and Node.
contextBridge.exposeInMainWorld("veyro", {
  getState: () => ipcRenderer.invoke("state:get"),
  engineStatus: () => ipcRenderer.invoke("engine:status"),
  chooseEngine: () => ipcRenderer.invoke("engine:choose"),
  clearEngine: () => ipcRenderer.invoke("engine:clear"),

  listDevices: () => ipcRenderer.invoke("device:list"),
  scan: (udid) => ipcRenderer.invoke("device:scan", udid),
  addManualCard: (cardId, label) => ipcRenderer.invoke("card:addManual", { cardId, label }),
  onCardDetected: (callback) => {
    const handler = (_event, card) => callback(card);
    ipcRenderer.on("device:card-detected", handler);
    return () => ipcRenderer.removeListener("device:card-detected", handler);
  },

  applyDesign: (cardId, pngBytes, designId, designName, label) =>
    ipcRenderer.invoke("card:applyDesign", { cardId, pngBytes, designId, designName, label }),
  applyUpload: (cardId, pngBytes, name, label) =>
    ipcRenderer.invoke("card:applyUpload", { cardId, pngBytes, name, label }),
  undo: (cardId, udid) => ipcRenderer.invoke("card:undo", { cardId, udid }),

  pushToPhone: (udid) => ipcRenderer.invoke("device:apply", udid),
  onApplyProgress: (callback) => {
    const handler = (_event, p) => callback(p);
    ipcRenderer.on("device:progress", handler);
    return () => ipcRenderer.removeListener("device:progress", handler);
  },

  skinUrl: (cardId) => ipcRenderer.invoke("skin:url", cardId),
  openExternal: (url) => ipcRenderer.invoke("app:open", url),
});
