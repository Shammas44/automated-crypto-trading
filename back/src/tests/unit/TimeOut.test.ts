import { Side, Action } from "../../types/order";
import TimeOut from "../../trading/components/TimeOut";
import SimulatedRealClock from "../../trading/components/SimulatedRealClock";
import OMS from "../../trading/components/OMS";

// TODO: this test is not working yet

let isTimeOut;
const oms_timer = 5000;

function createFun() {
  return function () {
    console.log("Order Timout Please Take Action");
    isTimeOut = true;
  };
}

describe("TimeOut", () => {
  jest.useFakeTimers();
  it("real time: should execute OMS callback after 5000ms", async () => {
    isTimeOut = false;
    const simulated_real_clock = new SimulatedRealClock();
    const oms = new OMS(simulated_real_clock, oms_timer, createFun());
    oms.send_order();
    jest.advanceTimersByTime(oms_timer);
    expect(isTimeOut).toEqual(true);
  });

  it("simulated time: should execute OMS callback after 500ms", async () => {
    isTimeOut = false;
    const simulated_real_clock = new SimulatedRealClock(true);
    simulated_real_clock.process_order({
      id: 1,
      timestamp: "2018-06-29 08:15:27.243860",
    });
    const oms = new OMS(simulated_real_clock, oms_timer, createFun());
    oms.send_order();
    simulated_real_clock.process_order({
      id: 1,
      timestamp: "2018-06-29 08:21:27.243860",
    });
    jest.advanceTimersByTime(oms_timer);
    expect(isTimeOut).toEqual(true);
  });
});
