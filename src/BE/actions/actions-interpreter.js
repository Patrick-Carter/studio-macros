const { MovementCoordinator } = require("../movement-coordinator");
const { getActiveApplicationName } = require("../window-info");
const { getActionDefinition } = require("./action-definitions");
const AppState = require("../globals");
const { sleep } = require("@nut-tree/nut-js");

async function doAction(action, args) {
  const isAutomationRunning = AppState.getAutomationIsRunning();

  if (isAutomationRunning) {
    console.log("automation already in progress");
    return;
  }

  AppState.setAutomationIsRunning(true);
  let automationRan = false;
  switch (action) {
    case "exportAudacity":
      automationRan = await exportAudacity();
      break;
  }
  AppState.setAutomationIsRunning(false);
  return automationRan;
}

async function exportAudacity() {
  const appName = await getActiveApplicationName();

  if (appName?.toLowerCase().includes("audacity")) {
    const movementCoordinator = new MovementCoordinator();
    const instructions = getActionDefinition("exportAudacity", "audacity");

    for (const instruction of instructions) {
      // const run = AppState.getAutomationIsRunning();
      // console.log('is running', run);
      // if (run) {
      //   return false
      // }
      await movementCoordinator[instruction.fn](instruction.args);
      //await sleep(5000);
    }

    return true;
  }

  return false;
}

module.exports = {
  doAction,
};
