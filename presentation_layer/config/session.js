const { getEnv } = require("../utils/env_parser");

module.exports = {
    name: getEnv("SESSION_NAME"),
    secret: getEnv("SESSION_SECRET")
}