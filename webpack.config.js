// import webpack from "webpack";
// import pkg from "./package.json";

// const { BannerPlugin } = webpack;
// const { name, version, homepage, author, license } = pkg;

const plugins = [
//     new BannerPlugin(`${name} v${version} ${homepage}
// ${license} license - © ${author}`),
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

export default [
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
