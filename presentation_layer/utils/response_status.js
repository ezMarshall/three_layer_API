
const resStatus = {
    //通用status 0XXX&9XXX
    success:"0001,成功",
    apiKeyError:"0002,apiKey錯誤",
    requestVeriftError:"0003,請求參數驗證錯誤",

    //  第一層1XXX
    notLogin:"1000,未登入",
    getDatasError:"1001,取得資料失敗",
    postActionError:"1002,執行請求失敗",
    putTargetError:"1003,更新目標失敗",
    deleteTargetError:"1004,刪除目標失敗",

    //第二層2XXX
    //帳號相關 20XX
    searchAccountFail:"2000,查無此帳號",
    loginFail:"2001,登入失敗",
    passwordError:"2002,密碼錯誤",
    changePasswordFail:"2003,更改密碼失敗",
    samePasswordError:"2004,新舊密碼相同",
    deleteAccountFail:"2005,刪除帳號失敗",
    addLevelFail:"2006,異動等級失敗",
    sameAccountError:"2007,帳號重複",
    createAccountFail:"2008,創建帳號失敗",
    // 道具相關 21XX
    deleteUserItemFail:"2100,刪除玩家道具失敗",
    createItemCategoryFail:"2101,創建道具類別失敗",
    sameItemCategory:"2102,道具類別重複",
    searchItemCategoryFail:"2103,查找道具類別失敗",
    changeItemCategoryFaill:"2104,更改道具類別失敗",
    deleteItemCategoryFail:"2105,刪除道具類別失敗",
    createItemFail:"2106,創建道具失敗",
    deleteItemFail:"2107,刪除道具失敗",
    sameItemName:"2108,道具名稱重複",
    changeItemFaill:"2109,更改道具失敗",
    searchItemFail:"2110,查找道具失敗",
    createUserItemFail:"2111,創建玩家道具失敗",
    sameUserItem:"2112,玩家道具重複",
    searchUserItemFail:"2113,查找玩家道具失敗",
    addUserItemAmountFail:"2114,異動玩家道具結餘失敗",

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