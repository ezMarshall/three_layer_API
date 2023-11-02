const { getItemCategoryDatas, createItemCategory, updateItemCategory, softDeleteItemCategory, createItem, getItemDatas, updateItem, softDeleteItem } = require("../../config/fetch_list");
const { apiKey } = require("../../config/project");
const { logger, fetchTools, responseStatus } = require("../../utils");
const { responseOfError } = require("../../utils/error_handle");
const { createItemCategoryFail, sameItemCategory, searchItemCategoryFail, changeItemCategoryFaill, deleteItemCategoryFail, createItemFail ,sameItemName, changeItemFaill, searchItemFail, deleteItemFail } = require("../../utils/response_status");
const { isValidated } = require("../../utils/validator");
//狀態為開啟才能進行操作
const status = 1;
const items = {
    async createItemCategory (req ,res){
        //檢查id是否重復
        //資料儲存

        if(!isValidated) return;
        const {uid:create_uid} = req.body.userData
        const {item_category_id ,contents } = req.body;
        try {
            const query = {
                columns:"item_category_id",
                wheres:`item_category_id,${item_category_id}/status,${status}`
            }
            const check = await fetchTools(getItemCategoryDatas.method ,getItemCategoryDatas.url ,query);
            //確認帳號是否重複
            if(check.code !== "0001" ) return res.json(responseStatus.unexpected(createItemCategoryFail));
            if(check.data.length > 0) return res.json(responseStatus.unexpected(sameItemCategory ,check.data[0]));
            const body = {
                item_category_id,
                create_uid
            }
            if(contents) body.contents = contents;
            //建立
            const create = await fetchTools(createItemCategory.method , createItemCategory.url ,{} ,body);
            if(create.code !== "0001") return res.json(responseStatus.unexpected(createItemCategoryFail));

            return res.json(responseStatus.expected(create.data));

        } catch (error) {
            return responseOfError(error ,req ,res ,createItemCategoryFail);
        }

    },
    async searchItemCategoryDatas(req ,res){
        if(!isValidated(req ,res)) return;

        const { columns ,wheres ,logic ,isFuzzy , orders ,pageSize ,page} = req.body;
        //sql預設值
        const query = {
            apiKey,
            columns,
            wheres:wheres? (wheres + `/status,${status}`): `status,${status}`,
            logic:logic?? "AND",
            isFuzzy:isFuzzy?? 0,
            orders:orders?? "",
            pageSize:pageSize?? 1,
            page:page?? 1
        }

        try {
            const method = getItemCategoryDatas.method;
            const url = getItemCategoryDatas.url;

            //取得資料
            const itemCategoryDatas = await fetchTools(method ,url ,query);
            if(itemCategoryDatas.code !== "0001") throw itemCategoryDatas;
            return res.json(responseStatus.expected(itemCategoryDatas.data));
        } catch (error) {
            return responseOfError(error ,req ,res ,searchItemCategoryFail);
        }
    },
    async changeItemCategory(req ,res){
        if(!isValidated(req ,res)) return;
        const {uid} = req.body.userData;
        const {item_category_id ,contents} = req.body;
        let method ,url = "";
        try {
            method = getItemCategoryDatas.method;
            url = getItemCategoryDatas.url;
            const query = {
                columns:"item_category_id",
                wheres:`item_category_id,${item_category_id}/status,${status}`
            }

            //確認是否有該id
            const check = await fetchTools(method ,url ,query);
            if(check.code !== "0001" || check.data.length === 0) return res.json(responseStatus.unexpected(searchItemCategoryFail));

            method = updateItemCategory.method;
            url = updateItemCategory.url;
            const targets = {
                update_uid:uid
            }
            if(contents) targets.contents = contents;
            const body = {
                targets,
                item_category_id
            }

            //變更道具類別
            const change = await fetchTools(method ,url ,{} ,body);
            if(change.code !== "0001") return res.json(responseStatus.unexpected(changeItemCategoryFaill));
            const result = targets;
            result.item_category_id = item_category_id;
            return res.json(responseStatus.expected(result));
        } catch (error) {
            return responseOfError(error ,req ,res ,changeItemCategoryFaill);
        }
    },
    async softDeleteItemCategory(req ,res){

        if(!isValidated(req ,res)) return;
        const {uid : userUid} = req.body.userData;
        const {item_category_id} = req.body;
        let method ,url = "";

        try {

            method = getItemCategoryDatas.method;
            url = getItemCategoryDatas.url;
            const query = {
                columns:"status",
                wheres:`item_category_id,${item_category_id}/status,${status}`
            }

            //檢查item_category_id
            const check = await fetchTools(method ,url ,query);
            if(check.code !== "0001" || check.data.length === 0) throw new Error(`without item_category_id: ${item_category_id}`);

            method = softDeleteItemCategory.method;
            url = softDeleteItemCategory.url;
            const body = {
                item_category_id,
                update_uid:userUid
            }

            //進行軟刪除
            const result = await fetchTools(method ,url ,{} ,body);
            if(result.code !== "0001") throw new Error (`softDeleteItemCategory item_category_id:${item_category_id} fail`);
            return res.json(responseStatus.expected());
        } catch (error) {
            return responseOfError(error ,req ,res ,deleteItemCategoryFail);
        }
    },
    async createItem (req ,res){

        //檢查category_id是否存在
        //確認道具名稱沒有重複
        //資料儲存

        if(!isValidated) return;
        const {uid:create_uid} = req.body.userData
        const {item_name ,category_id ,contents } = req.body;
        let method ,url = "";
        try {
            let query = {
                columns:"item_category_id",
                wheres:`item_category_id,${category_id}/status,${status}`
            }
            method = getItemCategoryDatas.method;
            url = getItemCategoryDatas.url;
            //確認category_id是否存在
            const checkCategory = await fetchTools(method ,url ,query);
            if(checkCategory.code !== "0001" ) return res.json(responseStatus.unexpected(createItemFail));
            if(checkCategory.data.length === 0) return res.json(responseStatus.unexpected(searchItemCategoryFail));

            method = getItemDatas.method;
            url = getItemDatas.url;
            query = {
                columns:"item_id,category_id,item_name",
                wheres:`category_id,${category_id}/item_name,${item_name}/status,${status}`
            }
            //確認道具名稱沒有重複
            const check = await fetchTools(method ,url ,query);
            if(check.code !== "0001" ) return res.json(responseStatus.unexpected(createItemFail));
            if(check.data.length > 0) return res.json(responseStatus.unexpected(sameItemName ,check.data[0]));
            const body = {
                category_id,
                item_name,
                create_uid
            }
            if(contents) body.contents = contents;
            method = createItem.method;
            url = createItem.url;
            //建立
            const create = await fetchTools(method ,url ,{} ,body);
            if(create.code !== "0001") return res.json(responseStatus.unexpected(createItemFail));

            return res.json(responseStatus.expected(create.data));

        } catch (error) {
            return responseOfError(error ,req ,res ,createItemFail);
        }

    },
    async changeItem(req ,res){
        if(!isValidated(req ,res)) return;
        const {uid} = req.body.userData;
        const {item_id ,contents ,attributes} = req.body;
        let method ,url = "";
        try {
            method = getItemDatas.method;
            url = getItemDatas.url;
            const query = {
                columns:"item_id,category_id,item_name",
                wheres:`item_id,${item_id}/status,${status}`
            }

            //確認是否有該id
            const check = await fetchTools(method ,url ,query);
            if(check.code !== "0001" || check.data.length === 0) return res.json(responseStatus.unexpected(searchItemFail));

            method = updateItem.method;
            url = updateItem.url;
            const targets = {
                update_uid:uid
            }
            if(contents) targets.contents = contents;
            if(attributes) targets.attributes = JSON.stringify(attributes);

            const body = {
                targets,
                item_id
            }

            //變更道具類別
            const change = await fetchTools(method ,url ,{} ,body);
            if(change.code !== "0001") return res.json(responseStatus.unexpected(changeItemFaill));
            const result = targets;
            result.item_id = item_id;
            return res.json(responseStatus.expected(result));
        } catch (error) {
            return responseOfError(error ,req ,res ,changeItemFaill);
        }
    },
    async softDeleteItem(req ,res){

        if(!isValidated(req ,res)) return;
        const {uid : userUid} = req.body.userData;
        const {item_id} = req.body;
        let method ,url = "";

        try {

            method = getItemDatas.method;
            url = getItemDatas.url;
            const query = {
                columns:"status",
                wheres:`item_id,${item_id}/status,${status}`
            }

            //檢查item_id
            const check = await fetchTools(method ,url ,query);
            if(check.code !== "0001" || check.data.length === 0) throw new Error(`without item_id: ${item_id}`);

            method = softDeleteItem.method;
            url = softDeleteItem.url;
            const body = {
                item_id,
                update_uid:userUid
            }

            //進行軟刪除
            const result = await fetchTools(method ,url ,{} ,body);
            if(result.code !== "0001") throw new Error (`softDeleteItem item_id:${item_id} fail`);
            return res.json(responseStatus.expected());
        } catch (error) {
            return responseOfError(error ,req ,res ,deleteItemFail);
        }
    }
}

module.exports = items;