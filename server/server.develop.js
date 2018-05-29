
(function initialize() {
    const express = require("express");
    const app = express();

    const server = require("./server.common");
    server.initializeApi(app);
    initializeWebpack(app);
    server.initializeStatic(app);
    server.start(app);
})();

function initializeWebpack(app) {
    const webpack = require("webpack");
    const webpackConfig = require("../build/webpack.develop.js");
    const webpackMiddleware = require("webpack-dev-middleware");
    const compiler = webpack(webpackConfig);
    app.use(webpackMiddleware(compiler, {
        "publicPath": webpackConfig.output.publicPath,
        "stats": {
            "colors": true,
            "chunks": false
        }
    }));
}
