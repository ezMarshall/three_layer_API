const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const logger  = require("./logger");
const { isEmptyObject } = require("./check");
const { apiKey } = require('../config/project');

/**
 * 執行fetch的小工具 *
 * @param {string} method "GET" ,"POST" ,"PUT" ,"DELETE"
 * @param {string} url
 * @param {object} query
 * @param {object} body
 * @param {string} params
 * @param {string} headers
 * @returns
 */
const fetchTools = async (method = "GET" ,url = "" ,query = {} ,body = {} ,params = "" ,headers = "") => {
    if(!url) return new Error(`without URL`);
    const methodList = ["GET" ,"POST" ,"PUT" ,"DELETE"];
    if(methodList.findIndex((value) => value === method) === -1) return new Error (`wrong method type: ${method}`);
    if(params) url += `/${params}`;
    const keyArr = Object.keys(query);
    if(keyArr.length !== 0){
        for (let key in keyArr) {
            const index = keyArr[key];
            const value = query[index];
            key > 0 ? url += `&${index}=${value}` : url += `?${index}=${value}`
        }
    }
    const setting = {
        method,
        headers:{
            "x-apikey":apiKey
        }
    }
    if(method !== "get" && !isEmptyObject(body)){
        setting.body = JSON.stringify(body);
        setting.headers["Content-Type"] = "application/json";
    }

    if(headers){
        //檢查是否有header index
        const headerArr = headers.split(",");
        for (const headerStr of headerArr) {
            const header = headerStr.split("=");
            setting.headers[header[0]] = header[1];
        }
    }

    const result = await fetch(url ,setting)
        .then(res => {
            // logger(res);
            return res
        })
        .then( res => res.json())
        .catch( error => {
            logger(`[ERROR] fetch URL:${url} error`);
            throw error
        })
    return result;
}

module.exports = fetchTools;