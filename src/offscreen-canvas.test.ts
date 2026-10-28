import { test, expect, beforeEach } from "vitest";


let context: any;
import Scene from "./scene.js";
import OffscreenCanvas from "./offscreen-canvas.js";

beforeEach(() => {
    context = new OffscreenCanvas(100, 200, {
        fill: "red",
    });
});

test("constructor", () => {
    expect(context.ctx).toBeTruthy();
    expect(context.width).toBe(100);
    expect(context.height).toBe(200);

    const defaultValue = new OffscreenCanvas();
    expect(defaultValue.width).toBe(1);
    expect(defaultValue.height).toBe(1);
});

test("setImageSmoothing", () => {
    context.setImageSmoothing(false);
    expect(context.ctx.imageSmoothingEnabled).toBe(false);
    context.setImageSmoothing(true);
    expect(context.ctx.imageSmoothingEnabled).toBe(true);
});

test("clear", () => {
    expect(context.clear()).toBe(context);
});

test("render", () => {
    expect(context.render()).toBe(context);
});

test("get and set width and height", () => {
    expect(context.width).toBe(100);
    expect(context.height).toBe(200);

    context.width = 42;
    context.height = 99;

    expect(context.width).toBe(42);
    expect(context.height).toBe(99);
});

test("get size", () => {
    const { size } = context;
    expect(size.x).toBe(100);
    expect(size.y).toBe(200);
});

test("get center", () => {
    const { center } = context;
    expect(center.x).toBe(50);
    expect(center.y).toBe(100);
});

test("getRandomPosition", () => {
    for (let i = 0; i < 100; ++i) {
        const position = context.getRandomPosition();
        expect(position.x > 0 && position.x < 800).toBe(true);
        expect(position.y > 0 && position.y < 600).toBe(true);
    }
});

test("get and set imageData", () => {
    const override = expected => (...args) => {
        expect(args).toEqual(expected);
    };
    // Second position is the end of the box (width and height are 10)
    context.ctx.getImageData = override([10, 11, 10, 10]);
    context.getImageData([[10, 11], [20, 21]]);
    context.ctx.getImageData = override([0, 0, 100, 200]);
    const imgData = context.getImageData();

    context.ctx.putImageData = (data, ...args) => {
        expect(data).toBe(imgData);
        expect(args).toEqual([20, 22]);
    };
    context.setImageData(imgData, [20, 22]);
});

test("toImage", () => {
    const img = context.toImage();
    expect(img.width).toBe(100);
    expect(img.height).toBe(200);
    expect(img.src).toBeTruthy();
    const cropped = context.toImage([[10, 20], [30, 60]]);
    expect(cropped.width).toBe(20);
    expect(cropped.height).toBe(40);
});

test("getDrawingContext", () => {
    const ctx = OffscreenCanvas.getDrawingContext(10, 20);
    expect(typeof ctx.fillRect).toBe("function");
    expect(ctx.canvas.width).toBe(10);
    expect(ctx.canvas.height).toBe(20);
});

test("defaultOptions", () => {
    expect(Scene.defaultOptions.fill).toBe(null);
    expect(Scene.defaultOptions.opacity).toBe(1);
});
