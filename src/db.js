const knex = require("knex");
const { Model } = require("objection");

const knexConfig = require("../knexfile");

const enviroment = process.env.NODE_ENV || "development";
const connectionConfig = knexConfig[enviroment];

const connection = knex(connectionConfig);

Model.knex(connection);

module.exports = connection;

// const knex = require("knex");

// const { Model } = require("objection");

// const devConnectionString = `postgresql://${"admin"}:${"admin"}@${"postgres"}:${"5432"}/${"lms"}`;

// var pool = knex({
//   client: "pg",
//   connection: devConnectionString,
//   searchPath: ["knex", "public"],
// });

// Model.knex(pool);

// module.exports = pool;
