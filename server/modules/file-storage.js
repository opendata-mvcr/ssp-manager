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

function getPath(fileName) {
    return path.join(config["workingDirectory"], fileName);
}

