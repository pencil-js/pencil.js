const EsmWebpackPlugin = require("@purtuga/esm-webpack-plugin");
const { BannerPlugin } = require("webpack");

const { name, version, homepage, author, license } = require("./package.json");

const banner = new BannerPlugin(`${name} v${version} ${homepage}
${license} license - © ${author}`);

const output = {
    library: "Pencil",
};
const devtool = "source-map";

module.exports = [
    {
        plugins: [
            banner,
        ],
        output: {
            ...output,
            filename: "pencil.min.js",
            libraryTarget: "global",
            libraryExport: "default",
        },
        devtool,
    },
    {
        plugins: [
            banner,
            new EsmWebpackPlugin(),
        ],
        output: {
            ...output,
            filename: "pencil.esm.js",
            libraryTarget: "var",
        },
        devtool,
    },
];
