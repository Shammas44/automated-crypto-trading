import { Socket } from "socket.io";
import { getRoomSize } from "./src/utility/utility";
import {
  config,
  server,
  serverConfig,
  io,
  app,
  stream,
} from "./src/config/config";
import * as routes from "./src/routes/routes";
// import SimulatedRealClock from "./src/trading/components/SimulatedRealClock";
// import OMS from "./src/trading/components/OMS";

io.on("connection", async (socket: Socket) => {
  console.log("a user connected");
  socket.join(config.roomName);
  config.clientsInRoom = getRoomSize(io, config.roomName);
  global.stream = stream;

  routes.register(app, socket, global.stream);

  socket.on("disconnect", () => {
    console.log("user disconnected");
    config.clientsInRoom = getRoomSize(io, config.roomName);
    global.stream.disconnect();
  });
});

// console.log("----- case 1: real Time -----");
// let simulated_real_clock = new SimulatedRealClock();
// let oms = new OMS(simulated_real_clock);
// oms.send_order();
// let i = 0;
// function loop() {
//   setTimeout(() => {
//     i++;
//     console.log(`do something else: ${i}`);
//     if (i < 10) {
//       loop();
//     }
//   }, 1000);
// }
// loop();

// console.log("----- case 2: simulated Time -----");
// simulated_real_clock = new SimulatedRealClock(true);
// simulated_real_clock.process_order({
//   id: 1,
//   timestamp: "2018-06-29 08:15:27.243860",
// });
// oms = new OMS(simulated_real_clock);
// oms.send_order();
// simulated_real_clock.process_order({
//   id: 1,
//   timestamp: "2018-06-29 08:21:27.243860",
// });

server.listen(8000, () => {
  console.log(`listening on *:${serverConfig.client_port}`);
});
