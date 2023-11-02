const fs = require("fs");
const  logger  = require("./logger");

module.exports = {

    /**
     *
     * @param {string} envName
     * @param {"string"|"boolean"|"array"|"number"|"integer"} type
     * @param defaultValues
     */
    getEnv(envName = "", type = "string", defaultValue = undefined) {
        const configValue = process.env[envName] ?? defaultValue;
        const myself = module.exports;
        switch (type){
            case "boolean":
                return myself.toBoolean(configValue);
            case "number":
                return myself.toNumber(configValue);
            case "integer":
                return myself.toInteger(configValue);
            case "array":
                return myself.toArray(configValue);
            default:
                return configValue;
        }
    },
    toBoolean(target = ""){
        if (target && typeof target === "string") {
            return (target === "true");
        }
        return target;
    },
    toInteger(target = "") {
        if (target && typeof target === "string") {
          return parseInt(target)
        }
        return target
    },
    toNumber(target = "") {
      if (target && !isNaN(target)) {
        return Number(target)
      }
      return target
    },
    toArray(target = "", separator = ",", fallback) {
        if (target && typeof target === "string") {
          return (target.split(separator).map(arrayItem => arrayItem.trim()))
        }
        return fallback
    },
    getJsonData(path = ""){
        try {
            const file = fs.readFileSync(path);
            return JSON.parse(file);
        } catch (error) {
            throw error;
        }
    }
}