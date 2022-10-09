import SimulatedRealClock from "./SimulatedRealClock";
import TimeOut from "./TimeOut";

class OMS {
  private sim_real_clock: SimulatedRealClock;
  private five_sec_order_time_out_management: TimeOut;

  constructor(
    sim_real_clock: SimulatedRealClock,
    timer: number = 5000,
    onTimeOut: Function | undefined = undefined
  ) {
    this.sim_real_clock = sim_real_clock;
    let time_to_stop = sim_real_clock.getTime();
    time_to_stop = time_to_stop ? time_to_stop + timer : Date.now() + timer;
    this.five_sec_order_time_out_management = new TimeOut(
      sim_real_clock,
      time_to_stop,
      onTimeOut || this.onTimeOut
    );
  }

  onTimeOut() {
    console.log("Order Timout Please Take Action");
  }

  receive_market_response() {
    this.five_sec_order_time_out_management.setDisabled(true);
  }

  send_order() {
    this.five_sec_order_time_out_management.setDisabled(false);
    this.five_sec_order_time_out_management.run();
    console.log("send order");
  }
}
export default OMS;
