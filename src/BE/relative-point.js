const { Point, screen } = require("@nut-tree/nut-js");

class RelativePoint extends Point {
  constructor(x, y, screenWidth, screenHeight) {
    const relativeX = x / screenWidth;
    const relativeY = y / screenHeight;
    super(relativeX, relativeY);
  }
}

module.exports = {
  RelativePoint,
};
