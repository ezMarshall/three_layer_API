const express = require("express");
const controller = require("../controllers");
const {check} = require("express-validator");
const middleware = require("../middlewares");

module.exports = (app) => {
    let router = express.Router();

    router.use(middleware.apiKeyValidator);

    router.get("/api/user/getUserItemDatas" ,
        [
            check("columns").trim().notEmpty().withMessage("columns不得為空")
        ],
        controller.userBackpack.selectColumns);
    router.post("/api/user/createUserItem" ,
        [
            check("uid").trim().notEmpty().withMessage("uid不得為空"),
            check("item_id").trim().notEmpty().withMessage("item_id不得為空"),
            check("create_uid").trim().notEmpty().withMessage("create_uid不得為空")
        ],
        controller.userBackpack.createUserItem);
    router.put("/api/user/updateUserItem" ,
        [
            check("targets").notEmpty().withMessage("targets不得為空"),
            check("uid").trim().notEmpty().withMessage("uid不得為空"),
            check("item_id").trim().notEmpty().withMessage("item_id不得為空")

        ],
        controller.userBackpack.updateUserItem);
    router.delete("/api/user/softDeleteUserItem" ,
        [
            check("uid").trim().notEmpty().withMessage("uid不得為空"),
            check("item_id").trim().notEmpty().withMessage("item_id不得為空"),
            check("update_uid").trim().notEmpty().withMessage("update_uid不得為空")
        ],
        controller.userBackpack.softDeleteUserItem);
    router.put("/api/user/updateBalanceOfUserItem" ,
        [
            check("targets").notEmpty().withMessage("targets不得為空"),
            check("uid").trim().notEmpty().withMessage("uid不得為空"),
            check("item_id").trim().notEmpty().withMessage("item_id不得為空")
        ],
        controller.userBackpack.updateBalanceOfUserItem);
    app.use(router);
}
