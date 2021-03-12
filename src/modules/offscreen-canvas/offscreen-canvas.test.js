import test from "ava";
import OffscreenCanvas from ".";
import Scene from "../scene";

test.beforeEach((t) => {
    t.context = new OffscreenCanvas(100, 200, {
        fill: "red",
    });
});

test("constructor", (t) => {
    t.truthy(t.context.ctx);
    t.is(t.context.width, 100);
    t.is(t.context.height, 200);

    const defaultValue = new OffscreenCanvas();
    t.is(defaultValue.width, 1);
    t.is(defaultValue.height, 1);
});

test("setImageSmoothing", (t) => {
    t.context.setImageSmoothing(false);
    t.false(t.context.ctx.imageSmoothingEnabled);
    t.context.setImageSmoothing(true);
    t.true(t.context.ctx.imageSmoothingEnabled);
});

test("clear", (t) => {
    t.is(t.context.clear(), t.context);
});

test("render", (t) => {
    t.is(t.context.render(), t.context);
});

test("get and set width and height", (t) => {
    t.is(t.context.width, 100);
    t.is(t.context.height, 200);

    t.context.width = 42;
    t.context.height = 99;

    t.is(t.context.width, 42);
    t.is(t.context.height, 99);
});

test("get size", (t) => {
    const { size } = t.context;
    t.is(size.x, 100);
    t.is(size.y, 200);
});

test("get center", (t) => {
    const { center } = t.context;
    t.is(center.x, 50);
    t.is(center.y, 100);
});

test("getRandomPosition", (t) => {
    for (let i = 0; i < 100; ++i) {
        const position = t.context.getRandomPosition();
        t.true(position.x > 0 && position.x < 800);
        t.true(position.y > 0 && position.y < 600);
    }
});

test("get and set imageData", (t) => {
    const override = expected => (...args) => {
        t.deepEqual(args, expected);
    };
    t.context.ctx.getImageData = override([10, 11, 20, 21]);
    t.context.getImageData([[10, 11], [20, 21]]);
    t.context.ctx.getImageData = override([0, 0, 100, 200]);
    const imgData = t.context.getImageData();

    t.context.ctx.putImageData = (data, ...args) => {
        t.is(data, imgData);
        t.deepEqual(args, [20, 22]);
    };
    t.context.setImageData(imgData, [20, 22]);
});

test("toImage", (t) => {
    const img = t.context.toImage();
    t.is(img.width, 100);
    t.is(img.height, 200);
    t.truthy(img.src);
    const cropped = t.context.toImage([[10, 20], [30, 60]]);
    t.is(cropped.width, 20);
    t.is(cropped.height, 40);
});

test("getDrawingContext", (t) => {
    const ctx = OffscreenCanvas.getDrawingContext(10, 20);
    t.is(ctx.constructor.name, "CanvasRenderingContext2D");
    t.is(ctx.canvas.width, 10);
    t.is(ctx.canvas.height, 20);
});

test("defaultOptions", (t) => {
    t.is(Scene.defaultOptions.fill, null);
    t.is(Scene.defaultOptions.opacity, 1);
});
