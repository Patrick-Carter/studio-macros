const {
  MovementCoordinator,
} = require("../action-controllers/movement-coordinator");
const { getActiveApplicationName } = require("../window-info");
const { getMacroDefinition } = require("./macro-definitions");
const AutomationState = require("../automation-state");
const { sleep } = require("@nut-tree/nut-js");
const { AutomationCancelledException } = require("../exceptions");
const { ScreenChecker } = require("../action-controllers/screen-checker");

async function doAction(action, args) {
  const isAutomationRunning = AutomationState.getAutomationIsRunning();

  if (isAutomationRunning) {
    console.log("automation already in progress");
    return;
  } else {
    console.log("automation not in progress");
  }

  const automationRan = await exportFromDaw(args, action);

  return automationRan;
}

const dawMapper = {
  exportAudacity: "audacity",
  exportFLStudio: "fl studio",
};

async function exportFromDaw(args, action) {
  {
    let appName = await getActiveApplicationName();

    if (appName?.toLowerCase().includes(dawMapper[action])) {
      AutomationState.startAutomation();
      const controllers = {
        movementCoordinator: new MovementCoordinator(),
        screenChecker: new ScreenChecker(),
      };

      const instructions = getMacroDefinition(
        action,
        action.replace("export", ""),
        args
      );

      let shouldDoAction = null;
      let prevInstruction = null;
      for (const instruction of instructions) {
        for (let i = 0; i < instruction.repeat; i++) {
          // checks for if we need to continue automation
          const automationRunning = AutomationState.getAutomationIsRunning();
          appName = await getActiveApplicationName();
          const correctWindowStillActive = appName
            ?.toLowerCase()
            .includes(dawMapper[action]);
          if (!automationRunning || !correctWindowStillActive) {
            throw new AutomationCancelledException("Automation was cancelled");
          }

          // if the prev action was a 'screenChecker' shouldDoAction will be true or false
          if (
            shouldDoAction === false && prevInstruction
          ) {
            shouldDoAction = null;
            if (prevInstruction.outcomeIfFalse === "skip") {
              continue;
            } else if (prevInstruction.outcomeIfFalse === "cancel") {
              throw new AutomationCancelledException(
                "Automation was cancelled"
              );
            } else {
              throw new Error(
                `Unknown outcomeIfFalse value: ${prevInstruction.outcomeIfFalse}`
              );
            }
          }

          shouldDoAction = await controllers[instruction.controller][
            instruction.fn
          ](instruction.args);

          prevInstruction = instruction;
          await sleep(1000);
        }
      }

      return true;
    }

    return false;
  }
}

module.exports = {
  doAction,
};
