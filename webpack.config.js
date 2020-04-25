const EsmWebpackPlugin = require("@purtuga/esm-webpack-plugin");
const { resolve } = require("path");
const { BannerPlugin } = require("webpack");

const { name, version, homepage, author, license } = require("./modules/pencil.js/package.json");

const mainModule = "./modules/pencil.js/";

const entry = resolve(__dirname, `${mainModule}index.js`);
const path = resolve(__dirname, `${mainModule}dist`);

const banner = new BannerPlugin(`${name} v${version} ${homepage}
${license} license - © ${author}`);

const output = {
    path,
    library: "Pencil",
};
const devtool = "source-map";

module.exports = [{
    entry,
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
}, {
    entry,
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
}];
