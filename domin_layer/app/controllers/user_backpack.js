const { getUserAccount, getItemDatas, getUserItemDatas, createUserItem, updateBalanceOfUserItem, softDeleteUserItem } = require("../../config/fetch_list");
const { apiKey } = require("../../config/project");
const { logger, fetchTools, responseStatus } = require("../../utils");
const { responseOfError } = require("../../utils/error_handle");
const { searchAccountFail, unexpected, createUserItemFail, sameUserItem, searchItemFail, searchUserItemFail, addUserItemAmountFail, deleteUserItemFail } = require("../../utils/response_status");
const { isValidated } = require("../../utils/validator");
//狀態為開啟才能進行操作
const status = 1;
module.exports = {
    async createUserItem (req ,res){
        //檢查uid是否存在
        //檢查item是否存在
        //背包是否重複擁有item
        //資料儲存

        if(!isValidated) return;
        const {uid:create_uid} = req.body.userData
        const {uid ,item_id} = req.body;
        let method ,url = "";
        let query = {};
        try {
            query = {
                columns:"uid",
                wheres:`uid,${uid}/status,${status}`
            }
            method = getUserAccount.method;
            url = getUserAccount.url;
            const checkUid = await fetchTools(method ,url ,query);
            //確認uid是否存在
            if(checkUid.code !== "0001" ) return res.json(responseStatus.unexpected(createUserItemFail));
            if(checkUid.data.length === 0) return res.json(responseStatus.unexpected(searchAccountFail));


            query = {
                columns:"item_id,category_id,item_name",
                wheres:`item_id,${item_id}/status,${status}`
            }
            method = getItemDatas.method;
            url = getItemDatas.url;
            const checkItem = await fetchTools(method ,url ,query);
            //確認item是否存在
            if(checkItem.code !== "0001" ) return res.json(responseStatus.unexpected(createUserItemFail));
            if(checkItem.data.length === 0) return res.json(responseStatus.unexpected(searchItemFail));

            query = {
                columns:"uid ,item_id",
                wheres:`uid,${uid}/item_id,${item_id}/status,${status}`
            }
            method = getUserItemDatas.method;
            url = getUserItemDatas.url;
            const checkBackpack = await fetchTools(method ,url ,query);
            //確認UserItem是否重複
            if(checkBackpack.code !== "0001" ) return res.json(responseStatus.unexpected(createUserItemFail));
            if(checkBackpack.data.length > 0) return res.json(responseStatus.unexpected(sameUserItem ,checkBackpack.data[0]));

            const body = {
                item_id,
                uid,
                create_uid
            }

            method = createUserItem.method;
            url = createUserItem.url;
            //建立
            const create = await fetchTools(method , url ,{} ,body);
            if(create.code !== "0001") return res.json(responseStatus.unexpected(createUserItemFail));

            return res.json(responseStatus.expected(create.data));

        } catch (error) {
            return responseOfError(error ,req ,res ,createUserItemFail);
        }

    },
    async backpack(req ,res){
        //先預設取1000筆
        if(!isValidated(req ,res)) return;

        const { uid } = req.query;
        const query = {
            apiKey,
            columns:"user_backpack.uid,user_backpack.item_id,items.item_name,items.category_id,items.contents,user_backpack.item_amount,user_backpack.status",
            wheres:`uid,${uid}`,
            pageSize:1000,
            join:"items,user_backpack.item_id = items.item_id/JOIN"
        }
        try {

            const method = getUserItemDatas.method;
            const url = getUserItemDatas.url;

            //取得資料
            const backpack = await fetchTools(method ,url ,query);
            if(backpack.code !== "0001") throw backpack;
            if(backpack.data.length === 0) return res.json(unexpected(searchAccountFail));
            return res.json(responseStatus.expected(backpack.data));
        } catch (error) {
            return responseOfError(error ,req ,res ,searchAccountFail);
        }
    },
    async addAmount(req ,res){
        //確認為數值型態
        //確定異動後不小於0
        //進行異動
        //更新結餘

        if(!isValidated(req ,res)) return;

        const {uid:userUid} = req.body.userData;
        const {offset ,uid ,item_id} = req.body;
        let method ,url = "";

        try {

            if(isNaN(Number(offset))) throw new Error(`offset:${offset} most be number type`);
            method = getUserItemDatas.method;
            url = getUserItemDatas.url;
            const query = {
                columns:"item_amount",
                wheres:`uid,${uid}/item_id,${item_id}/status,${status}`
            }

            //取得原始數值
            const getAmount = await fetchTools(method ,url , query);
            if(getAmount.code !== "0001" || getAmount.data.length === 0) return res.json(responseStatus.unexpected(searchUserItemFail));
            const beforeAmount = Number(getAmount.data[0].item_amount);
            const balance = beforeAmount + offset;

            //確認異動後數值
            if(balance < 0) throw new Error(`balance:${beforeAmount} lower than offset:${offset} `);
            method = updateBalanceOfUserItem.method;
            url= updateBalanceOfUserItem.url;
            const targets = {
                item_amount:offset,
                update_uid:userUid
            }
            const body ={
                targets,
                uid,
                item_id
            }

            //進行異動
            const addAmount = await fetchTools(method ,url ,{} ,body);
            if(addAmount.code !== "0001") return res.json(responseStatus.unexpected(addUserItemAmountFail));
            const result = {
                uid,
                item_id,
                item_amount:balance
            }
            return res.json(responseStatus.expected(result));

        } catch (error) {
            return responseOfError(error ,req ,res ,addUserItemAmountFail);
        }
    },
    async softDeleteUserItem(req ,res){

        if(!isValidated(req ,res)) return;
        const {uid : userUid} = req.body.userData;
        const {uid ,item_id} = req.body;
        let method ,url = "";

        try {

            method = getUserItemDatas.method;
            url = getUserItemDatas.url;
            const query = {
                columns:"status",
                wheres:`uid,${uid}/item_id,${item_id}/status,${status}`
            }

            //檢查帳號
            const checkUserItem = await fetchTools(method ,url ,query);
            if(checkUserItem.code !== "0001" || checkUserItem.data.length === 0) throw new Error(`without UserItem UID: ${uid} ITEM_ID: ${item_id}`);

            method = softDeleteUserItem.method;
            url = softDeleteUserItem.url;
            const body = {
                uid,
                item_id,
                update_uid:userUid
            }

            //進行軟刪除
            const result = await fetchTools(method ,url ,{} ,body);
            if(result.code !== "0001") throw new Error (`softDeleteUserItem UID: ${uid} ITEM_ID: ${item_id} fail`);
            return res.json(responseStatus.expected());
        } catch (error) {
            return responseOfError(error ,req ,res ,deleteUserItemFail);
        }
    }
}
