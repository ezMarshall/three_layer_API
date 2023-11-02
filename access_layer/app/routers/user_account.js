const express = require("express");
const controller = require("../controllers");
const {check} = require("express-validator");
const middleware = require("../middlewares");

module.exports = (app) => {
    let router = express.Router();

    router.use(middleware.apiKeyValidator);

    router.get("/api/user/getAccountDatas" ,
        [
            check("columns").trim().notEmpty().withMessage("columns不得為空")
        ],
        controller.userAccount.selectColumns);
    router.post("/api/user/createAccount" ,
        [
            check("uid").trim().notEmpty().withMessage("uid不得為空"),
            check("password").trim().notEmpty().withMessage("password不得為空"),
            check("create_uid").trim().notEmpty().withMessage("create_uid不得為空")

        ],
        controller.userAccount.createAccount);
    router.put("/api/user/updateAccount" ,
        [
            check("targets").notEmpty().withMessage("targets不得為空"),
            check("uid").trim().notEmpty().withMessage("uid不得為空")
        ],
        controller.userAccount.updateAccount);
    router.delete("/api/user/softDeleteAccount" ,
        [
            check("uid").trim().notEmpty().withMessage("uid不得為空"),
            check("update_uid").trim().notEmpty().withMessage("update_uid不得為空")
        ],
        controller.userAccount.softDeleteAccount);
    router.put("/api/user/updateBalanceOfAccount" ,
        [
            check("targets").notEmpty().withMessage("targets不得為空"),
            check("uid").trim().notEmpty().withMessage("uid不得為空")
        ],
        controller.userAccount.updateBalanceOfAccount);
    app.use(router);
}
