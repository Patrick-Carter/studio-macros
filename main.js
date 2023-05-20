const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const { createWorker } = require("tesseract.js");
const path = require("path");
const { doAction } = require("./src/BE/actions/actions-interpreter");
const AppState = require("./src/BE/globals");
require("electron-reload")(__dirname);

let tesWorker;
let dawFound = false;
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 850,
    height: 620,
    maxWidth: 850,
    maxHeight: 620,
    minWidth: 850,
    minHeight: 620,
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
    let intervalId = setInterval(async function () {
      try {
        const actionRan = await doAction(args.action, args.args);
        if (actionRan) {
          clearInterval(intervalId); // stop the interval after the action has ran
          event.reply("doAction", "done");
        }
      } catch (e) {
        clearInterval(intervalId);
        event.reply("doAction", "done");
        throw e;
      }
    }, 1000); // 1000 milliseconds = 1 second

    // let screenMap = await mapScreens();
    // let wordHash = await textFinder({screenMap, worker: tesWorker});
    // console.log("File", wordHash);
    // await movementCoordinator.moveToWord("File", wordHash);
    // await movementCoordinator.click();
    // await sleep(200);
  });
}

app.whenReady().then(async () => {
  tesWorker = await createWorker({
    //logger: (m) => console.log(m),
  });

  await tesWorker.loadLanguage("eng");
  await tesWorker.initialize("eng");

  // Register a 'Alt+Shift+Q' shortcut listener.
  const ret = globalShortcut.register("Alt+Shift+Q", () => {
    AppState.setAutomationIsRunning(false);
  });

  if (!ret) {
    console.log("registration failed");
  }

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("browser-window-created", async function (e, window) {});
