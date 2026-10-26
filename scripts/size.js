/**
 * Report the size of the bundles and check tree-shaking
 * Run "npm run build" before
 */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { gzipSync } from "node:zlib";
import { build } from "vite";

const root = resolve(import.meta.dirname, "..");
const kB = bytes => `${(bytes / 1024).toFixed(1)} kB`;
const sizeOf = code => ({
    raw: Buffer.byteLength(code),
    gzip: gzipSync(code).length,
});

const results = [];

for (const file of ["pencil.min.js", "pencil.esm.js"]) {
    const { raw, gzip } = sizeOf(readFileSync(join(root, "dist", file)));
    results.push([`dist/${file}`, raw, gzip]);
}

// Bundle a few typical imports from the published modules to measure tree-shaking
const scenarios = {
    "import { Position }": "import { Position } from \"pencil.js\"; console.log(new Position(1, 2));",
    "import { Scene, Circle }": "import { Scene, Circle } from \"pencil.js\"; new Scene().add(new Circle()).render();",
    "import Circle from \"pencil.js/circle\"": "import Circle from \"pencil.js/circle\"; console.log(new Circle());",
    "import everything": "import Pencil from \"pencil.js\"; console.log(Pencil);",
};

const temp = mkdtempSync(join(tmpdir(), "pencil-size-"));
try {
    for (const [name, code] of Object.entries(scenarios)) {
        const entry = join(temp, "entry.js");
        writeFileSync(entry, code);
        const output = await build({
            configFile: false,
            logLevel: "silent",
            root: temp,
            resolve: {
                alias: [
                    { find: /^pencil\.js\/(.*)$/, replacement: join(root, "dist", "$1.js") },
                    { find: /^pencil\.js$/, replacement: join(root, "dist", "index.js") },
                ],
            },
            build: {
                write: false,
                minify: true,
                rolldownOptions: {
                    input: entry,
                },
            },
        });
        const chunk = (Array.isArray(output) ? output[0] : output).output.find(one => one.type === "chunk");
        const { raw, gzip } = sizeOf(chunk.code);
        results.push([name, raw, gzip]);
    }
}
finally {
    rmSync(temp, { recursive: true, force: true });
}

const width = Math.max(...results.map(([name]) => name.length));
console.log(`${"".padEnd(width)}  ${"minified".padStart(10)}  ${"gzip".padStart(10)}`);
for (const [name, raw, gzip] of results) {
    console.log(`${name.padEnd(width)}  ${kB(raw).padStart(10)}  ${kB(gzip).padStart(10)}`);
}
