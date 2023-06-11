const { contextBridge, ipcRenderer } = require("electron");

const sharedChannels = ["doAction", "selectDirectory", "stepMessage"];

contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => {
    // whitelist channels
    let validChannels = [...sharedChannels, "continueAutomation"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = [...sharedChannels, "stepMessage"];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
