const path = require("path");
const webpack = require("webpack")

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
    /*plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]*/
};