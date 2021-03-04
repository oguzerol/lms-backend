import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { Model } from "objection";

require("dotenv").config();

const connection = require("../src/db");
const middlewares = require("./middlewares");
const api = require("./api/api.routes");

Model.knex(connection);

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

const http = require("http").Server(app);
require("./sio").initialize(http);

app.get("/", (req, res) => {
  res.json({
    message: "Hello from onlineydt.com",
  });
});

app.use("/api/v1", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 7000;
http.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
