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
        fn: "inputKeyboardShortcut",
        args: { keys: actionTypes.initExport[daw][process.platform] },
        repeat: 1,
        controller: "movementCoordinator",
      },
      {
        fn: "inputKeyboardShortcut",
        args: { keys: actionTypes["Tab"][daw][process.platform] },
        repeat: 7,
        controller: "movementCoordinator",
      },
      {
        fn: "inputKeyboardShortcut",
        args: { keys: actionTypes["Enter"][daw][process.platform] },
        repeat: 1,
        controller: "movementCoordinator",
      },
      {
        fn: "inputText",
        args: exportDestination,
        repeat: 1,
        controller: "movementCoordinator",
      },
      {
        fn: "inputKeyboardShortcut",
        args: { keys: actionTypes["Tab"][daw][process.platform] },
        repeat: 9,
        controller: "movementCoordinator",
      },
      {
        fn: "inputKeyboardShortcut",
        args: { keys: actionTypes["Enter"][daw][process.platform] },
        repeat: 1,
      },
      {
        fn: "setMousePosition",
        args: { x: 1167, y: 456 },
        repeat: 1,
        controller: "movementCoordinator",
      },
      {
        fn: "click",
        args: null,
        repeat: 1,
        controller: "movementCoordinator",
      },
      {
        fn: "setMousePosition",
        args: { x: 1154, y: 476 },
        repeat: 1,
        controller: "movementCoordinator",
      },
      {
        fn: "checkColorAtPixel",
        args: null,
        repeat: 1,
        controller: "screenChecker",
        outcomeIfFalse: 'skip'
      },
      {
        fn: "click",
        args: null,
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
