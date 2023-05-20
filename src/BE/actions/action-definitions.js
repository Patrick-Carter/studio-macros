const { actionTypes } = require("./action-types");

function getActionDefinition(action, daw) {
  const actionDefinitions = {
    exportAudacity: [
      {
        fn: "inputKeyboardShortcut",
        args: actionTypes.initExport[daw][process.platform],
      },
      {
        fn: "inputKeyboardShortcut",
        args: actionTypes["Enter"][daw][process.platform],
      },
      {
        fn: "inputKeyboardShortcut",
        args: actionTypes["Enter"][daw][process.platform],
      },
    ],
  };

  return actionDefinitions[action];
}

module.exports = {
  getActionDefinition,
};
