const { DefinePlugin } = require("webpack");
const { resolve } = require("path");
const { version } = require("./modules/pencil.js/package.json");

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
        ],
    },
    plugins: [
        new DefinePlugin({
            VERSION: JSON.stringify(version),
        }),
    ],
    entry: "./modules/pencil.js/pencil.js",
    output: {
        path: resolve(__dirname, "modules/pencil.js/dist"),
        filename: "pencil.min.js",
        library: "Pencil",
        libraryTarget: "this",
        libraryExport: "default",
    },
};
