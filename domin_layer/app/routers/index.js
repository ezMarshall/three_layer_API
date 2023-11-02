const express = require("express");
const config = require("../../config");

module.exports = (app) => {
    let router = express.Router();

    router.get("/" , (req ,res) => {
        res.send(`HELLO here is ${config.project.projectHost}'s project ${config.project.projectName}`);
    })

    app.use(router);

    require("./user")(app);
    require("./items")(app);
    require("./user_backpack")(app);

}
