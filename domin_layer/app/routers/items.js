const express = require("express");
const controller = require("../controllers");
const {check} = require("express-validator");
const middleware = require("../middlewares");

module.exports = (app) => {
    let router = express.Router();

    router.use(middleware.apiKeyValidator);

    router.post("/api/user/createItemCategory" ,
        [
            check("item_category_id").trim().notEmpty().withMessage("item_category_id不得為空"),
            check("create_uid").trim().notEmpty().withMessage("create_uid不得為空")
        ],
        controller.items.createItemCategory);

    router.post("/api/user/searchItemCategoryDatas" ,
        [
            check("columns").trim().notEmpty().withMessage("columns不得為空"),
        ],
        controller.items.searchItemCategoryDatas);

    router.put("/api/user/itemCategory" ,
        [
            check("userData").notEmpty().withMessage("userData不得為空"),
            check("item_category_id").trim().notEmpty().withMessage("item_category_id不得為空"),
        ],
        controller.items.changeItemCategory);
    router.delete("/api/user/itemCategory" ,
        [
            check("userData").notEmpty().withMessage("userData不得為空"),
            check("item_category_id").trim().notEmpty().withMessage("item_category_id不得為空"),
        ],
        controller.items.softDeleteItemCategory);
    router.post("/api/user/createItem" ,
        [
            check("category_id").trim().notEmpty().withMessage("category_id不得為空"),
            check("item_name").trim().notEmpty().withMessage("item_name不得為空"),
            check("create_uid").trim().notEmpty().withMessage("create_uid不得為空")
        ],
        controller.items.createItem);
    router.put("/api/user/item" ,
        [
            check("userData").notEmpty().withMessage("userData不得為空"),
            check("item_id").trim().notEmpty().withMessage("item_id不得為空"),
        ],
        controller.items.changeItem);

    router.delete("/api/user/item" ,
        [
            check("userData").notEmpty().withMessage("userData不得為空"),
            check("item_id").trim().notEmpty().withMessage("item_id不得為空"),
        ],
        controller.items.softDeleteItem);
    app.use(router);
}
