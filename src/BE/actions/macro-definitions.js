const { actionTypes } = require("./action-types");

function getMacroDefinition(action, daw, { exportDestination }) {
  const actionDefinitions = {
    exportAudacity: [
      {
        fn: "inputKeyboardShortcut",
        args: { keys: actionTypes.initExport[daw][process.platform] },
        repeat: 1,
        controller: "movementCoordinator",
      },
      {
        fn: "inputKeyboardShortcut",
        args: { keys: actionTypes["Enter"][daw][process.platform] },
        repeat: 2,
        controller: "movementCoordinator",
      },
    ],
    exportFLStudio: [
      {
        fn: "sendMessage",
        args: { message: 'test' },
        repeat: 1,
        controller: "stepMessenger",
      },
      {
        fn: "sendMessage",
        args: { message: 'step two' },
        repeat: 1,
        controller: "stepMessenger",
      },
      {
        fn: "inputKeyboardShortcut",
        args: { keys: actionTypes.initExport[daw][process.platform] },
        repeat: 1,
        controller: "movementCoordinator",
      },
      // {
      //   fn: "inputKeyboardShortcut",
      //   args: { keys: actionTypes.initExport[daw][process.platform] },
      //   repeat: 1,
      //   controller: "movementCoordinator",
      // },
      // {
      //   fn: "inputKeyboardShortcut",
      //   args: {
      //     keys: [
      //       actionTypes["LeftAlt"][daw][process.platform][0],
      //       actionTypes["D"][daw][process.platform][0],
      //     ],
      //   },
      //   repeat: 1,
      //   controller: "movementCoordinator",
      // },
      // {
      //   fn: "inputText",
      //   args: { text: exportDestination },
      //   repeat: 1,
      //   controller: "movementCoordinator",
      // },
      // {
      //   fn: "inputKeyboardShortcut",
      //   args: { keys: actionTypes["Enter"][daw][process.platform] },
      //   repeat: 4,
      //   controller: "movementCoordinator",
      // },
      // {
      //   fn: "setMousePosition",
      //   args: { x: 0.45585, y: 0.3166 },
      //   repeat: 1,
      //   controller: "movementCoordinator",
      // },
      // {
      //   fn: "click",
      //   args: {},
      //   repeat: 1,
      //   controller: "movementCoordinator",
      // },
      // {
      //   fn: "setMousePosition",
      //   args: { x: 0.45078, y: 0.3305 },
      //   repeat: 1,
      //   controller: "movementCoordinator",
      // },
      // {
      //   fn: "click",
      //   args: {},
      //   repeat: 1,
      //   controller: "movementCoordinator",
      // },
      // {
      //   fn: "setMousePosition",
      //   args: { x: 0.479296875, y: 0.3854166666666667 },
      //   repeat: 1,
      //   controller: "movementCoordinator",
      // },
      // {
      //   fn: "click",
      //   args: {},
      //   repeat: 1,
      //   controller: "movementCoordinator",
      // },
      // {
      //   fn: "setMousePosition",
      //   args: { x: 0.476171875, y: 0.4263888888888889 },
      //   repeat: 1,
      //   controller: "movementCoordinator",
      // },
      // {
      //   fn: "click",
      //   args: {},
      //   repeat: 1,
      //   controller: "movementCoordinator",
      // },
      // {
      //   fn: "setMousePosition",
      //   args: { x: 0.5015625, y: 0.5930555555555556 },
      //   repeat: 1,
      //   controller: "movementCoordinator",
      // },
      // {
      //   fn: "checkColorAtPixel",
      //   args: { keepCurrentScreenData: false, expectedColor: [239, 133, 96] },
      //   repeat: 1,
      //   controller: "screenChecker",
      //   outcomeIfFalse: "skip",
      // },
      // {
      //   fn: "click",
      //   args: {},
      //   repeat: 1,
      //   controller: "movementCoordinator",
      // },
      // {
      //   fn: "setMousePosition",
      //   args: { x: 0.5015625, y: 0.6090277777777777 },
      //   repeat: 1,
      //   controller: "movementCoordinator",
      // },
      // {
      //   fn: "checkColorAtPixel",
      //   args: { keepCurrentScreenData: true, expectedColor: [239, 133, 96] },
      //   repeat: 1,
      //   controller: "screenChecker",
      //   outcomeIfFalse: "skip",
      // },
      // {
      //   fn: "click",
      //   args: {},
      //   repeat: 1,
      //   controller: "movementCoordinator",
      // },
      // {
      //   fn: "setMousePosition",
      //   args: { x: 0.5015625, y: 0.5631944444444444 },
      //   repeat: 1,
      //   controller: "movementCoordinator",
      // },
      // {
      //   fn: "checkColorAtPixel",
      //   args: { keepCurrentScreenData: true, expectedColor: [86, 93, 96] },
      //   repeat: 1,
      //   controller: "screenChecker",
      //   outcomeIfFalse: "skip",
      // },
      // {
      //   fn: "click",
      //   args: {},
      //   repeat: 1,
      //   controller: "movementCoordinator",
      // },
      // {
      //   fn: "inputKeyboardShortcut",
      //   args: { keys: actionTypes["Enter"][daw][process.platform] },
      //   repeat: 1,
      //   controller: "movementCoordinator",
      // },
    ],
    mesageTest: [
      {
        fn: "sendMessage",
        args: { message: 'test' },
        repeat: 1,
        controller: "stepMessenger",
      },
      {
        fn: "sendMessage",
        args: { message: 'step two' },
        repeat: 1,
        controller: "stepMessenger",
      },
      {
        fn: "inputKeyboardShortcut",
        args: { keys: actionTypes.initExport[daw][process.platform] },
        repeat: 1,
        controller: "movementCoordinator",
      },
    ],
  };

  return actionDefinitions[action];
}

module.exports = {
  getMacroDefinition,
};
