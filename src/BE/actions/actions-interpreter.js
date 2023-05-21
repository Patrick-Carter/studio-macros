const { MovementCoordinator } = require("../movement-coordinator");
const { getActiveApplicationName } = require("../window-info");
const { getActionDefinition } = require("./action-definitions");
const AutomationState = require("../automation-state");
const { sleep } = require("@nut-tree/nut-js");
const { AutomationCancelledException } = require("../exceptions");

async function doAction(action, args) {
  const isAutomationRunning = AutomationState.getAutomationIsRunning();

  if (isAutomationRunning) {
    console.log("automation already in progress");
    return;
  } else {
    console.log("automation not in progress");
  }

  let automationRan = false;
  switch (action) {
    case "exportAudacity":
      automationRan = await exportAudacity(args);
      break;
    case "exportFLStudio":
      automationRan = await exportFLStudio(args);
      break;
  }
  return automationRan;
}

async function exportAudacity(args) {
  const appName = await getActiveApplicationName();

  if (appName?.toLowerCase().includes("audacity")) {
    AutomationState.startAutomation();
    const movementCoordinator = new MovementCoordinator();
    const instructions = getActionDefinition("exportAudacity", "Audacity", args);

    for (const instruction of instructions) {
      // const run = AutomationState.getAutomationIsRunning();
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

async function exportFLStudio(args) {
  const appName = await getActiveApplicationName();

  if (appName?.toLowerCase().includes("fl studio")) {
    AutomationState.startAutomation();
    const movementCoordinator = new MovementCoordinator();
    const instructions = getActionDefinition("exportFLStudio", "FLStudio", args);

    for (const instruction of instructions) {
      for (let i = 0; i < instruction.repeat; i++) {
        const run = AutomationState.getAutomationIsRunning();
        if (!run) {
          throw new AutomationCancelledException("Automation was cancelled");
        }
        await movementCoordinator[instruction.fn](instruction.args);
        await sleep(1000);
      }
    }

    return true;
  }

  return false;
}

module.exports = {
  doAction,
};
