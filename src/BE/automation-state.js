class AutomationState {
  constructor(event, ipcName) {
    this.signal = new AbortController();
    this.automationIsRunning = false;
    this.intervalId = null;
    this.event = null;
    this.ipcName = null;
  }

  abortAutomation() {
    this.signal.abort();
    this.automationIsRunning = false;
  }

  initAutomation(event, ipcName) {
    this.signal = new AbortController();
    this.event = event;
    this.ipcName = ipcName;
  }

  startAutomation() {
    clearInterval(this.intervalId);
    this.automationIsRunning = true;
  }

  endAutomation(message) {
    clearInterval(this.intervalId);
    this.event.reply(this.ipcName, message);
    this.signal = new AbortController();
    this.event = null;
    this.ipcName = null;
    this.intervalId = null;
    this.automationIsRunning = false;
  }

  getAutomationIsRunning() {
    return this.automationIsRunning;
  }
}

// Export a new instance that will be shared across all modules that import this
module.exports = new AutomationState();
