const fs = require("fs");
const sharp = require("sharp");
const { desktopCapturer, screen } = require("electron");

class ScreenChecker {
  constructor() {
    this.screenMap = null;
    this.wordHash = null;
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

        // fs.writeFileSync(`${display.id}.png`, img);
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

  async textFinder({ screenMap, worker, numOfSections = 1 }) {
    this.wordHash = {};

    for (const sMap of Object.values(screenMap)) {
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
        } = await worker.recognize(sh);

        for (const word of words) {
          this.wordHash[word.text] = {
            x: word.bbox.x0 + bounds.x,
            y: word.bbox.y0 + 10 + bounds.y,
          };
        }
      }
    }
  }

  async checkColorAtPixel() {
    return true;
  }

}

module.exports = {
  ScreenChecker,
}
