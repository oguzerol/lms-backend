const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { Model } = require("objection");

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

app.get("/", (req, res) => {
  res.json({
    message: "Hello from onlineydt.com",
  });
});

app.use("/api/v1", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
