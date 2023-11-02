const { getEnv } = require("../utils/env_parser");

module.exports = {
    host: getEnv("DB_HOST"),
    port: getEnv("DB_PORT"),
    username: getEnv("DB_USERNAME"),
    password: getEnv("DB_PASSWORD"),
    database:getEnv("DB_DATABASE")
}