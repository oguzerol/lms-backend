import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import http from "http";
import cors from "cors";
import { Model } from "objection";
import { registerEvents } from "./events/exam";
const socket = require("socket.io");

require("dotenv").config();

const connection = require("../src/db");
const middlewares = require("./middlewares");
const api = require("./api/api.routes");

Model.knex(connection);

const app = express();

const server = http.createServer(app);
const socketio = socket(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

// SocketIO configuration
app.use(function (req, res, next) {
  console.log("test");
  next();
});

require("./config/socketio").default(socketio, app);

// Register Events.
registerEvents(socketio);

app.get("/", (req, res) => {
  res.json({
    message: "Hello from onlineydt.com",
  });
});

app.use("/api/v1", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 7000;

server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
