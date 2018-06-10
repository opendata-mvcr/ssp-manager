const config = require("../configuration");

module.exports = {
    "port": config["port"],
    "endpoint": config["endpoint"],
    "workingDirectory": config["workingDirectory"],
    "url": config["url"]
};