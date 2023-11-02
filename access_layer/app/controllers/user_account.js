const { logger, responseStatus } = require("../../utils");
const { responseOfError } = require("../../utils/error_handle");
const { isValidated } = require("../../utils/validator");
const model = require("../models");

const userAccount = {
    /**
     * 拿取單一帳號的指定欄位資料
     * @param {*} req
     * @param {*} res
     * @returns
     */
    async selectColumns(req, res){

        if(!isValidated(req ,res)) return;

        const {columns, wheres ,logic ,isFuzzy , orders ,pageSize ,page} = req.query;

        try {
            const result = await model.userAccount.selectColumns(columns, wheres ,logic ,isFuzzy , orders ,pageSize ,page);

            return res.json(responseStatus.expected(result));
        } catch (error) {
            return responseOfError(error ,req ,res);
        }
    },
    /**
     * 建立一組帳號
     * @param {*} req
     * @param {*} res
     * @returns uid
     */
    async createAccount(req,res){

        if(!isValidated(req ,res)) return;

        const {uid ,password ,create_uid} = req.body;
        const targets = {
            uid,
            password,
            create_uid,
            update_uid:create_uid
        }
        try {
            const result = await model.userAccount.createAccount(targets);
            //沒有進行創建
            if(!result.affectedRows) return res.json(responseStatus.unexpected(responseStatus.createAccountFail));

            return res.json(responseStatus.expected({uid}));
        } catch (error) {
            return responseOfError(error ,req ,res);
        }
    },
    /**
     * 更新帳號資料(不包含數值異動)
     * @param {*} req targets = {}, uid =""
     * @param {*} res
     * @returns
     */
    async updateAccount(req,res){

        if(!isValidated(req ,res)) return;

        const {targets ,uid} = req.body;
        for (const key in targets) {
            if(typeof targets[key] !== "string") return res.json(responseStatus.unexpected(responseStatus.requestVeriftError))
        }
        try {
            const result = await model.userAccount.updateAccount(targets ,uid);

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
     * 更改帳號的狀態進行軟刪除
     * @param {*} req
     * @param {*} res
     * @returns
     */
    async softDeleteAccount(req, res){

        if(!isValidated(req ,res)) return;

        const {uid ,update_uid} = req.body;
        try {
            const result = await model.userAccount.softDeleteAccount(uid, update_uid);
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
     * 更新帳號結餘
     * @param {*} req targets=異動值
     * @param {*} res
     * @returns
     */
    async updateBalanceOfAccount(req ,res){
        //TODO 加入貯列處理
        if(!isValidated(req ,res)) return;

        const {targets ,uid} = req.body;
        //結餘計算
        //取出目標結餘
        //進行異動
        //更新結餘
        let columns = "";
        const wheres = `uid,${uid}`;
        for (const key in Object.keys(targets)) {
            //確認為數值型態
            const index = Object.keys(targets)[key];
            if(typeof targets[index] !== "number" && index !== "update_uid") return res.json(responseStatus.unexpected(responseStatus.requestVeriftError))
            key > 0 ? columns += `,${index}` : columns += index;

        }
        try {
            const resultOfAccount = await model.userAccount.selectColumns(columns ,wheres);
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
            const result = await model.userAccount.updateBalanceOfAccount(resultOfAccount[0] ,uid);

            //沒有進行更改
            if(!result.changedRows) return res.json(responseStatus.unexpected(responseStatus.balanceFail));

            return res.json(responseStatus.expected(resultOfAccount[0]));
        } catch (error) {
            return responseOfError(error ,req ,res);
        }
    }
}

module.exports = userAccount;