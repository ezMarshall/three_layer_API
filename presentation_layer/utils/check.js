const check = {
    isEmptyObject(obj = {}){
        const keys = Object.keys(obj);
        return keys.length === 0 ;
    }
}

module.exports = check;