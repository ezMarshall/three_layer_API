const express = require("express");
const config = require("../../config");
const controller = require("../controllers");
const middleware = require("../middlewares");
const {check} = require("express-validator");
const session = require("express-session");
const { logger } = require("../../utils");

module.exports = (app) => {
    let router = express.Router();

    router.use(middleware.apiKeyValidator);

    router.use(
        session({
            // store: new RedisStore({ client: redis }),
            name: config.session.name,
            saveUninitialized: false,
            secret: config.session.secret,
            resave: false,
            cookie:config.cookie
        })
    )
    router.get("/api/user",
        [
            check("datas").trim().notEmpty().withMessage("datas不得為空")
        ],
        controller.userAccount.getDatas);
    router.post("/api/user",
        [
            check("action").trim().notEmpty().withMessage("action不能為空")
        ],
        controller.userAccount.postAction);
    router.put("/api/user/",
        [
            check("target").trim().notEmpty().withMessage("target不得為空"),
            check("datas").notEmpty().withMessage("datas不得為空")
        ],
        controller.userAccount.putTarget);
    router.delete("/api/user/",
        [
            check("target").trim().notEmpty().withMessage("target不得為空"),
            check("datas").notEmpty().withMessage("datas不得為空")
        ],
        controller.userAccount.deleteTarget);
    app.use(router);
}
