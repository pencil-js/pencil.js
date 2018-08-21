const { resolve } = require("path");

const mainModule = "./modules/pencil.js/";

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
    entry: `${mainModule}pencil.js`,
    output: {
        path: resolve(__dirname, `${mainModule}dist`),
        filename: "pencil.min.js",
        library: "Pencil",
        libraryTarget: "this",
        libraryExport: "default",
    },
};
