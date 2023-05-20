class AppState {
  constructor() {
    this.signal = new AbortController();
  }

  setAutomationIsRunning(isRunning) {
    if (isRunning) {
      this.signal = new AbortController();
    }
    this.signal.abort();
  }

  getAutomationIsRunning() {
    if (this.signal.aborted) {
      this.signal = new AbortController();
      return true;
    }
    return this.signal.aborted;
  }
}

// Export a new instance that will be shared across all modules that import this
module.exports = new AppState();
