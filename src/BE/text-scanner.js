const fs = require("fs");
const sharp = require("sharp");

async function textFinder({screenMap, worker, numOfSections = 1}) {
  const wordHash = {};

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
        wordHash[word.text] = {
          x: word.bbox.x0 + bounds.x,
          y: word.bbox.y0 + 10 + bounds.y,
        };
      }
    }
  }

  return wordHash;
}
module.exports = {
  textFinder,
};
