import SimulatedRealClock from "./SimulatedRealClock";
import TimeOut from "./TimeOut";

class OMS {
  private sim_real_clock: SimulatedRealClock;
  private five_sec_order_time_out_management: TimeOut;

  constructor(sim_real_clock: SimulatedRealClock) {
    this.sim_real_clock = sim_real_clock;
    this.five_sec_order_time_out_management = new TimeOut(
      sim_real_clock,
      sim_real_clock.getTime() || 0 + 5000,
      this.onTimeOut
    );
  }

  onTimeOut() {
    this.five_sec_order_time_out_management.setDisabled(false);
    this.five_sec_order_time_out_management.run();
    console.log("send order");
  }

  receive_market_response() {
    this.five_sec_order_time_out_management.setDisabled(true);
  }

  send_order() {
    console.log("Order Timout Please Take Action");
  }
}
export default OMS;
