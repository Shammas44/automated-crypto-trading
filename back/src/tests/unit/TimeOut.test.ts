import { Side, Action } from "../../types/order";
import TimeOut from "../../trading/components/TimeOut";
import SimulatedRealClock from "../../trading/components/SimulatedRealClock";

// TODO: this test is not working yet

describe("TimeOut", () => {
  it("Timeout real time", async () => {
    const clock = new SimulatedRealClock(true);
    let valueToBeModified = true;
    const callback = () => {
      valueToBeModified = valueToBeModified ? false : true;
    };
    const timeToStop = 2;
    const timeout = new TimeOut(clock, timeToStop, callback);
    timeout.run();
    expect(valueToBeModified).toEqual(false);
  });
});
