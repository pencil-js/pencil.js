/**
 * Headless rendering benchmark, same scene as https://benchmarks.slaylines.io/
 * (moving squares with a white fill and a black 1px stroke)
 *
 * Usage: npm run bench:headless -- [count=16000] [path/to/other/pencil.min.js …]
 * Run "npm run build" before (Chromium is installed by Playwright on first run).
 * Set CHROMIUM_PATH to use an already installed Chrome or Chromium instead.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";

const root = resolve(import.meta.dirname, "..");
const [countArgument, ...others] = process.argv.slice(2);
const count = Number(countArgument) || 16000;
const frames = 60;
const width = 1000;
const height = 600;

// Same random squares for everyone
const seed = Array.from({ length: count }, (_, index) => {
    const random = n => ((Math.sin((index + 1) * n) * 10000) % 1 + 1) % 1;
    return [random(1) * width, random(2) * height, 10 + (random(3) * 40), 1 + random(4)];
});

/**
 * Runner executed inside the page
 * @param {Object} params - Benchmark parameters
 */
function run ({ kind, squares, frames, width, height }) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    const data = squares.map(square => [...square]);
    let step;

    if (kind === "raw") {
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        step = () => {
            ctx.clearRect(0, 0, width, height);
            for (const square of data) {
                const [x, y, size, speed] = square;
                ctx.fillRect(x, y, size, size);
                ctx.strokeRect(x, y, size, size);
                square[0] = x - speed < -size ? width + size : x - speed;
            }
        };
    }
    else {
        const { Scene, Square } = window.Pencil;
        const scene = new Scene(canvas);
        const shapes = data.map(([x, y, size]) => scene.add(new Square([x, y], size, {
            fill: "white",
            stroke: "black",
            strokeWidth: 1,
        })) && scene.children[scene.children.length - 1]);
        // Update in a "draw" listener, like the online benchmark does
        scene.on("draw", () => {
            for (let i = 0; i < shapes.length; ++i) {
                const shape = shapes[i];
                const [, , size, speed] = data[i];
                shape.position.x -= speed;
                if (shape.position.x < -size) {
                    shape.position.x = width + size;
                }
            }
        }, true);
        step = () => scene.render();
    }

    // Warm-up
    for (let i = 0; i < 10; ++i) {
        step();
    }
    const times = [];
    for (let i = 0; i < frames; ++i) {
        const start = performance.now();
        step();
        // Force the GPU / rasterizer to finish the frame
        canvas.getContext("2d").getImageData(0, 0, 1, 1);
        times.push(performance.now() - start);
    }
    times.sort((a, b) => a - b);
    return times[Math.floor(times.length / 2)];
}

const candidates = [
    ["raw canvas", "raw", null],
    ["pencil v4 (local)", "pencil", resolve(root, "dist/pencil.min.js")],
    ...others.map(file => [file, "pencil", resolve(file)]),
];

const browser = await chromium.launch({
    // Use an existing browser instead of the one installed by Playwright
    executablePath: process.env.CHROMIUM_PATH || undefined,
});
console.log(`${count} squares, median frame time over ${frames} frames`);
for (const [name, kind, file] of candidates) {
    const page = await browser.newPage();
    await page.setContent("<!doctype html><body style='margin:0'></body>");
    if (file) {
        await page.addScriptTag({ content: readFileSync(file, "utf8") });
    }
    const median = await page.evaluate(run, { kind, squares: seed, frames, width, height });
    console.log(`${name.padEnd(30)} ${median.toFixed(1).padStart(8)} ms  (${(1000 / median).toFixed(0)} fps max)`);
    await page.close();
}
await browser.close();
