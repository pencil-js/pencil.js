const { BannerPlugin } = require("webpack");

const { name, version, homepage, author, license } = require("./package.json");

const plugins = [
    new BannerPlugin(`${name} v${version} ${homepage}
${license} license - © ${author}`),
];

const output = {
    library: "Pencil",
};
const devtool = "source-map";

module.exports = [
    {
        plugins,
        output: {
            ...output,
            filename: "pencil.min.js",
            libraryTarget: "global",
            libraryExport: "default",
        },
        devtool,
    },
    {
        experiments: {
            outputModule: true,
        },
        plugins,
        output: {
            filename: "pencil.esm.js",
            module: true,
            libraryTarget: "global",
        },
        devtool,
    },
];
