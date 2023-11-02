const mysql = require("../../database");
const {logger} = require("../../utils");
const { isEmptyObject } = require("../../utils/check");

const user_account = {
    tableName : "user_account",
    /**
     * 拿取table中所有資料(不建議)
     * @returns
     */
    async getAll(){
        const sql = `SELECT * FROM ??`;
        try {
            const [rows, fields] = await mysql.query(sql,[this.tableName]);
            return rows;
        } catch (error) {
            throw error;
        }
    },
    /**
     * 拿取帳號的指定欄位資料
     * @param {string} columns 拿取指定的欄位 id,account
     * @param {string} wheres 條件id,1/level,2
     * @param {string} logic AND ||OR
     * @param {number} isFuzzy 0 || 1
     * @param {string} orders id,accout/ASC ||DESC
     * @param {number} pageSize 每頁筆數
     * @param {number} page 頁數
     * @returns
     */
    async selectColumns(columns = "" ,wheres = "" ,logic = "AND"  ,isFuzzy = 0 , orders = "" , pageSize = 1 ,page = 1 ){
        if(!columns) throw new Error("未帶入參數");
        let sql = `SELECT ${columns} FROM ${this.tableName}`;
        //where判斷
        if(wheres){
            const fuzzy = isFuzzy > 0? "\%":"";
            const wheresArr = wheres.split("/");
            const logicArr = logic.split(",");
            wheresArr.forEach((where ,index) => {
                const whereArr = where.split(",");
                if(index === 0) sql += " WHERE "
                if(index > 0) sql += (" " + (logicArr[index-1]?? logicArr[0]) + " " );
                //status不進行模糊搜尋
                if(whereArr[0] === "status"){
                    sql += (whereArr[0] + " LIKE " +  mysql.escape(whereArr[1]));
                }else{
                    sql += (whereArr[0] + " LIKE " +  mysql.escape(fuzzy + whereArr[1] + fuzzy ));
                }
            })

        }
        //order 排序判斷
        if(orders){
            let ordersArr = orders.split("/");
            //預設ASC
            const sort = ordersArr[1]? ordersArr[1]:"ASC";
            sql += ` ORDER BY ${ordersArr[0]?? ""} ${sort}`;
        }
        //筆數判斷
        sql += ` LIMIT ${(page - 1) * pageSize},${pageSize}`;
        try {
            const [rows, fields] = await mysql.query(sql);
            return rows;
        } catch (error) {
            throw error;
        }
    },
    /**
     * 建立新帳號
     * @param {*} targets
     * @returns
     */
    async createAccount(targets = {}){
        if(isEmptyObject(targets)) throw new Error ("未帶入參數");
        const sql = `INSERT INTO ?? SET ?`;
        try {
            const [rows, fields] =await mysql.query(sql,[this.tableName,targets]);
            return rows
        } catch (error) {
            throw error;
        }
    },
    /**
     * 更新帳號table(不包含數值異動)
     * @param {object} targets
     * @param {string} uid
     * @returns
     */
    async updateAccount(targets = {} ,uid = ""){
        if(isEmptyObject(targets) || !uid) throw new Error ("未帶入參數");
        const sql = `UPDATE ?? SET ? WHERE ?`;
        const wheres = {
            uid
        }
        try {
            const [rows, fields] =await mysql.query(sql,[this.tableName, targets ,wheres]);

            return rows;
        } catch (error) {
            throw error;
        }
    },
    /**
     * 根據id進行軟刪除
     * @param {string} uid PK
     * @param {string} update_uid
     * @returns
     */
    async softDeleteAccount(uid = "" ,update_uid = ""){
        const sql = `UPDATE ?? SET ? WHERE ?`;
        const targets = {
            status:-1,
            update_uid
        }
        const wheres = {
            uid
        }
        try {
            const [rows, fields] =await mysql.query(sql,[this.tableName, targets ,wheres]);
            return rows
        } catch (error) {
            throw error;
        }
    },
    /**
     * 更新帳號結餘
     * @param {object} targets 異動完結餘
     * @param {*} uid
     * @returns
     */
    async updateBalanceOfAccount(targets = {} ,uid = ""){
        if(isEmptyObject(targets) || !uid) throw new Error ("未帶入參數");
        const sql = `UPDATE ?? SET ? WHERE ?`;
        const wheres = {
            uid
        }
        try {
            const [rows, fields] =await mysql.query(sql,[this.tableName, targets ,wheres]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = user_account;