const path = require("path");
const config = require("../config");

(function initialize() {
    ensureDirExistsSynch(config["workingDirectory"]);
    module.exports = {
        "get": getPath
    };
})();

function ensureDirExistsSynch(path) {
    const fileSystem = require("fs");
    if (!fileSystem.existsSync(path)) {
        fileSystem.mkdirSync(path);
    }
}

function getDateAsString(date) {
    return date.getFullYear() + "" +
        zfill(date.getMonth(), 2) + "" +
        zfill(date.getDate(), 2) + "" +
        zfill(date.getHours(), 2) + "" +
        zfill(date.getSeconds(), 2);
}

function zfill(number, size) {
    number = number.toString();
    while (number.length < size) number = "0" + number;
    return number;
}

function getPath(fileName) {
    return path.join(config["workingDirectory"], fileName);
}

