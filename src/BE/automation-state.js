class AutomationState {
  constructor(event, ipcName) {
    this.signal = new AbortController();
    this.intervalId = null;
    this.event = null;
    this.ipcName = null;
    this.currentStep = 0;
    this.instructions = null;
    this.action = null;
  }

  abortAutomation() {
    this.signal.abort();
    this.instructions = null;
  }

  initAutomation(event, ipcName, action) {
    this.signal = new AbortController();
    this.event = event;
    this.ipcName = ipcName;
    this.action = action;
  }

  startAutomation(instructions, action) {
    clearInterval(this.intervalId);
    this.instructions = instructions;
    this.currentStep = 0;
  }

  endAutomation(message) {
    clearInterval(this.intervalId);
    this.event.reply(this.ipcName, message);
    this.signal = new AbortController();
    this.event = null;
    this.ipcName = null;
    this.intervalId = null;
    this.instructions = null;
    this.action = null;
  }

  getAutomationIsRunning() {
    return !!this.instructions;
  }
}

// Export a new instance that will be shared across all modules that import this
module.exports = new AutomationState();
