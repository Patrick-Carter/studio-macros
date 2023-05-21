const {
  mouse,
  Point,
  Button,
  straightTo,
  sleep,
  keyboard,
  Key,
} = require("@nut-tree/nut-js");

class MovementCoordinator {
  constructor() {
    keyboard.config.autoDelayMs = 10;
  }

  async moveToWord(word, wordHash) {
    const key = this.findLooseMatchKey(word, wordHash);
    const foundWord = wordHash[key];

    console.log(key);

    if (!foundWord) {
      throw new Error(`No word provided ${word}`);
    }

    const target = new Point(foundWord.x, foundWord.y);
    console.log("Moving to", target);
    await mouse.setPosition(target);
    await sleep(100);
  }

  async click() {
    await mouse.click(Button.LEFT);
  }

  async setMousePosition({ x, y }) {
    await mouse.setPosition(new Point(x, y));
    await sleep(100);
  }

  async inputKeyboardShortcut(keys, sleepAmt = 1) {
    await keyboard.pressKey(...keys);
    await keyboard.releaseKey(...keys);
    sleep(sleepAmt);
  }

  async inputText(text) {
    await keyboard.type(text);
  }

  findLooseMatchKey(searchTerm, object) {
    const keys = Object.keys(object);
    let bestMatchKey = null;
    let bestMatchScore = Number.MAX_VALUE;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const score = this.calculateSimilarity(searchTerm, key);

      if (score < bestMatchScore) {
        bestMatchKey = key;
        bestMatchScore = score;
      }
    }

    return bestMatchKey;
  }

  // Example similarity calculation using Levenshtein distance
  calculateSimilarity(a, b) {
    const m = a.length;
    const n = b.length;
    const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      dp[i][0] = i;
    }

    for (let j = 1; j <= n; j++) {
      dp[0][j] = j;
    }

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }

    return dp[m][n];
  }
}

module.exports = {
  MovementCoordinator,
};
