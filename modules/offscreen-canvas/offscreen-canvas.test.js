import test from "ava";
import OffscreenCanvas from "./offscreen-canvas";

test.beforeEach((t) => {
    t.context = new OffscreenCanvas(100, 200);
});

test("constructor", (t) => {
    t.truthy(t.context.ctx);
    t.is(t.context.width, 100);
    t.is(t.context.height, 200);

    const defaultValue = new OffscreenCanvas();
    t.is(defaultValue.width, 1);
    t.is(defaultValue.height, 1);
});

test("get and set width and height", (t) => {
    t.context.width = 42;
    t.context.height = 99;

    t.is(t.context.width, 42);
    t.is(t.context.height, 99);
});

test("render", (t) => {
    const ctx = {
        render: () => {},
    };
    t.is(t.context.render(ctx), t.context);
});

test("clear", (t) => {
    t.is(t.context.clear(), t.context);
});

test("get and set imageData", (t) => {
    const data = t.context.imageData;
    t.context.imageData = data;
    t.pass();
});

test("toImg", (t) => {
    const img = t.context.toImg();
    t.is(img.width, 100);
    t.is(img.height, 200);
    t.true(img instanceof window.HTMLImageElement);
    t.truthy(img.src);
});
