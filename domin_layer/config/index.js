const { getJsonData } = require("../utils/env_parser");

const config = {
    app:require("./app"),
    database:require("./database"),
    project:require("./project"),
    fetchList:getJsonData(__dirname + "/fetch_list.json"),
};
module.exports = config;