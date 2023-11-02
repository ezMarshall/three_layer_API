const { logger, responseStatus } = require("../../utils");
const { responseOfError } = require("../../utils/error_handle");
const { isValidated } = require("../../utils/validator");
const model = require("../models");

module.exports = {
    /**
     * 拿取單一帳號背包的指定欄位資料
     * @param {*} req
     * @param {*} res
     * @returns
     */
    async selectColumns(req, res){

        if(!isValidated(req ,res)) return;

        const {columns, wheres ,logic ,isFuzzy , orders ,pageSize ,page ,join ,groupBy ,whereOperator} = req.query;

        try {
            const result = await model.userBackpack.selectColumns(columns, wheres ,logic ,isFuzzy , orders ,pageSize ,page ,join ,groupBy, whereOperator);

            return res.json(responseStatus.expected(result));
        } catch (error) {
            return responseOfError(error ,req ,res);
        }
    },
    /**
     * 建立一組玩家道具
     * @param {*} req
     * @param {*} res
     * @returns uid
     */
    async createUserItem(req,res){

        if(!isValidated(req ,res)) return;

        const {uid ,item_id ,create_uid} = req.body;
        const targets = {
            uid,
            item_id,
            create_uid,
            update_uid:create_uid
        }
        try {
            const result = await model.userBackpack.creatUserItem(targets);
            //沒有進行創建
            if(!result.affectedRows) return res.json(responseStatus.unexpected(responseStatus.createAccountFail));
            const newUserItem = {
                uid,
                item_id
            }
            return res.json(responseStatus.expected(newUserItem));
        } catch (error) {
            return responseOfError(error ,req ,res);
        }
    },
    /**
     * 更新玩家道具(不包含數值異動)
     * @param {*} req targets = {}, uid =""
     * @param {*} res
     * @returns
     */
    async updateUserItem(req,res){

        if(!isValidated(req ,res)) return;

        const {targets ,uid ,item_id} = req.body;
        for (const key in targets) {
            if(typeof targets[key] !== "string") return res.json(responseStatus.unexpected(responseStatus.requestVeriftError));
        }
        try {
            const result = await model.userBackpack.updateUserItem(targets ,uid ,item_id);

            //沒有符合條件的資料
            if(!result.affectedRows) return res.json(responseStatus.unexpected(responseStatus.emptyDataError));
            //沒有進行更改
            if(!result.changedRows) return res.json(responseStatus.unexpected(responseStatus.updateDataFail));

            return res.json(responseStatus.expected());
        } catch (error) {
            return responseOfError(error ,req ,res);
        }
    },
    /**
     * 更改玩家道具的狀態進行軟刪除
     * @param {*} req
     * @param {*} res
     * @returns
     */
    async softDeleteUserItem(req, res){

        if(!isValidated(req ,res)) return;

        const {uid ,item_id  ,update_uid} = req.body;
        try {
            const result = await model.userBackpack.softDeleteUserItem(uid ,item_id ,update_uid);
            //沒有符合條件的資料
            if(!result.affectedRows) return res.json(responseStatus.unexpected(responseStatus.emptyDataError));
            //沒有進行更改
            if(!result.changedRows) return res.json(responseStatus.unexpected(responseStatus.softDeleteFail));

            return res.json(responseStatus.expected());
        } catch (error) {
            return responseOfError(error ,req ,res);
        }
    },
    /**
     * 更新使用者道具結餘
     * @param {*} req targets=異動值
     * @param {*} res
     * @returns
     */
    async updateBalanceOfUserItem(req ,res){
        //TODO 加入貯列處理
        if(!isValidated(req ,res)) return;

        const {targets ,uid , item_id} = req.body;
        //結餘計算
        //取出目標結餘
        //進行異動
        //更新結餘
        let columns = "";
        const wheres = `uid,${uid}/item_id,${item_id}`;
        for (const key in Object.keys(targets)) {
            //確認為數值型態
            const index = Object.keys(targets)[key];
            if(typeof targets[index] !== "number" && index !== "update_uid") return res.json(responseStatus.unexpected(responseStatus.requestVeriftError))
            key > 0 ? columns += `,${index}` : columns += index;

        }
        try {
            const resultOfAccount = await model.userBackpack.selectColumns(columns ,wheres);
            //沒有符合條件的資料
            if(resultOfAccount.length === 0) return res.json(responseStatus.unexpected(responseStatus.emptyDataError));
            for (const key in targets) {
                if(key === "update_uid"){
                    resultOfAccount[0][key] = targets[key];
                    continue;
                }
                const beforeBalanec = Number(resultOfAccount[0][key]);
                //確認異動項目為數值
                if(isNaN(beforeBalanec))  return res.json(responseStatus.unexpected(responseStatus.balaceTypeError))
                resultOfAccount[0][key] = beforeBalanec + targets[key];
            }

            //更新結餘
            const result = await model.userBackpack.updateBalanceOfUserItem(resultOfAccount[0] ,uid ,item_id) ;

            //沒有進行更改
            if(!result.changedRows) return res.json(responseStatus.unexpected(responseStatus.balanceFail));

            return res.json(responseStatus.expected(resultOfAccount[0]));
        } catch (error) {
            return responseOfError(error ,req ,res);
        }
    }
}