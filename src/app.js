const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const Knex = require("knex");
const { Model } = require("objection");
require("dotenv").config();
const knexConfig = require("../knexfile");
const enviroment = process.env.NODE_ENV || "development";
const connectionConfig = knexConfig[enviroment];
const knex = Knex(connectionConfig);

const middlewares = require("./middlewares");
const api = require("./api/api.routes");

Model.knex(knex);

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hello from onlineydt.com",
  });
});

app.use("/api/v1", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
