import * as express from "express";
import ForLoopBackTester from "../trading/ForLoopBackTester";
import { Socket } from "socket.io";
import { Request, Response } from "express";
import { app, serverConfig, emitData } from "../config/config";
import { AssetsKind } from "../trading/backTesting";
import DataStream from "../trading/DataStream";
import EventBasedBackTester from "../trading/components/EventBasedBackTester";
import { Order, Strategies } from "../types/order";
import SimulatedRealClock from "../trading/components/SimulatedRealClock";
import TimeOut from "../trading/components/TimeOut";
import OMS from "../trading/components/OMS";

// function getDataSTream(): DataStream | null {
//   return require("dns").resolve("www.google.com", function (err: any) {
//     return err ? null : stream;
//   });
// }

export const register = (
  app: express.Application,
  socket: Socket,
  stream: DataStream
) => {
  app.get("/quotation", async (req: Request, res: Response) => {
    console.log("getQuotation");
    const bars = await stream.getHistoricalData(
      AssetsKind.BAR,
      new Date().toISOString()
    );
    emitData("data", { T: "historycalBars", bars: bars });
    stream.onFirstConnect("data").then(() => {});
  });

  app.get("/backtesting", (req: Request, res: Response) => {
    console.log(".......");
    const clock = new SimulatedRealClock(true);
    let valueToBeModified = true;
    const callback = () => {
      console.log("callback fired");
      valueToBeModified = valueToBeModified ? false : true;
    };
    const order: Order = {
      id: 1,
      price: 2,
      quantity: 1,
      timestamp: Date.now() - 2000,
    };
    clock.process_order(order);
    const timeToStop = Date.now() + 2000;
    const timeout = new TimeOut(clock, timeToStop, callback);
    // timeout.run();

    // const backTester = new EventBasedBackTester(Strategies.Dual_MA)
    // const backTester = new ForLoopBackTester(
    //   getDataSTream(),
    //   socket,
    //   "file.json"
    // );
    // backTester.load_financial_data().then((data) => {
    //   const formatedData = backTester.run(data);
    //   emitData("backtesting", formatedData);
    //   res.json({ data: "finished" });
    // });

    console.log("----- case 1: real Time -----");
    let simulated_real_clock = new SimulatedRealClock();
    let oms = new OMS(simulated_real_clock);
    oms.send_order();
    let i = 0;
    function loop() {
      setTimeout(() => {
        i++;
        console.log(`do something else: ${i}`);
        if (i < 10) {
          loop();
        }
      }, 1000);
    }
    loop();
  });
};
