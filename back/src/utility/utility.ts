import { Server } from "socket.io";
import Denque from "denque";
import fs from "fs";
import { AssetsKind } from "../trading/backTesting";
import { stream, sourcePath } from "../config/config";

export function getRoomSize(io: Server, roomName: string): number {
  let clientsInRoom;
  if (io.sockets.adapter.rooms.has(roomName)) {
    clientsInRoom = io.sockets.adapter.rooms.get(roomName)?.size ?? undefined;
    console.log("clientsInRoom", clientsInRoom);
  }
  return clientsInRoom || 0;
}

export function getAllFuncs(toCheck: any) {
  const props = [];
  let obj = toCheck;
  do {
    props.push(...Object.getOwnPropertyNames(obj));
  } while ((obj = Object.getPrototypeOf(obj)));

  return props.sort().filter((e, i, arr) => {
    if (e != arr[i + 1] && typeof toCheck[e] == "function") return true;
  });
}

export function msToHMS(ms: number) {
  let seconds: string | number = ms / 1000;
  const hours = parseInt(String(seconds / 3600)); // 3,600 seconds in 1 hour
  seconds = seconds % 3600; // seconds remaining after extracting hours
  const minutes = parseInt(String(seconds / 60)); // 60 seconds in 1 minute
  seconds = Number(seconds % 60).toFixed(3);
  console.log(hours + ":" + minutes + ":" + seconds);
}

export function call_if_not_empty(deq: Denque, callback: Function) {
  while (deq.length > 0) callback();
}

export async function load_financial_data(
  end: string,
  hoursCount: number,
  output_file: string
) {
  const file_path = `${sourcePath}/data/${output_file}`;
  try {
    const data = fs.readFileSync(file_path, "utf8");
    return data;
  } catch (error) {
    const historical_data = await stream?.getHistoricalData(
      AssetsKind.BAR,
      end,
      hoursCount
    );
    const jsonData = JSON.stringify(historical_data);
    await writeFile(file_path, jsonData);
    return jsonData;
  }
}

export async function writeFile(file_path: string, data: string) {
  fs.writeFile(`.${file_path}`, data, function (err) {
    if (err) throw err;
    console.log("File Saved !");
  });
}
