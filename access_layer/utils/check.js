const check = {
    isEmptyObject(obj = {}){
        const keys = Object.keys(obj);
        return keys.length === 0 ? true:false
    }
}

module.exports = check;