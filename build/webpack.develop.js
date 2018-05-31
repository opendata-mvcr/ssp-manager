const merge = require('webpack-merge');
const common = Object.assign({}, require("./webpack.common"));

module.exports = merge(common, {
    "mode": "development",
    "devtool": "inline-source-map",
    "module": {
        "rules": [
            {
                "test": /\.css$/,
                "loader": "style-loader!css-loader"
            }
        ]
    },
});
