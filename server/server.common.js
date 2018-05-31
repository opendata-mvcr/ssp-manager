function initializeApi(app) {
    initializeParsers(app);
    initializeApiRoutes(app);
}

function initializeParsers(app) {
    const bodyParser = require("body-parser");
    // Parse application/x-www-form-urlencoded.
    app.use(bodyParser.urlencoded({"extended": false}));
    // Parse application/json.
    app.use(bodyParser.json());
}

function initializeApiRoutes(app) {
    app.use("/api/v1/concepts", require("./routes/concepts"));
    app.use("/api/v1/labels", require("./routes/labels"));
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

module.exports = {
    "initializeApi" : initializeApi,
    "start": start
};