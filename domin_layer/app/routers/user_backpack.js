const express = require("express");
const controller = require("../controllers");
const {check} = require("express-validator");
const middleware = require("../middlewares");

module.exports = (app) => {
    let router = express.Router();

    router.use(middleware.apiKeyValidator);

    router.post("/api/user/createUserItem" ,
        [
            check("userData").notEmpty().withMessage("userData不得為空"),
            check("uid").trim().notEmpty().withMessage("uid 不得為空"),
            check("item_id").trim().notEmpty().withMessage("item_id 不得為空")
        ],
        controller.userBackpack.createUserItem);
    router.get("/api/user/backpack" ,
        [
            check("uid").trim().notEmpty().withMessage("uid不得為空")
        ],
        controller.userBackpack.backpack);
    router.put("/api/user/userItemAmount" ,
        [
            check("userData").notEmpty().withMessage("userData不得為空"),
            check("offset").notEmpty().withMessage("offset不得為空"),
            check("uid").trim().notEmpty().withMessage("uid 不得為空"),
            check("item_id").trim().notEmpty().withMessage("item_id 不得為空")
        ],
        controller.userBackpack.addAmount);

    router.delete("/api/user/userItem" ,
        [
            check("userData").notEmpty().withMessage("userData不得為空"),
            check("uid").trim().notEmpty().withMessage("uid不得為空"),
            check("item_id").trim().notEmpty().withMessage("item_id 不得為空")
        ],
        controller.userBackpack.softDeleteUserItem);
    app.use(router);
}
