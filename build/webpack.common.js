const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const configuration = require("../configuration");

module.exports = {
    "entry": [
        path.join(__dirname, "..", "client", "index.jsx")
    ],
    "output": {
        "path": path.join(__dirname, "..", "dist"),
        "filename": "bundle.js",
        "publicPath": "./"
    },
    "resolve": {
        // This allow us to use absolute paths for modules inside the
        // application.
        "modules": ["client", "node_modules"],
        // Enable implicit resolution of jsx files.
        // Otherwise we would need to specify the jsx extension.
        "extensions": [".js", ".jsx", "*"]
    },
    "module": {
        "rules": [
            {
                "test": /\.jsx?$/,
                "loaders": ["babel-loader"]
            }
        ]
    },
    "plugins": [
        new HtmlWebpackPlugin({
            "filename": "index.html",
            "template": path.join(__dirname, "..", "public", "index.html"),
            "inject": true
        }),
        new webpack.DefinePlugin({
            "GLOBAL_CONFIG.WEBOVWL": JSON.stringify(configuration.webvowl)
        })
    ]
};