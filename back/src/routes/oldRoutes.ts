// import ForLoopBackTester from "../ForLoopBackTester";
// import { Socket } from "socket.io";
// import { Request, Response } from "express";
// import { app, serverConfig, stream, emitData } from "../config/config";
// import { AssetsKind } from "../types/backTesting";
// import getAllFuncs from "../../../front/src/composables/getAllFuncs";

// class Api {
//   socket: Socket;

//   constructor(socket: Socket) {
//     this.socket = socket;
//     const callingFuncs = getAllFuncs(this).filter((funcName: string) => {
//       if (funcName.startsWith("call")) return funcName;
//     });
//     console.log("func", callingFuncs);
//     callingFuncs.forEach((funcName: string) => {
//       const key = funcName as keyof Api;
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       this[key]();
//     });
//   }

//   // private callHomeApi() {
//   //   app.get("/", (req: Request, res: Response) => {
//   //     res.send("Express + TypeScript Server is running");
//   //   });
//   // }

//   // private callBacktestingApi() {
//   //   app.get("/backtesting", (req: Request, res: Response) => {
//   //     const backTester = new ForLoopBackTester(stream, this.socket, "file");
//   //     backTester.load_financial_data().then((data) => {
//   //       backTester.run(data);
//   //     });
//   //   });
//   // }

//   private callQuotationApi() {
//     app.get("/quotation", (req: Request, res: Response) => {
//       console.log("getQuotation");
//       res.json({ data: "yo" });
//       // stream;
//       // .getHistoricalData(AssetsKind.BAR, new Date().toISOString())
//       // .then((bars) => {
//       //   emitData({ T: "historycalBars", bars: bars });
//       //   // stream.onFirstConnect();
//       // });
//     });
//   }
// }
// export default Api;
