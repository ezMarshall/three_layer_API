const { getEnv } = require("../utils/env_parser");

module.exports = {
    host: getEnv("APP_HOST"),
    port: getEnv("APP_PORT","number")
}