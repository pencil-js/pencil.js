import { test, expect, beforeEach } from "vitest";


let context: any;
import Pattern from "./pattern.js";
import OffScreenCanvas from "./offscreen-canvas.js";
import Image from "./image.js";

const img = new window.Image();
beforeEach(() => {
    context = new Pattern(img, {
        repeat: "???",
        scale: 2,
        origin: [1, 2],
    });
});

test("constructor", () => {
    expect(typeof context.options).toBe("object");
    expect(context.source).toBe(img);
});

test("get and set source", () => {
    const source = new window.Image();
    const blueprint = new Pattern(source);

    context.source = blueprint;
    expect(context.source).toBe(blueprint.source);

    const canvas = new OffScreenCanvas(11, 22);
    context.source = canvas;
    expect(context.source).toBe(canvas.ctx.canvas);

    const image = new Image([], "url");
    image.isLoaded = true;
    context.source = image;
    expect(context.source).toBe(image.file);
});

test("get width and height", () => {
    img.width = 1;
    img.height = 2;
    expect(context.width).toBe(1);
    expect(context.height).toBe(2);
});

test("toString", () => {
    const pattern = {
        setTransform (matrix) {
            expect(matrix.a).toBe(2);
            expect(matrix.d).toBe(2);
        },
    };
    const ctx = {
        createPattern () {
            return pattern;
        },
    };
    expect(context.toString(ctx)).toBe(pattern);

    context.options.scale = [2, 2];
    expect(context.toString(ctx)).toBe(pattern);
});

test("defaultOptions", () => {
    const { repeat, scale, origin } = Pattern.defaultOptions;
    expect(repeat).toBe(Pattern.repetition.repeat);
    expect(scale).toBe(1);
    expect(origin.x).toBe(0);
    expect(origin.y).toBe(0);
});
