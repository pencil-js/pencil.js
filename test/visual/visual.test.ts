/**
 * Render small targeted scenes and compare them pixel by pixel with reference images.
 *
 * To create or update the references after an intended change:
 *     npm run test:visual:update
 * then check the new images in test/visual/references before committing them.
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, test, expect } from "vitest";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import Scene from "../../src/scene.js";
import scenes from "./scenes.js";

const folder = dirname(fileURLToPath(import.meta.url));
const references = join(folder, "references");
const output = join(folder, "__output__");
const isUpdate = Boolean(process.env.UPDATE_VISUAL);

/** Color distance below which two pixels are considered identical (0 to 1) */
const THRESHOLD = 0.05;
/** Ratio of different pixels allowed */
const TOLERANCE = 0.001;

/**
 * Render a scene into a PNG
 * @param draw - Function filling the scene
 * @param width - Canvas width
 * @param height - Canvas height
 */
const render = async (draw: (scene: Scene) => unknown, width: number, height: number): Promise<PNG> => {
    const canvas = window.document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const scene = new Scene(canvas, {
        fill: "#fff",
    });
    await draw(scene);
    const { data } = scene.getImageData();
    scene.destroy();

    const png = new PNG({ width, height });
    png.data.set(data);
    return png;
};

describe("visual", () => {
    rmSync(output, { recursive: true, force: true });
    mkdirSync(output, { recursive: true });
    mkdirSync(references, { recursive: true });

    for (const [name, { draw, width = 100, height = 100 }] of Object.entries(scenes)) {
        test(name, async () => {
            const actual = await render(draw, width, height);
            const referencePath = join(references, `${name}.png`);

            if (isUpdate) {
                writeFileSync(referencePath, PNG.sync.write(actual));
                return;
            }

            if (!existsSync(referencePath)) {
                writeFileSync(join(output, `${name}.png`), PNG.sync.write(actual));
                throw new Error(`Missing reference for "${name}", run "npm run test:visual:update".`);
            }

            const expected = PNG.sync.read(readFileSync(referencePath));
            expect([actual.width, actual.height]).toEqual([expected.width, expected.height]);

            const diff = new PNG({ width, height });
            const different = pixelmatch(expected.data, actual.data, diff.data, width, height, {
                threshold: THRESHOLD,
                // Rendering is deterministic, so anti-aliased pixels must match too
                includeAA: true,
            });

            if (different) {
                // Keep the result to help debugging (uploaded by the CI on failure)
                writeFileSync(join(output, `${name}.png`), PNG.sync.write(actual));
                writeFileSync(join(output, `${name}-diff.png`), PNG.sync.write(diff));
            }

            expect(different / (width * height), `${different} different pixels`).toBeLessThanOrEqual(TOLERANCE);
        });
    }
});
