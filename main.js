const { app, BrowserWindow, ipcMain, globalShortcut, dialog } = require("electron");
const { createWorker } = require("tesseract.js");
const path = require("path");
const { doAction, continueAutomation } = require("./src/BE/actions/macro-interpreter");
const AutomationState = require("./src/BE/automation-state");
require("electron-reload")(__dirname);
const { mouse } = require("@nut-tree/nut-js");
const { getActiveApplicationName } = require("./src/BE/window-info");
const { AutomationCancelledException } = require("./src/BE/exceptions");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 850,
    height: 580,
    minWidth: 460,
    minHeight: 500,
    webPreferences: {
      preload: path.join(__dirname, "/src/preload.js"),
      contextIsolation: true, // protect against prototype pollution
      nodeIntegration: false, // is default value after Electron v5
      enableRemoteModule: false, // turn off remote
    },
  });

  const startUrl =
    process.env.NODE_ENV !== "production"
      ? "http://localhost:8080"
      : url.format({
          pathname: path.join(__dirname, "/dist/index.html"),
          protocol: "file:",
          slashes: true,
        });

  mainWindow.loadURL(startUrl);

  ipcMain.on("doAction", async (event, args) => {
    AutomationState.initAutomation(event, "doAction", args.action);
    AutomationState.intervalId = setInterval(async function () {
      try {
        await doAction(args.action, args.args);
      } catch (e) {
        if (e instanceof AutomationCancelledException) {
          console.log("Automation cancelled");
          AutomationState.endAutomation("cancelled");
        } else {
          AutomationState.endAutomation("error");
          throw e;
        }
      }
    }, 1000); // 1000 milliseconds = 1 second
  });

  ipcMain.on("continueAutomation", async (event, args) => {
    const intervalId = setInterval(async function () {
      try {
        await continueAutomation(intervalId);
      } catch (e) {
        if (e instanceof AutomationCancelledException) {
          console.log("Automation cancelled");
          AutomationState.endAutomation("cancelled");
        } else {
          AutomationState.endAutomation("error");
          throw e;
        }
      }
    }, 1000);
  });

  ipcMain.on("selectDirectory", async (event, args) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });

    event.reply("selectDirectory", result.filePaths[0]);
  });
}

app.whenReady().then(async () => {
  // Register a 'Alt+Shift+Q' shortcut listener.
  const ret = globalShortcut.register("Alt+Shift+Q", () => {
    console.log("Alt+Shift+Q is pressed");
    if (AutomationState.event) {
      AutomationState.endAutomation("cancelled");
    }
  });

  if (!ret) {
    console.log("registration failed");
  }

  setInterval(async function () {
    // const pos = await mouse.getPosition();
    const appName = await getActiveApplicationName();
    // const sig = AutomationState.getAutomationIsRunning();
    // console.log(pos.x / 2560, pos.y / 1440);
    console.log(appName);
    //console.log(sig);
  }, 1000);

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("browser-window-created", async function (e, window) {});
