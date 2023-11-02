const mysql = require("../../database");

const database = {
    escape(str){
        return mysql.escape(str);
    },
    async getAll(tableName){
        const sql = `SELECT * FROM user_account`;
        try {
            const [rows, fields] = await mysql.query(sql);
            console.log('Query results:', rows);
            return rows;
        } catch (error) {
            // console.error('[Error executing query]:', error);
            throw error;
        }
    }
}

module.exports = database;