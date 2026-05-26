import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import { db } from "./config/db.js";
import { setupSocket } from "./socket/socket.js";
// variables:
const port = process.env.PORT || 3000;
//  create server:
const server = http.createServer(app);
//  socket server:
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", " http://localhost:5174"],
  },
});

//  setupSocket:
setupSocket(io);

//  db:
db();
server.listen(port, () => {
  console.log(`localhost running at ${port}`);
});
