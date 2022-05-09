import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import getEnv from "./env";
import { ordersBookHandler, latestExecutionsHandler } from "./webSocket";

// config
const { port, corsOrigins } = getEnv();
const app = express();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: corsOrigins,
  })
);

// server wrapper
const httpServer = createServer(app);

// web socket server
const webSocketServer = new Server(httpServer, {
  cors: {
    origin: corsOrigins,
  },
});

// web socket events handlers
webSocketServer.on("connection", (socket) => {
  ordersBookHandler(webSocketServer, socket);
  latestExecutionsHandler(webSocketServer, socket);
});

// http server listener
httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
