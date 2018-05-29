const path = require("path");

module.exports = {
    "entry": [
        path.join(__dirname, "..", "client", "index.jsx")
    ],
    "output": {
        "path": path.join(__dirname, "..", "public"),
        "filename": "bundle.js",
        "publicPath": "/"
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
            }, {
                "test": /\.css$/,
                "loader": "style-loader!css-loader"
            }
        ]
    },
    "plugins": []
};