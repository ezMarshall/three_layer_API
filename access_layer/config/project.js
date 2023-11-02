const { getEnv } = require("../utils/env_parser");

module.exports = {
    projectHost: getEnv("PROJECT_HOST"),
    projectName: getEnv("PROJECT_NAME"),
    apiKey: getEnv("API_KEY")
}