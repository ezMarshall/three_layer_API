const fs = require("fs");
const util = require("util");

//提供時間戳
function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

const createLogFile = fs.createWriteStream( `./logs/${getCurrentDateTime()}.log`, {flags: "w"});

//進行log file紀錄
const logger = function (contents) {
    const date = getCurrentDateTime();
    console.log(date, contents);
    createLogFile.write(util.format(date, contents) + '\n');
};

module.exports = logger;