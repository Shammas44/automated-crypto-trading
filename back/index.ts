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
import SimulatedRealClock from "./src/trading/components/SimulatedRealClock";
import OMS from "./src/trading/components/OMS";

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

server.listen(8000, () => {
  console.log(`listening on *:${serverConfig.client_port}`);
});
