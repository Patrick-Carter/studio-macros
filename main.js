const {
  app,
  BrowserWindow,
  ipcMain,
  desktopCapturer,
  screen,
} = require("electron");
const { sleep, mouse } = require("@nut-tree/nut-js");
const { createWorker } = require("tesseract.js");
const path = require("path");
const fs = require("fs");
const { mapScreens } = require("./src/scripts/screenshot-helper");
const { textFinder } = require("./src/scripts/text-scanner");
const { MovementCoordinator } = require("./src/scripts/movement-coordinator");

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

  ipcMain.on("screenshot", async (event, args) => {
    const movementCoordinator = new MovementCoordinator();
    console.log("hi");
    await sleep(5000);

    let screenMap = await mapScreens();
    let wordHash = await textFinder(screenMap, tesWorker);
    console.log("File", wordHash);
    await movementCoordinator.moveToWord(wordHash["File"] || wordHash["Fle"]);
    await movementCoordinator.click();
    await sleep(200);

    screenMap = await mapScreens();
    wordHash = await textFinder(screenMap, tesWorker);
    console.log("Export", wordHash);
    await movementCoordinator.moveToWord(
      wordHash["Export"] || wordHash["Expart"] || wordHash["Ecport"]
    );
    await movementCoordinator.click();
    await sleep(200);

    screenMap = await mapScreens();
    wordHash = await textFinder(screenMap, tesWorker);
    console.log("WAV", wordHash);
    await movementCoordinator.moveToWord(wordHash["WAV"]);
    await movementCoordinator.click();
    await sleep(1000);

    screenMap = await mapScreens();
    wordHash = await textFinder(screenMap, tesWorker);
    console.log("Save", wordHash);
    await movementCoordinator.moveToWord(wordHash["Save"] || wordHash[""]);
    await movementCoordinator.click();
    await sleep(200);

    screenMap = await mapScreens();
    wordHash = await textFinder(screenMap, tesWorker);
    console.log("OK", wordHash);
    await movementCoordinator.moveToWord(wordHash["OK"]);
    await movementCoordinator.click();
  });
}

app.whenReady().then(async () => {
  tesWorker = await createWorker({
    //logger: (m) => console.log(m),
  });

  await tesWorker.loadLanguage("eng");
  await tesWorker.initialize("eng");
  setInterval(async () => {
    console.log(await mouse.getPosition());
  }, 5000);
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
