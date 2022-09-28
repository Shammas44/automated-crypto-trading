import { Order } from "../../types/order";
import SimulatedRealClock from "../../trading/components/SimulatedRealClock";

const timestamp = 1662721216341;
const order: Order = {
  id: 1,
  price: 10,
  quantity: 1,
  timestamp: timestamp,
};

function getTime(simulation: boolean): number | null {
  const clock = new SimulatedRealClock(simulation);
  clock.process_order(order);
  return clock.getTime();
}

describe("SimulatedRealClock", () => {
  it("Simulated time", async () => {
    expect(getTime(true)).toEqual(timestamp);
  });

  it("Real time", async () => {
    expect(getTime(false)).toBeGreaterThan(timestamp);
  });
});
