const { app, BrowserWindow, ipcMain, desktopCapturer, screen } = require('electron');
const { mouse, Point, Button, keyboard, Key, sleep, getActiveWindow, straightTo, getWindows } = require("@nut-tree/nut-js");
const { createWorker } = require('tesseract.js');
const path = require('path');
const fs = require('fs');

require('electron-reload')(__dirname);

let tesWorker;
let dawFound = false;
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '/src/preload.js'),
      contextIsolation: true, // protect against prototype pollution
      nodeIntegration: false, // is default value after Electron v5
      enableRemoteModule: false, // turn off remote
    },
  });

  const startUrl = process.env.NODE_ENV !== 'production'
    ? 'http://localhost:8080'
    : url.format({
      pathname: path.join(__dirname, '/dist/index.html'),
      protocol: 'file:',
      slashes: true,
    });

  mainWindow.loadURL(startUrl);

  ipcMain.on('screenshot', async (event, args) => {
    console.log('hi');
    await sleep(5000);
    desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 3840, height: 2160 } })
      .then(async (sources) => {
        const displays = screen.getAllDisplays();
        
        for (const display of displays) {
          console.log(display);
        }

        for (const source of sources) {
          fs.writeFileSync(`screenshot${Math.random()}`, source.thumbnail.toPNG());
          console.log(source);
          // try {
          //   console.log(source.thumbnail.getSize())
          //   const screenshot = source.thumbnail.toPNG();
          //   source.
          //   const wordHash = {};

          //   const { data: { text, words } } = await tesWorker.recognize(screenshot);

          //   for (const word of words) {
          //     if (word.text === 'Audacity') {
          //       dawFound = true;
          //       const target = new Point(word.bbox.x0, word.bbox.y0);
          //       await mouse.move(straightTo(target));
          //       await mouse.click(Button.LEFT);

          //     }
          //     wordHash[word.text] = {x: word.bbox.x0, y: word.bbox.y0};
          //   }

          //   console.log(wordHash);

          //   if (dawFound === true) {
          //     const filePoint = new Point(wordHash['File'].x, wordHash['File'].y);
          //     await mouse.move(straightTo(filePoint));
          //     await mouse.click(Button.LEFT);
          //   }




          //   if (dawFound) {
          //     event.reply('screenshot', 'daw found');
          //   } else {
          //     event.reply('screenshot', 'daw not found');
          //   }
          // } catch (error) {
          //   console.error('Failed to capture screenshot:', error);
          // }
        }

      })
      .catch((error) => {
        console.error('Failed to get screen source:', error);
        //event.sender.send('screenshot-error', error.message);
      });




  });
}

app.whenReady().then(async () => {
  tesWorker = await createWorker({
    logger: m => console.log(m)
  });

  await tesWorker.loadLanguage('eng');
  await tesWorker.initialize('eng');

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('browser-window-created', async function (e, window) {
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
