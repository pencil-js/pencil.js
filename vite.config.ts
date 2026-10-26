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
        // Single-file builds for CDN usage
        emptyOutDir: false,
        sourcemap: true,
        lib: {
            entry: resolve("src/index.ts"),
            name: "Pencil",
            formats: ["es", "iife"],
            fileName: format => (format === "es" ? "pencil.esm.js" : "pencil.min.js"),
        },
        rolldownOptions: {
            output: {
                banner,
                exports: "named",
            },
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
        setupFiles: ["./test/setup.ts"],
        include: ["src/**/*.test.ts", "test/**/*.test.ts"],
        coverage: {
            include: ["src/**/*.ts"],
            exclude: ["src/**/*.test.ts", "src/**/*.d.ts"],
            reporter: ["text-summary", "html", "lcov"],
        },
    },
}));
