const { MovementCoordinator } = require("../action-controllers/movement-coordinator");
const { getActiveApplicationName } = require("../window-info");
const { getMacroDefinition } = require("./macro-definitions");
const AutomationState = require("../automation-state");
const { sleep } = require("@nut-tree/nut-js");
const { AutomationCancelledException } = require("../exceptions");
const { ScreenChecker } = require("../action-controllers/screen-checker");
const { StepMessenger } = require("../action-controllers/step-messenger");

async function doAction(action, args) {
  const automationRunning = AutomationState.getAutomationIsRunning();

  if (automationRunning) {
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
  exportStudioOne: 'studio one'
};

async function exportFromDaw(args, action) {
  {
    const targetApplicationIsFocused = await checkIfTargetApplicationIsFocus();

    if (targetApplicationIsFocused) {
      const instructions = getMacroDefinition(action, action.replace("export", ""), args);

      AutomationState.startAutomation(instructions);
      return runInstructions(instructions);
    }

    return false;
  }
}

async function continueAutomation(intervalId) {
  const targetApplicationIsFocused = await checkIfTargetApplicationIsFocus();

  if (targetApplicationIsFocused) {
    clearInterval(intervalId);
    return runInstructions();
  }

  return false;
}

async function checkIfTargetApplicationIsFocus() {
  let appName = await getActiveApplicationName();

  if (appName?.toLowerCase().includes(dawMapper[AutomationState.action])) {
    return true;
  }

  return false;
}

async function runInstructions() {
  const controllers = {
    movementCoordinator: new MovementCoordinator(),
    screenChecker: new ScreenChecker(),
    stepMessenger: new StepMessenger(),
  };

  let shouldDoAction = null;
  let prevInstruction = null;
  for (let i = AutomationState.currentStep; i < AutomationState.instructions.length; i++) {
    let instruction = AutomationState.instructions[i];

    for (let j = 0; j < instruction.repeat; j++) {
      // checks for if we need to continue automation
      const automationRunning = AutomationState.getAutomationIsRunning();
      appName = await getActiveApplicationName();

      const correctWindowStillActive = appName?.toLowerCase().includes(dawMapper[AutomationState.action]);

      // if the instruction is a message, display that and wait for return
      if (instruction.controller === "stepMessenger") {
        await controllers[instruction.controller][instruction.fn](instruction.args);
        AutomationState.currentStep++;
        return true;
      }

      if (!automationRunning || !correctWindowStillActive) {
        throw new AutomationCancelledException("Automation was cancelled");
      }

      // if the prev action was a 'screenChecker' shouldDoAction will be true or false
      if (shouldDoAction === false && prevInstruction) {
        shouldDoAction = null;
        if (prevInstruction.outcomeIfFalse === "skip") {
          continue;
        } else if (prevInstruction.outcomeIfFalse === "cancel") {
          throw new AutomationCancelledException("Automation was cancelled");
        } else {
          throw new Error(`Unknown outcomeIfFalse value: ${prevInstruction.outcomeIfFalse}`);
        }
      }

      shouldDoAction = await controllers[instruction.controller][instruction.fn](instruction.args);

      prevInstruction = instruction;
      AutomationState.currentStep++;
      await sleep(1000);
    }
  }

  AutomationState.endAutomation("done");
  return true;
}

module.exports = {
  doAction,
  continueAutomation,
};
