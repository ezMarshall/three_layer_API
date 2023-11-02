const config = require("../../config");
const { fetchList } = require("../../config");
const { logger, fetchTools, responseStatus } = require("../../utils");
const { isEmptyObject } = require("../../utils/check");
const { responseOfError } = require("../../utils/error_handle");
const { getDatasError, postActionError, putTargetError, deleteTargetError, notLogin, expected } = require("../../utils/response_status");
const { isValidated } = require("../../utils/validator");


const userAccount = {
    async getDatas(req ,res){

        if(!isValidated(req ,res)) return;

        const method = "GET";
        const {getList} = fetchList;
        const dataArr = req.query.datas.split(",");
        const getResultList = {};
        try {
            for (const data of dataArr) {

                //檢查是否有相應的data,沒有就回傳空{}
                if(!getList[data]) {
                    logger(`[WARN] getList without data:${data}`);
                    getResultList[data] = {};
                    continue;
                }
                const {url ,defaultResponse ,hasLogin} = getList[data];
                //確認是否需要登入且已經登入
                if(hasLogin && !req.session?.userData) {
                    //沒有session則回傳預設值
                    getResultList[data] = defaultResponse
                    continue;
                };
                //如果需要登入資料,放入query
                const query = hasLogin ? {uid:req.session.userData.uid} : {};
                const result = await fetchTools(method ,url ,query);
                getResultList[data] = result.code !== "0001" ? defaultResponse : result.data;
            }

            return res.json(responseStatus.expected(getResultList));

        } catch (error) {
            return responseOfError(error ,req ,res ,getDatasError);
        }
    },
    async postAction(req ,res){

        if(!isValidated(req ,res)) return;
        const {datas ,action} = req.body;
        const method = "POST";
        const { postList } = fetchList;
        try {
            if(!postList[action]) throw new Error (`without post action:${action}`);
            //確認是否需要登入且已經登入
            const {url ,hasLogin} = postList[action];
            if(hasLogin && !req.session?.userData) return res.json(responseStatus.unexpected(notLogin));

            //執行登出
            if(action === "logout"){
                req.session.destroy();
                res.clearCookie(config.session.name);
                // const {id} = req.session.userData;
                // logger(`id ${id} has logout`);
                return res.json(responseStatus.expected());
            }

            const body = datas || {};
            //需要已登入的資訊再放入body
            if(hasLogin) {
                body.userData ={
                    uid:req.session.userData.uid
                };
            }
            const result = await fetchTools(method ,url ,{} ,body);

            //錯誤回應直接從第二層傳
            if(result.code !== "0001") return res.json(result);
            if(action === "login"){
                //將使用者資料存在session
                req.session.userData ={
                    uid:result.data.uid
                }
            }
            return res.json(expected(result.data));

        } catch (error) {
            return responseOfError(error ,req ,res ,postActionError);
        }
    },
    async putTarget(req ,res){
        if(!isValidated(req ,res)) return;

        if(isEmptyObject(req.body.datas)) return res.json(responseStatus.unexpected(responseStatus.requestVeriftError));
        const method = "PUT";
        const {datas ,target} = req.body;
        const { putList } = fetchList;
        try {
            if(!putList[target]) throw new Error (`without put target :${target}`);
            const {url ,hasLogin} = putList[target];

            //確認是否需要登入且已經登入
            if(hasLogin && !req.session?.userData) return res.json(responseStatus.unexpected(notLogin));

            const body = datas;
            //需要已登入的資訊再放入body
            if(hasLogin) {
                body.userData ={
                    uid:req.session.userData.uid
                };
            }
            const result = await fetchTools(method ,url ,{} ,body);
            return result.code !== "0001" ? res.json(result) : res.json(responseStatus.expected(result.data));
        } catch (error) {
            return responseOfError(error ,req ,res ,putTargetError);
        }
    },
    async deleteTarget(req ,res){
        if(!isValidated(req ,res)) return;

        if(isEmptyObject(req.body.datas)) return res.json(responseStatus.unexpected(responseStatus.requestVeriftError));
        const method = "DELETE";
        const {datas ,target} = req.body;
        const { deleteList } = fetchList;
        try {
            if(!deleteList[target]) throw new Error (`without put target :${target}`);

            const {url ,hasLogin} = deleteList[target];
            //確認是否需要登入且已經登入
            if(hasLogin && !req.session?.userData) return res.json(responseStatus.unexpected(notLogin));

            const body = datas;
            //需要已登入的資訊再放入body
            if(hasLogin) {
                body.userData ={
                    uid:req.session.userData.uid
                };
            }

            const result = await fetchTools(method ,url ,{} ,body);
            return result.code !== "0001" ? res.json(result) : res.json(responseStatus.expected(result.data));
        } catch (error) {
            return responseOfError(error ,req ,res ,deleteTargetError);
        }
    }
}

module.exports = userAccount;