const mysql = require("../../database");
const {logger} = require("../../utils");
const { isEmptyObject } = require("../../utils/check");

module.exports = {
    tableName : "user_backpack",
    async creatUserItem(targets = {}){
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
     * 拿取道具的指定欄位資料
     * @param {string} columns 拿取指定的欄位 id,account
     * @param {string} wheres 條件id,1/level,2
     * @param {string} logic AND ||OR
     * @param {number} isFuzzy 0 || 1
     * @param {string} orders id,accout/ASC ||DESC
     * @param {number} pageSize 每頁筆數
     * @param {number} page 頁數
     * @param {string} [join=""] joinTable,on/joinType
     * @param {string} [groupBy=""] column1,column2
     * @param {string} [whereOperator=""] >,=,<
     * @returns
     */
    async selectColumns(columns = "" ,wheres = "" ,logic = "AND"  ,isFuzzy = 0 , orders = "" , pageSize = 1 ,page = 1 ,join ="" ,groupBy = "" ,whereOperator = ""){
        if(!columns) throw new Error("未帶入參數");
        let sql = `SELECT ${columns} FROM ${this.tableName}`;
        //join判斷
        if(join){
            const joinArr = join.split("/");
            const joinType = joinArr[1];
            const [joinTable ,joinOn] = joinArr[0].split(",");

            sql += ` ${joinType} ${joinTable} ON ${joinOn}`;
        }
        //groupBy判斷
        if(groupBy){
            sql += ` GROUP BY ${groupBy} `;
        }
        //where判斷
        if(wheres){
            const fuzzy = isFuzzy > 0 ? "\%":"";
            const wheresArr = wheres.split("/");
            const logicArr = logic.split(",");
            const operatorArr =  whereOperator.split(",");
            wheresArr.forEach((where ,index) => {
                const whereArr = where.split(",");
                if(index === 0 && !groupBy){
                    sql += " WHERE "
                }else if(index === 0){
                    sql += " HAVING "
                }
                if(index > 0) sql += (" " + (logicArr[index-1]?? logicArr[0]) + " " );
                //status不進行模糊搜尋
                if(whereArr[0] === "status"){
                    sql += (whereArr[0] + " = " +  mysql.escape(whereArr[1]));
                }else{
                    sql += (whereArr[0] + (isFuzzy > 0 ? " LIKE " : whereOperator? ` ${operatorArr[index]?? operatorArr[0]} ` :" = ") +  mysql.escape(fuzzy + whereArr[1] + fuzzy ));
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
     * 更新userItem table(不包含數值異動)
     * @param {object} targets
     * @param {string} uid
     * @param {string} item_id
     * @returns
     */
    async updateUserItem(targets = {} ,uid = "" ,item_id = ""){
        if(isEmptyObject(targets) || !item_id) throw new Error ("未帶入參數");
        const sql = `UPDATE ?? SET ? WHERE ?`;
        const wheres = {
            uid,
            item_id
        }
        try {
            const [rows, fields] =await mysql.query(sql,[this.tableName, targets ,wheres]);

            return rows;
        } catch (error) {
            throw error;
        }
    },
    /**
     * 根據uid和item_id進行軟刪除
     * @param {string} [uid=""]
     * @param {string} item_id
     * @param {string} update_uid
     * @returns
     */
    async softDeleteUserItem(uid = "" ,item_id = "" ,update_uid = ""){
        const targets = {
            status:-1,
            update_uid
        }
        const wheres = {
            uid,
            item_id
        }
        let sql = `UPDATE ?? SET ?`;
        const wheresArr = Object.keys(wheres);
        let whereStr = "";
        wheresArr.forEach((where ,index) =>{
            whereStr += index === 0 ? ` WHERE ${where} = ${mysql.escape(wheres[where])}`:` AND ${where} = ${mysql.escape(wheres[where])}`;
        })
        sql += whereStr;
        try {
            const [rows, fields] =await mysql.query(sql,[this.tableName, targets ,wheres]);
            return rows
        } catch (error) {
            throw error;
        }
    },
    /**
    * 更新玩家道具結餘
    * @param {object} targets 異動完結餘
    * @param {*} uid
    * @param {string} [item_id=""]
    * @returns
    */
   async updateBalanceOfUserItem(targets = {} ,uid = "" , item_id = ""){
        if(isEmptyObject(targets) || !uid) throw new Error ("未帶入參數");

        const wheres = {
            uid,
            item_id
        }
        let sql = `UPDATE ?? SET ?`;
        const wheresArr = Object.keys(wheres);
        let whereStr = "";
        wheresArr.forEach((where ,index) =>{
            whereStr += index === 0 ? ` WHERE ${where} = ${mysql.escape(wheres[where])}`:` AND ${where} = ${mysql.escape(wheres[where])}`;
        })
        sql += whereStr;

        try {
            const [rows, fields] =await mysql.query(sql,[this.tableName, targets]);
            return rows;
        } catch (error) {
            throw error;
        }
   }

}