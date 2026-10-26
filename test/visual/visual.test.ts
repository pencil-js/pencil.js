/**
 * Render reference scenes and compare them with the v3 output (rendered in a browser)
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, test, expect } from "vitest";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import Pencil from "../../src/index.js";
import allShapes from "./all-shapes.js";
import allInputs from "./all-inputs.js";

const folder = dirname(fileURLToPath(import.meta.url));
const output = join(folder, "__output__");

const cases = {
    "all-shapes": {
        draw: allShapes,
        // Text use a web font not available here
        tolerance: 0.06,
    },
    "all-inputs": {
        draw: allInputs,
        // Fonts are different from the browser
        tolerance: 0.04,
    },
};

describe("visual", () => {
    for (const [name, { draw, tolerance }] of Object.entries(cases)) {
        test(name, async () => {
            const expected = PNG.sync.read(readFileSync(join(folder, `${name}.png`)));
            const { width, height } = expected;
            const canvas = window.document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const scene = new Pencil.Scene(canvas);
            await draw(scene, Pencil);
            const { data } = scene.getImageData();

            const actual = new PNG({ width, height });
            actual.data.set(data);
            const diff = new PNG({ width, height });
            const different = pixelmatch(expected.data, actual.data, diff.data, width, height, {
                threshold: 0.2,
            });

            mkdirSync(output, { recursive: true });
            writeFileSync(join(output, `${name}.png`), PNG.sync.write(actual));
            writeFileSync(join(output, `${name}-diff.png`), PNG.sync.write(diff));

            expect(different / (width * height)).toBeLessThan(tolerance);
            scene.destroy();
        });
    }
});
