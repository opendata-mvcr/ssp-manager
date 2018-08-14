
(function initialize() {
    const express = require("express");
    const app = express();

    const server = require("./server.common");
    server.initializeApi(app);
    initializeWebpack(app);
    server.start(app);
})();

function initializeWebpack(app) {
    const webpack = require("webpack");
    const webpackConfig = require("../build/webpack.develop.js");
    const webpackMiddleware = require("webpack-dev-middleware");
    const webpackCompiler = webpack(webpackConfig);
    app.use(webpackMiddleware(webpackCompiler, {
        // publicPath starts with '.' we need to skip it.
        "publicPath": webpackConfig.output.publicPath.substr(1),
        "stats": {
            "chunks": false,
            "children": false
        }
    }));
    // https://github.com/webpack-contrib/webpack-hot-middleware
    const webpackHotMiddleware = require("webpack-hot-middleware");
    app.use(webpackHotMiddleware(webpackCompiler));
}
