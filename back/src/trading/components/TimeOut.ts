import SimulatedRealClock from "./SimulatedRealClock";
class TimeOut {
  private time_to_stop: number;
  private sim_real_clock;
  private callback: Function;
  private disabled: boolean;

  constructor(
    sim_real_clock: SimulatedRealClock,
    time_to_stop: number,
    callback: Function
  ) {
    this.time_to_stop = time_to_stop;
    this.sim_real_clock = sim_real_clock;
    this.callback = callback;
    this.disabled = false;
  }

  public getDisabled(): boolean {
    return this.disabled;
  }

  public setDisabled(value: boolean) {
    this.disabled = value;
  }

  private sleep() {
    setTimeout(() => {
      this.run();
    }, 1000);
  }

  run() {
    if (
      !this.disabled &&
      (this.sim_real_clock.getTime() || 0) < this.time_to_stop
    ) {
      this.sleep();
    } else if (!this.disabled) {
      this.callback();
    }
  }
}

export default TimeOut;
