function initializeApi(app) {
    initializeApiRoutes(app);
}

function initializeApiRoutes(app) {
    app.use("/api/v1/concepts", require("./routes/concepts"));
    app.use("/api/v1/labels", require("./routes/labels"));
    app.use("/api/v1/webvowl", require("./routes/webvowl"));
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