import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

const { version, name, license, homepage } = JSON.parse(readFileSync("./package.json", "utf8"));
const banner = `/*! ${name} v${version} ${homepage} - ${license} license */`;

// Every module is its own entry so users can import "pencil.js/circle"
const entries = Object.fromEntries(readdirSync("src")
    .filter(file => file.endsWith(".ts") && !file.endsWith(".test.ts") && !file.endsWith(".d.ts"))
    .map(file => [file.replace(/\.ts$/, ""), resolve("src", file)]));

export default defineConfig(({ mode }) => ({
    define: {
        __PENCIL_VERSION__: JSON.stringify(version),
    },
    build: mode === "bundle" ? {
        // Single-file minified builds for CDN usage (not using lib mode to get whitespace minification on ESM)
        emptyOutDir: false,
        sourcemap: true,
        minify: true,
        copyPublicDir: false,
        rolldownOptions: {
            input: resolve("src/index.ts"),
            preserveEntrySignatures: "strict",
            output: [
                {
                    format: "es",
                    entryFileNames: "pencil.esm.js",
                    postBanner: banner,
                },
                {
                    format: "iife",
                    name: "Pencil",
                    entryFileNames: "pencil.min.js",
                    exports: "named",
                    postBanner: banner,
                },
            ],
        },
    } : {
        // One file per module, tree-shakable, dependencies kept external
        sourcemap: true,
        minify: false,
        lib: {
            entry: entries,
            formats: ["es"],
        },
        rolldownOptions: {
            external: [/^colord/, "text-direction", "zeptomatch"],
            output: {
                preserveModules: true,
                preserveModulesRoot: "src",
                entryFileNames: "[name].js",
            },
        },
    },
    test: {
        environment: "jsdom",
        // Create jsdom once per worker while keeping each test file isolated (much faster than the default "forks")
        pool: "vmThreads",
        setupFiles: ["./test/setup.ts"],
        include: ["src/**/*.test.ts", "test/**/*.test.ts"],
        coverage: {
            include: ["src/**/*.ts"],
            exclude: ["src/**/*.test.ts", "src/**/*.d.ts"],
            reporter: ["text-summary", "html", "lcov"],
        },
    },
}));
