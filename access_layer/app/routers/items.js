const express = require("express");
const controller = require("../controllers");
const {check} = require("express-validator");
const middleware = require("../middlewares");

module.exports = (app) => {
    let router = express.Router();

    router.use(middleware.apiKeyValidator);

    router.post("/api/user/createItem" ,
        [
            check("category_id").trim().notEmpty().withMessage("category_id不得為空"),
            check("item_name").trim().notEmpty().withMessage("item_name不得為空"),
            check("create_uid").trim().notEmpty().withMessage("create_uid不得為空")
        ],
        controller.items.createItem);
    router.get("/api/user/getItemDatas" ,
        [
            check("columns").trim().notEmpty().withMessage("columns不得為空")
        ],
        controller.items.selectColumns);
    router.put("/api/user/updateItem" ,
        [
            check("targets").notEmpty().withMessage("targets不得為空"),
            check("item_id").trim().notEmpty().withMessage("item_id不得為空")
        ],
        controller.items.updateItem);
    router.delete("/api/user/softDeleteItem" ,
        [
            check("item_id").trim().notEmpty().withMessage("item_id不得為空"),
            check("update_uid").trim().notEmpty().withMessage("update_uid不得為空")
        ],
        controller.items.softDeleteItem);
    app.use(router);
}
