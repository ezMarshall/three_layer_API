const express = require("express");
const controller = require("../controllers");
const {check} = require("express-validator");
const middleware = require("../middlewares");

module.exports = (app) => {
    let router = express.Router();

    router.use(middleware.apiKeyValidator);

    router.post("/api/user/login" ,
        [
            check("uid").trim().notEmpty().withMessage("uid不得為空"),
            check("password").trim().notEmpty().withMessage("passowrd不得為空")
        ],
        controller.userAccount.login);
    router.get("/api/user/accountDatas" ,
        [
            check("uid").trim().notEmpty().withMessage("uid不得為空")
        ],
        controller.userAccount.accountDatas);
    router.put("/api/user/password" ,
        [
            check("userData").notEmpty().withMessage("userData不得為空"),
            check("password").trim().notEmpty().withMessage("passowrd不得為空"),
            check("newPassword").trim().notEmpty().withMessage("newPassowrd不得為空")
        ],
        controller.userAccount.changePassword);
    router.put("/api/user/level" ,
        [
            check("userData").notEmpty().withMessage("userData不得為空"),
            check("offset").notEmpty().withMessage("offset不得為空")
        ],
        controller.userAccount.addLevel);
    router.delete("/api/user/account" ,
        [
            check("uid").trim().notEmpty().withMessage("uid不得為空"),
        ],
        controller.userAccount.softDeleteAccount);
    router.post("/api/user/register" ,
        [
            check("uid").trim().notEmpty().withMessage("uid不得為空"),
            check("password").trim().notEmpty().withMessage("passowrd不得為空")
        ],
        controller.userAccount.register);
    app.use(router);
}
