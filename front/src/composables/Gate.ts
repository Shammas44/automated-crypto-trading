import { io, Socket } from "socket.io-client";
import getAllFuncs from "./getAllFuncs";

class Gate {
  socket: Socket;

  constructor(url: string) {
    this.socket = io(url);
    const availableFuncs = getAllFuncs(this).filter((funcName: string) => {
      if (funcName.startsWith("on")) return funcName;
    });
    availableFuncs.forEach((funcName: string) => {
      const key = funcName as keyof Gate;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this[key]();
    });
  }

  disconnect() {
    console.log("connection close");
    this.socket.disconnect();
  }

  reload() {
    this.socket.disconnect();
    location.reload();
  }
}
export default Gate;
