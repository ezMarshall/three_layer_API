
const resStatus = {
    //通用status 0XXX&9XXX
    success:"0001,成功",
    apiKeyError:"0002,apiKey錯誤",
    requestVeriftError:"0003,請求參數驗證錯誤",

    //第三層3XXX
    emptyDataError:"3000,查無此資料",
    softDeleteFail:"3001,軟刪除失敗",
    createAccountFail:"3002,創建帳號失敗",
    updateDataFail:"3003,更新資料失敗",
    balanceFail:"3004,結餘更新失敗",
    balaceTypeError:"3005,結餘型態不符",




    systemError:"9998,系統錯誤",
    unknowError:"9999,未知錯誤",
    /**
     * 回傳預期結果的代碼
     * @param {*} data 要傳遞的資料
     * @returns {object}
     */
    expected(data){
        const [code ,msg] = resStatus.success.split(",");
        return {
            code,
            msg,
            data:data || ""
        }
    },
    /**
     * 根據非預期的結果回傳相對應的代碼
     * @param {string} status 回應代碼
     * @param {*} data 要傳遞的資料
     * @returns {object}
     */
    unexpected(status = "" ,data){
        if(!status){
            status = resStatus.unknowError
        }
        const [code ,msg] = status.split(",");
        return {
            code,
            msg,
            data:data || ""
        }
    }
}


module.exports = resStatus;