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
    entry: "./pencil.js",
    output: {
        filename: "pencil.min.js",
        library: "Pencil",
        libraryTarget: "this",
        libraryExport: "default",
    },
};
