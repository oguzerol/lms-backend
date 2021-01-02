const env = process.env.NODE_ENV || "development";
require("dotenv").config({ path: `./config/enviroment/.${env}` });
console.log(process.env.POSTGRES_USER);

module.exports = {
  development: {
    client: "pg",
    connection: {
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
  },
};
