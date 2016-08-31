let path = require("path");

module.exports = {
    context: path.join(__dirname, "src"),
    entry: "./entry",
    output: {
        path: path.join(__dirname, "build"),
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/ , loader: "babel-loader?cacheDirectory" }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
};