const { resolve } = require("path");
const { BannerPlugin } = require("webpack");

const { name, version, homepage, author, license } = require("./modules/pencil.js/package.json");

const mainModule = "./modules/pencil.js/";

module.exports = {
    plugins: [
        new BannerPlugin(`${name} v${version} ${homepage}
${license} license - © ${author}`),
    ],
    entry: resolve(__dirname, `${mainModule}pencil.js`),
    output: {
        path: resolve(__dirname, `${mainModule}dist`),
        filename: "pencil.min.js",
        library: "Pencil",
        libraryTarget: "this",
        libraryExport: "default",
    },
};
