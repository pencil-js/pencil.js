const EsmWebpackPlugin = require("@purtuga/esm-webpack-plugin");
const { resolve } = require("path");
const { BannerPlugin } = require("webpack");

const { name, version, homepage, author, license } = require("./modules/pencil.js/package.json");

const mainModule = "./modules/pencil.js/";

const entry = resolve(__dirname, `${mainModule}pencil.js`);
const path = resolve(__dirname, `${mainModule}dist`);

const banner = new BannerPlugin(`${name} v${version} ${homepage}
${license} license - © ${author}`);

module.exports = [{
    entry,
    plugins: [
        banner,
    ],
    output: {
        path,
        filename: "pencil.min.js",
        library: "Pencil",
        libraryTarget: "global",
        libraryExport: "default",
    },
}, {
    entry,
    plugins: [
        banner,
        new EsmWebpackPlugin(),
    ],
    output: {
        path,
        filename: "pencil.esm.js",
        library: "Pencil",
        libraryTarget: "var",
    },
}];
