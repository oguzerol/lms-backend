const knex = require("knex");
const { Model } = require("objection");

const knexConfig = require("../knexfile");

const enviroment = process.env.NODE_ENV || "development";

const connectionConfig = knexConfig[enviroment];

const connection = knex(connectionConfig);

Model.knex(connection);

module.exports = connection;
