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
const resolve = {
    fallback: {
        path: false,
    },
};

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
        resolve,
    },
    {
        experiments: {
            outputModule: true,
        },
        externalsType: "module",
        plugins,
        output: {
            filename: "pencil.esm.js",
            module: true,
            library: {
                type: "module",
            },
            chunkLoading: "import",
            chunkFormat: "module",
        },
        devtool,
        resolve,
    },
];
