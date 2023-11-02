const { logger, responseStatus } = require("../../utils");
const {apiKey} = require("../../config").project;
const inputKey = "apiKey";


/**
 * 驗證api key
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
module.exports = async (req ,res ,next) => {
    let inputApiKey = "";
    const headers = JSON.parse(JSON.stringify(req.headers))
    //檢查apikey是否存在
    if(req.query[inputKey] || req.body[inputKey] || headers[`x-${inputKey.toLowerCase()}`]){
        inputApiKey = req.query[inputKey] || req.body[inputKey] || headers[`x-${inputKey.toLowerCase()}`];
    }
    //apiKey是否相符
    if(inputApiKey === apiKey){
        return next();
    }else{
        logger("apiKey 驗證 fail");
        return res.status(500).json(responseStatus.unexpected(responseStatus.apiKeyError));
    }
}