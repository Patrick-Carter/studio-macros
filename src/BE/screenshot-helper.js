const { desktopCapturer, screen } = require("electron");
const fs = require("fs");

async function mapScreens() {
  const screenMap = {};

  const displays = screen.getAllDisplays();

  const promises = displays.map(async (display) => {
    screenMap[String(display.id)] = {
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
        if (process.platform === 'linux') {
          const screenSize = source.thumbnail.getSize();
          if (screenSize.width === display.size.width && screenSize.height === display.size.height && !screenMap[display.id].source) {
            screenMap[display.id].source = source
          }
        } else {
          // this is tested on windows
          if (String(source.display_id) === String(display.id)) {
            screenMap[display.id].source = source;
          }

        }
      }


    } catch (error) {
      console.error("Failed to get screen source:", error);
    }
  });

  await Promise.all(promises);

  return screenMap;
}

module.exports = {
  mapScreens,
};
