const env = process.env.NODE_ENV || "development";
require("dotenv").config({ path: `./config/enviroment/.development` });

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "postgres",
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
    searchPath: ["knex", "public"],
  },
};
