import { Order } from "../../types/order";
class SimulatedRealClock {
  simulated: boolean;
  simulated_time: null;

  constructor(simulated = false) {
    this.simulated = simulated;
    this.simulated_time = null;
  }

  process_order(order: any) {
    this.simulated_time = order.timestamp;
    // self.simulated_time=datetime.strptime(order['timestamp'], '%Y-%m-%d %H:%M:%S.%f')
  }

  getTime() {
    if (!this.simulated) {
      return Date.now();
    } else {
      return this.simulated_time;
    }
  }
}
export default SimulatedRealClock;
