require("dotenv").config();
const { parse } = require("pg-connection-string");

const config = parse(process.env.DATABASE_URL);

module.exports = {
  development: {
    username: config.user,
    password: config.password,
    database: config.database,
    host: config.host,
    port: config.port,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
