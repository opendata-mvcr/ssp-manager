const config = require("../configuration");

module.exports = {
    "port": config["port"],
    "endpoint": config["spaqrl-endpoint"],
    "workingDirectory": config["working-directory"],
    "url": config["url"]
};