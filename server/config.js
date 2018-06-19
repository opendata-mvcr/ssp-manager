const config = require("../configuration");

module.exports = {
    "port": config["port"],
    "endpoint": config["endpoint"],
    "workingDirectory": config["working-directory"],
    "url": config["url"]
};