const { app, BrowserWindow, ipcMain } = require("electron");
const {
  sleep,
  mouse,
  getActiveWindow,
  getWindows,
  Key,
} = require("@nut-tree/nut-js");
const { createWorker } = require("tesseract.js");
const path = require("path");
const fs = require("fs");
const { mapScreens } = require("./src/BE/screenshot-helper");
const { textFinder } = require("./src/BE/text-scanner");
const { MovementCoordinator } = require("./src/BE/movement-coordinator");
const { exec } = require("child_process");
const { getActiveApplicationName } = require("./src/BE/window-info");
const { doAction } = require("./src/BE/actions");

require("electron-reload")(__dirname);

let tesWorker;
let dawFound = false;
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
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
      const actionRan = await doAction(args.type, args.action, args.args);
      if (actionRan) {
        clearInterval(intervalId); // stop the interval after the action has ran
      }
    }, 1000); // 1000 milliseconds = 1 second

    // let screenMap = await mapScreens();
    // let wordHash = await textFinder({screenMap, worker: tesWorker});
    // console.log("File", wordHash);
    // await movementCoordinator.moveToWord("File", wordHash);
    // await movementCoordinator.click();
    // await sleep(200);

    // screenMap = await mapScreens();
    // wordHash = await textFinder({screenMap, worker: tesWorker});
    // console.log("Export", wordHash);
    // await movementCoordinator.moveToWord("Export", wordHash);
    // await movementCoordinator.click();
    // await sleep(200);

    // screenMap = await mapScreens();
    // wordHash = await textFinder({screenMap, worker: tesWorker});
    // console.log("Multiple", wordHash);
    // await movementCoordinator.moveToWord("Multiple", wordHash);
    // await movementCoordinator.click();
    // await sleep(1000);

    // screenMap = await mapScreens();
    // wordHash = await textFinder({screenMap, worker: tesWorker});
    // console.log("Save", wordHash);
    // await movementCoordinator.moveToWord("Export", wordHash);
    // await movementCoordinator.click();
    // await sleep(1000);

    // screenMap = await mapScreens();
    // wordHash = await textFinder({screenMap, worker: tesWorker});
    // console.log("OK", wordHash);
    // await movementCoordinator.moveToWord("oK", wordHash);
    // await movementCoordinator.click();
  });
}

app.whenReady().then(async () => {
  tesWorker = await createWorker({
    //logger: (m) => console.log(m),
  });

  await tesWorker.loadLanguage("eng");
  await tesWorker.initialize("eng");

  // setInterval(async () => {
  //   console.log(await getActiveApplicationName());
  // }, 5000)

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("browser-window-created", async function (e, window) {
  // setInterval(async () => {
  // const windowRef = await getActiveWindow()
  // const [title] = await Promise.all([windowRef.title, windowRef.region])
  // console.log(title)
  // }, 15000)
  //   const target = new Point(0, 464);
  //   await mouse.setPosition(target);
  //   await sleep(50)
  //   await mouse.click(Button.LEFT);
  //   await sleep(3000)
  //   const addressBar = new Point(492, 95);
  //   await mouse.setPosition(addressBar);
  //   await sleep(50)
  //   await mouse.click(Button.LEFT);
  //   await keyboard.pressKey(Key.LeftControl, Key.A);
  //   await keyboard.releaseKey(Key.LeftControl, Key.A);
  //   await keyboard.type('https://nutjs.dev/API/mouse');
  //   await keyboard.pressKey(Key.Enter);
  //   await keyboard.releaseKey(Key.Enter);
  //   await sleep(3000)
  //   const closeWindow = new Point(1902, 52);
  //   await mouse.setPosition(closeWindow);
  //   await sleep(50)
  //   await mouse.click(Button.LEFT);
  //   await sleep(5000)
});
