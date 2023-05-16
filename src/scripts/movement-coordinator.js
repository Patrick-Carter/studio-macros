const { mouse, Point, Button, straightTo, sleep } = require("@nut-tree/nut-js");

class MovementCoordinator {
  constructor() {}

  async moveToWord(word) {
    if (!word) {
      throw new Error(`No word provided ${word}`);
    }

    const target = new Point(word.x, word.y);
    console.log("Moving to", target);
    await mouse.setPosition(target);
    await sleep(50);
  }

  async click() {
    await mouse.click(Button.LEFT);
  }
}

// async function moveToWord(word) {
//   if (!word) {
//     throw new Error("No word provided");
//   }

//   const target = new Point(word.x, word.y);
//   await mouse.move(straightTo(target));
//   return mouse;
// }

module.exports = {
  MovementCoordinator,
};
