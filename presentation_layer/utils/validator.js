const { validationResult } = require("express-validator");
const logger = require("./logger");
const responseStatus = require("./response_status");

const validator = {
    /**
     * 通過驗證則為true
     * @param {*} req
     * @param {*} res
     * @returns
     */
    isValidated(req , res){
        //取得驗證結果
        const errors = validationResult(req);
        //如果有錯誤訊息＝驗證失敗
        if (!errors.isEmpty()) {
            logger(`[ERROR]參數驗證失敗 ${JSON.stringify(errors.array())}`);
            res.status(422).json(responseStatus.unexpected(responseStatus.requestVeriftError,errors.array()));
        }
        return errors.isEmpty();
    }

}

module.exports = validator;