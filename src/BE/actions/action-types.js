const { Key } = require("@nut-tree/nut-js");

const allDaws = ["Audacity", "ProTools", "FLStudio", "StudioOne"];
const allPlatforms = ["win32", "linux", "mac"];

const allKeys = Object.values(Key);
const halfIndex = Math.ceil(allKeys.length / 2);

const keyNames = allKeys.slice(0, halfIndex);

let actionTypes = {};

keyNames.forEach((keyName) => {
  actionTypes[keyName] = {};
  allDaws.forEach((daw) => {
    actionTypes[keyName][daw] = {
      win32: [Key[keyName]],
      linux: [Key[keyName]],
      mac: [Key[keyName]],
    };
  });
});

actionTypes.initExport = {
  Audacity: {
    win32: [Key.LeftShift, Key.LeftControl, Key.L],
    linux: [Key.LeftShift, Key.LeftControl, Key.L],
    mac: [],
  },
  ProTools: {
    win32: [Key.LeftShift, Key.LeftControl, Key.L],
    linux: [Key.LeftShift, Key.LeftControl, Key.L],
    mac: [],
  },
  FLStudio: {
    win32: [Key.LeftControl, Key.R],
    linux: [Key.LeftControl, Key.R],
    mac: [],
  },
  StudioOne: {
    win32: [Key.LeftControl, Key.LeftShift, Key.E],
    linux: [Key.LeftControl, Key.LeftShift, Key.E],
    mac: [],
  },
};

module.exports = {
  actionTypes,
};
