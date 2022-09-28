import express, { Express, Request, Response } from "express";
import { Server } from "socket.io";
import DataStream from "../trading/DataStream";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();

export const serverConfig = {
  key_id: process.env.KEY_ID || "",
  secret_key: process.env.SECRET_KEY || "",
  port: process.env.PORT,
  client_port: process.env.CLIENT_PORT,
  client_url: process.env.CLIENT_URL,
};

export const SIM_STRING = "simulation mode";

export const app: Express = express();
export const http = require("http");
export const server = http.createServer(app);
export const sourcePath = path.resolve("./back");
export const io: Server = new Server(server, {
  cors: { origin: `http://localhost:${serverConfig.client_port}` },
});

const corsOptions = {
  origin: `http://localhost:${serverConfig.client_port}`,
  optionsSuccessStatus: 200, // For legacy browser support
};
app.use(cors(corsOptions));

export const config = {
  symbol: "BTCUSD",
  exchanges: "CBSE",
  timeFrame: "1Min",
  clientsInRoom: 0,
  roomName: "room",
};

export let stream = new DataStream({
  keyId: serverConfig.key_id,
  secretKey: serverConfig.secret_key,
  paper: true,
  exchanges: config.exchanges,
  symbol: config.symbol,
  emitData: emitData,
});

export function emitData(dataKey: string, data: any) {
  io.emit(dataKey, data);
}
