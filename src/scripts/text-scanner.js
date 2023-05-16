const fs = require("fs");
const sharp = require("sharp");

async function textFinder(screenMap, worker, whitelist) {
  const wordHash = {};

  for (const sMap of Object.values(screenMap)) {
    const { displayId, source, bounds } = sMap;

    const screenshot = await sharp(source.thumbnail.toJPEG(100)).grayscale().linear(2, -255).toBuffer();

    fs.writeFileSync(`${displayId}.png`, screenshot);

    const {
      data: { text, words },
    } = await worker.recognize(screenshot, 'eng');

    for (const word of words) {
      wordHash[word.text] = {
        x: word.bbox.x0 + bounds.x,
        y: word.bbox.y0 + 10 + bounds.y,
      };
    }
  }

  return wordHash;
}

module.exports = {
  textFinder,
};
