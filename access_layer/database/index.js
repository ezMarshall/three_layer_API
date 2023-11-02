const config = require("../config");
const mysql = require('mysql2/promise');
const pool = mysql.createPool(
    {
        host: config.database.host,
        port: config.database.port,
        user: config.database.username,
        password: config.database.password,
        database:config.database.database,
        connectionLimit:10
    }
)
const escape = (str) => {
    return pool.escape(str);
}

module.exports = pool;