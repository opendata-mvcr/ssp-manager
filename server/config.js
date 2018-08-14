const config = require("../configuration");

module.exports = {
    "port": config["port"],
    "endpoint": config["spaqrl-endpoint"],
    "graph": config["spaqrl-graph"],
    "workingDirectory": config["working-directory"],
    "url": config["url"],
    "etl": config["lp-etl"],
    "pipeline": encodeURIComponent(config["lp-etl-pipeline"])
};