const fs = require("fs");
const sharp = require("sharp");
const { desktopCapturer, screen } = require("electron");
const { createWorker } = require("tesseract.js");
const { mouse } = require("@nut-tree/nut-js");
const PNG = require('pngjs').PNG;
class ScreenChecker {
  constructor() {
    this.screenMap = null;
    this.wordHash = null;
    this.worker = null;
  }

  async setupWorker() {
    if (this.worker !== null) {
      return;
    }

    this.worker = await createWorker({
      //logger: (m) => console.log(m),
    });

    await worker.loadLanguage("eng");
    await worker.initialize("eng");
  }
  async mapScreens() {
    this.screenMap = {};

    const displays = screen.getAllDisplays();

    const promises = displays.map(async (display) => {
      this.screenMap[String(display.id)] = {
        bounds: display.bounds,
        displayId: String(display.id),
        source: null,
      };

      try {
        const sources = await desktopCapturer.getSources({
          types: ["screen"],
          thumbnailSize: {
            width: display.bounds.width,
            height: display.bounds.height,
          },
        });

        // const img = await screenshot({
        //   format: "png",
        // });

        //fs.writeFileSync(`${display.id}.png`, img);
        for (const source of sources) {
          if (process.platform === "linux") {
            const screenSize = source.thumbnail.getSize();
            if (
              screenSize.width === display.size.width &&
              screenSize.height === display.size.height &&
              !this.screenMap[display.id].source
            ) {
              this.screenMap[display.id].source = source;
            }
          } else {
            // this is tested on windows
            if (String(source.display_id) === String(display.id)) {
              this.screenMap[display.id].source = source;
            }
          }
        }
      } catch (error) {
        console.error("Failed to get screen source:", error);
      }
    });

    await Promise.all(promises);
  }

  async textFinder({ numOfSections = 1 }) {
    await this.setupWorker();
    this.wordHash = {};

    for (const sMap of Object.values(this.screenMap)) {
      const { displayId, source, bounds } = sMap;

      const screenshot = await sharp(source.thumbnail.toPNG(100))
        .greyscale()
        .toBuffer();

      const imgInfo = await sharp(screenshot).metadata();

      const sectionHeight = Math.floor(imgInfo.height / numOfSections);
      const screenShots = [];

      for (let i = 0; i < numOfSections; i++) {
        const top = i * sectionHeight;

        screenShots.push(
          await sharp(screenshot)
            .extract({
              top,
              left: 0,
              width: imgInfo.width,
              height: sectionHeight,
            })
            .toBuffer()
        );
      }

      screenShots.forEach((s, i) => {
        fs.writeFileSync(`${displayId}-${i}.png`, s);
      });

      // fs.writeFileSync(`${displayId}.png`, screenshot);
      for (const sh of screenShots) {
        const {
          data: { text, words },
        } = await this.worker.recognize(sh);

        for (const word of words) {
          this.wordHash[word.text] = {
            x: word.bbox.x0 + bounds.x,
            y: word.bbox.y0 + 10 + bounds.y,
          };
        }
      }
    }
  }

  async checkColorAtPixel({ keepCurrentScreenData = false, expectedColor }) {
    if (!keepCurrentScreenData || !this.screenMap) {
      await this.mapScreens();
    }

    if (!expectedColor) {
      throw new Error('No Color Speficied To Check');
    }

    for (let screen of Object.values(this.screenMap)) {
      const { source } = screen;
      const screenshot = await sharp(source.thumbnail.toPNG(100))
        .toBuffer();
      const mousePos = await mouse.getPosition();
      let matches = await this.checkPixelColor(screenshot, mousePos.x, mousePos.y, expectedColor, 0.8);
      if (matches) {
        return true;
      }
    }
    return false;
  }

  async checkPixelColor(imageBuffer, x, y, expectedColor, tolerance = 0.8) {
    return new Promise((resolve, reject) => {
      new PNG().parse(imageBuffer, function (error, data) {
        if (error) {
          reject(error);
          return;
        }

        let idx = (data.width * y + x) << 2;
        let actualColor = [data.data[idx], data.data[idx + 1], data.data[idx + 2]];

        // Calculate Euclidean distance
        let distance = Math.sqrt(
          Math.pow(actualColor[0] - expectedColor[0], 2) +
          Math.pow(actualColor[1] - expectedColor[1], 2) +
          Math.pow(actualColor[2] - expectedColor[2], 2)
        );

        // Normalize to the range [0, 1]. The maximum possible Euclidean distance in RGB space is sqrt(3 * (255^2)) ~= 441.673
        let similarity = 1 - (distance / 441.673);

        resolve(similarity >= tolerance);
      });
    });
  }
}

module.exports = {
  ScreenChecker,
};
