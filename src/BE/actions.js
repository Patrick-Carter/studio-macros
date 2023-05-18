const { Key } = require("@nut-tree/nut-js");
const { MovementCoordinator } = require("./movement-coordinator");
const { getActiveApplicationName } = require("./window-info");

async function doAction(type, action, args) {
    if (type === 'export') {
        switch(action) {
            case 'audacity':
                return exportAudacity();
        }
    }
}

async function exportAudacity() {
    const appName = await getActiveApplicationName();
    console.log(appName);

    if (appName?.includes('audacity')) {
      const movementCoordinator = new MovementCoordinator();

      await movementCoordinator.inputKeyboardShortcut([
        Key.LeftShift,
        Key.LeftControl,
        Key.L,
      ]);
      await movementCoordinator.inputKeyboardShortcut([Key.Enter]);
      await movementCoordinator.inputKeyboardShortcut([Key.Enter]);

      return true;
    }

    return false;
}

module.exports = {
    doAction,
}