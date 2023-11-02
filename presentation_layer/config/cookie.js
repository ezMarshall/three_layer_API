const { getEnv } = require("../utils/env_parser")

module.exports = {
    signed: getEnv("COOKIE_SIGNED" ,"boolean" ,true),
    path: getEnv("COOKIE_PATH"),
    httpOnly: getEnv("COOKIE_HTTPONLY" ,"boolean" ,true),
    maxAge: getEnv("COOKIE_MAXAGE" ,"number",8640000),//預設一天
    secure: getEnv("COOKIE_SECURE" ,"boolean" ,false),//samsit = none 必須打開,使用https
    sameSite:getEnv("COOKIE_SAMESITE" ,"" ,"strict")//strict || lax || none
}
