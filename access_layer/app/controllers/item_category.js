const { logger, responseStatus } = require("../../utils");
const { responseOfError } = require("../../utils/error_handle");
const { isValidated } = require("../../utils/validator");
const model = require("../models");

const itemCategory = {

    /**
     * 建立一個道具類別
     * @param {*} req
     * @param {*} res
     * @returns item_category_id
     */
    async createItemCategory (req ,res){
        if(!isValidated(req ,res)) return;

        const {item_category_id ,create_uid ,contents} = req.body;
        const targets = {
            item_category_id,
            create_uid,
            update_uid:create_uid
        }
        if(contents) targets.contents = contents;
        try {
            const result = await model.itemCategory.createCategory(targets);
            //沒有進行創建
            if(!result.affectedRows) return res.json(responseStatus.unexpected(responseStatus.createAccountFail));

            return res.json(responseStatus.expected({item_category_id}));
        } catch (error) {
            return responseOfError(error ,req ,res);
        }
    },
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
            const result = await model.itemCategory.selectColumns(columns, wheres ,logic ,isFuzzy , orders ,pageSize ,page);

            return res.json(responseStatus.expected(result));
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
    async updateItemCategory(req,res){

        if(!isValidated(req ,res)) return;

        const {targets ,item_category_id} = req.body;
        for (const key in targets) {
            if(typeof targets[key] !== "string") return res.json(responseStatus.unexpected(responseStatus.requestVeriftError))
        }
        try {
            const result = await model.itemCategory.updateItemCategory(targets ,item_category_id);

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
    async softDeleteItemCategory(req, res){

        if(!isValidated(req ,res)) return;

        const {item_category_id ,update_uid} = req.body;
        try {
            const result = await model.itemCategory.softDeleteItemCategory(item_category_id, update_uid);
            //沒有符合條件的資料
            if(!result.affectedRows) return res.json(responseStatus.unexpected(responseStatus.emptyDataError));
            //沒有進行更改
            if(!result.changedRows) return res.json(responseStatus.unexpected(responseStatus.softDeleteFail));

            return res.json(responseStatus.expected());
        } catch (error) {
            return responseOfError(error ,req ,res);
        }
    }

}

module.exports = itemCategory;