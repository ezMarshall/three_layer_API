const { getUserAccount, updateUserAccount, softDeleteAccount, updateBalanceOfAccount, createUserAccount } = require("../../config/fetch_list");
const { apiKey } = require("../../config/project");
const { logger, fetchTools, responseStatus } = require("../../utils");
const { responseOfError } = require("../../utils/error_handle");
const { searchAccountFail, unexpected, loginFail, passwordError, changePasswordFail, samePasswordError, deleteAccountFail, addLevelFail, sameAccountError, createAccountFail } = require("../../utils/response_status");
const { isValidated } = require("../../utils/validator");
//狀態為開啟才能進行操作
const status = 1;
const userAccount = {
    async login(req ,res){

        if(!isValidated(req ,res)) return;

        //檢查狀態為開啟
        //帳號密碼是否相符
        const {uid ,password} = req.body;
        const query = {
            apiKey,
            columns:"uid,password,status",
            wheres:`uid,${uid}/status,${status}`
        }
        try {
            const method = getUserAccount.method;
            const url = getUserAccount.url;

            //取得玩家資料
            const userDatas = await fetchTools(method ,url ,query);
            if(userDatas.code !== "0001") throw userDatas;
            if(userDatas.data.length === 0) return res.json(unexpected(searchAccountFail));
            if(password !== userDatas.data[0].password) return res.json(unexpected(passwordError));
            const data = {
                uid:userDatas.data[0].uid
            }
            return res.json(responseStatus.expected(data));
        } catch (error) {
            return responseOfError(error ,req ,res ,loginFail);
        }
    },
    async accountDatas(req ,res){

        if(!isValidated(req ,res)) return;

        const { uid } = req.query;
        const query = {
            apiKey,
            columns:"uid,level,status",
            wheres:`uid,${uid}`
        }
        try {
            const method = getUserAccount.method;
            const url = getUserAccount.url;

            //取得資料
            const userDatas = await fetchTools(method ,url ,query);
            if(userDatas.code !== "0001") throw userDatas;
            if(userDatas.data.length === 0) return res.json(unexpected(searchAccountFail));
            return res.json(responseStatus.expected(userDatas.data[0]));
        } catch (error) {
            return responseOfError(error ,req ,res ,searchAccountFail);
        }
    },
    async changePassword(req ,res){
        //檢查新舊密碼是否相同
        //舊密碼是否正確
        //更新新密碼
        if(!isValidated(req ,res)) return;
        const {uid} = req.body.userData;
        const {password ,newPassword} = req.body;
        if(password === newPassword) return res.json(responseStatus.unexpected(samePasswordError));
        let method ,url = "";
        try {
            method = getUserAccount.method;
            url = getUserAccount.url;
            const query = {
                columns:"password",
                wheres:`uid,${uid}/password,${password}/status,${status}`
            }

            //確認舊密碼
            const checkPassword = await fetchTools(method ,url ,query);
            if(checkPassword.code !== "0001" || checkPassword.data.length === 0) return res.json(responseStatus.unexpected(passwordError));

            method = updateUserAccount.method;
            url = updateUserAccount.url;
            const body = {
                targets:{
                    password:newPassword,
                    update_uid:uid
                },
                uid
            }

            //變更密碼
            const changePassword = await fetchTools(method ,url ,{} ,body);
            if(changePassword.code !== "0001") return res.json(responseStatus.unexpected(changePasswordFail));
            return res.json(responseStatus.expected());
        } catch (error) {
            return responseOfError(error ,req ,res ,changePasswordFail);
        }
    },
    async addLevel(req ,res){
        //確認為數值型態
        //確定異動後不小於1
        //進行異動
        //更新結餘

        if(!isValidated(req ,res)) return;

        const {uid} = req.body.userData;
        const {offset} = req.body;
        let method ,url = "";

        try {

            if(Number(offset) === NaN) throw new Error(`offset:${offset} most be number type`);
            method = getUserAccount.method;
            url = getUserAccount.url;
            const query = {
                columns:"level",
                wheres:`uid,${uid}/status,${status}`
            }

            //取得原始數值
            const getUserLevel = await fetchTools(method ,url , query);
            if(getUserLevel.code !== "0001" || getUserLevel.data.length === 0) return res.json(responseStatus.unexpected(searchAccountFail));
            const beforeLevel = Number(getUserLevel.data[0].level);
            const balance = beforeLevel + offset;

            //確認異動後數值
            if(balance < 1) throw new Error(`balance:${beforeLevel} lower than offset:${offset} `);
            method = updateBalanceOfAccount.method;
            url= updateBalanceOfAccount.url;
            const targets = {
                level:offset,
                update_uid:"system"
            }
            const body ={
                targets,
                uid
            }

            //進行異動
            const addLevel = await fetchTools(method ,url ,{} ,body);
            if(addLevel.code !== "0001") return res.json(responseStatus.unexpected(addLevelFail));
            const result = {
                level:balance
            }
            return res.json(responseStatus.expected(result));

        } catch (error) {
            return responseOfError(error ,req ,res ,addLevelFail);
        }
    },
    async softDeleteAccount(req ,res){

        if(!isValidated(req ,res)) return;
        const {uid : userUid} = req.body.userData;
        const {uid} = req.body;
        let method ,url = "";

        try {

            method = getUserAccount.method;
            url = getUserAccount.url;
            const query = {
                columns:"status",
                wheres:`uid,${uid}/status,${status}`
            }

            //檢查帳號
            const checkAccount = await fetchTools(method ,url ,query);
            if(checkAccount.code !== "0001" || checkAccount.data.length === 0) throw new Error(`without UID: ${uid}`);

            method = softDeleteAccount.method;
            url = softDeleteAccount.url;
            const body = {
                uid,
                update_uid:userUid
            }

            //進行軟刪除
            const result = await fetchTools(method ,url ,{} ,body);
            if(result.code !== "0001") throw new Error (`softDeleteAccount UID:${uid} fail`);
            return res.json(responseStatus.expected());
        } catch (error) {
            return responseOfError(error ,req ,res ,deleteAccountFail);
        }
    },
    async register(req ,res){
        //檢查帳號是否重復
        //密碼處理
        //資料儲存

        if(!isValidated) return;

        const {uid,password} = req.body;
        let method ,url = "";
        try {
            method = getUserAccount.method;
            url = getUserAccount.url;
            const query = {
                columns:"uid",
                wheres:`uid,${uid}/status,${status}`
            }
            const checkAccount = await fetchTools(method ,url ,query);
            //確認帳號是否重複
            if(checkAccount.code !== "0001" ) return res.json(responseStatus.unexpected(createAccountFail));
            if(checkAccount.data.length > 0) return res.json(responseStatus.unexpected(sameAccountError ,checkAccount.data[0]));
            method = createUserAccount.method;
            url = createUserAccount.url;
            const body = {
                uid,
                password,
                create_uid:"system"
            }
            //建立帳號
            const createAccount = await fetchTools(method , url ,{} ,body);
            if(createAccount.code !== "0001") return res.json(responseStatus.unexpected(createAccountFail));
            //初始化帳號
            method = updateUserAccount.method;
            url = updateUserAccount.url;
            const targets = {
                status:"1",
                update_uid:"system"
            }
            const updataBody = {
                targets,
                uid:createAccount.data.uid
            }
            //初始化狀態
            const updataStatus= await fetchTools(method ,url ,{} ,updataBody);
            if(updataStatus.code !== "0001") return res.json(responseStatus.unexpected(createAccountFail));
            return res.json(responseStatus.expected(createAccount.data));

        } catch (error) {
            return responseOfError(error ,req ,res ,createAccountFail);
        }
    }
}

module.exports = userAccount;