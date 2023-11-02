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
        controller.itemCategory.createItemCategory);
    router.get("/api/user/getItemCategoryDatas" ,
        [
            check("columns").trim().notEmpty().withMessage("columns不得為空")
        ],
        controller.itemCategory.selectColumns);
    router.put("/api/user/updateItemCategory" ,
        [
            check("targets").notEmpty().withMessage("targets不得為空"),
            check("item_category_id").trim().notEmpty().withMessage("item_category_id不得為空")
        ],
        controller.itemCategory.updateItemCategory);
    router.delete("/api/user/softDeleteItemCategory" ,
        [
            check("item_category_id").trim().notEmpty().withMessage("item_category_id不得為空"),
            check("update_uid").trim().notEmpty().withMessage("update_uid不得為空")
        ],
        controller.itemCategory.softDeleteItemCategory);
    app.use(router);
}
