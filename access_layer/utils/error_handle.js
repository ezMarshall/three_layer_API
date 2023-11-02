const logger = require("./logger");
const responseStatus = require("./response_status");

const errorHandle = {
    responseOfError(error ,req ,res ,status){
        logger(error);
        return status? res.status(500).json(responseStatus.unexpected(status)) : res.status(500).json(responseStatus.unexpected());
    }
}

module.exports = errorHandle;