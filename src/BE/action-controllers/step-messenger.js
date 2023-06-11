const automationState = require("../automation-state");

class StepMessenger {
    sendMessage({ message }) {
        automationState.event.sender.send('stepMessage', message);
    }
}

module.exports = {
    StepMessenger,
  };
  