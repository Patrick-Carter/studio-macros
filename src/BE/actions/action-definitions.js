const { actionTypes } = require("./action-types");

function getActionDefinition(action, daw, { exportDestination }) {
  const actionDefinitions = {
    exportAudacity: [
      {
        fn: "inputKeyboardShortcut",
        args: actionTypes.initExport[daw][process.platform],
        repeat: 1,
      },
      {
        fn: "inputKeyboardShortcut",
        args: actionTypes["Enter"][daw][process.platform],
        repeat: 2,
      },
    ],
    exportFLStudio: [
      {
        fn: "inputKeyboardShortcut",
        args: actionTypes.initExport[daw][process.platform],
        repeat: 1,
      },
      {
        fn: "inputKeyboardShortcut",
        args: actionTypes["Tab"][daw][process.platform],
        repeat: 7,
      },
      {
        fn: "inputKeyboardShortcut",
        args: actionTypes["Enter"][daw][process.platform],
        repeat: 1,
      },
      {
        fn: "inputText",
        args: exportDestination,
        repeat: 1,
      },
      {
        fn: "inputKeyboardShortcut",
        args: actionTypes["Tab"][daw][process.platform],
        repeat: 9,
      },
      {
        fn: "inputKeyboardShortcut",
        args: actionTypes["Enter"][daw][process.platform],
        repeat: 1,
      },
      {
        fn: "setMousePosition",
        args: { x: 1167, y: 456 },
        repeat: 1,
      },
      {
        fn: "click",
        args: null,
        repeat: 1,
      },
      {
        fn: "setMousePosition",
        args: { x: 1154, y: 476 },
        repeat: 1,
      },
      {
        fn: "click",
        args: null,
        repeat: 1,
      },
    ],
  };

  return actionDefinitions[action];
}

module.exports = {
  getActionDefinition,
};
