import * as express from "express";
import ForLoopBackTester from "../trading/ForLoopBackTester";
import { Socket } from "socket.io";
import { Request, Response } from "express";
import { app, serverConfig, emitData } from "../config/config";
import { AssetsKind } from "../trading/backTesting";
import DataStream from "../trading/DataStream";

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
  });
};
