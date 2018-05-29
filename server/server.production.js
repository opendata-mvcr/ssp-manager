(function initialize() {
    const express = require("express");
    const app = express();

    const server = require("./server.common");
    server.initializeApi(app);
    initializeBundlePath(app);
    server.initializeStatic(app);
    server.start(app);
})();

function initializeBundlePath(app) {
    const path = require("path");
    app.get("/bundle.js", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "public", "bundle.js"));
    });
}

function start(app) {
    const config = require("./config");
    const port = config.port;
    app.listen(port, function onStart(error) {
        if (error) {
            console.error(error);
        }
        console.info("Listening on port %s.", port);
    });
}
