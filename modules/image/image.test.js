import test from "ava";
import Image from "./image";

test.beforeEach((t) => {
    t.context = new Image([10, 20], "url", 100, 200);
});

test("constructor", (t) => {
    t.is(t.context.url, "url");
    t.is(t.context.file, null);
    t.is(t.context.isLoaded, false);
    t.is(t.context.ratio, 0);
});

test.todo("get and set url");

test("makePath", (t) => {
    t.context.isLoaded = true;
    global.Path2D.prototype.rect = () => t.pass();
    const ctx = {
        drawImage: () => t.pass(),
        fill: () => t.pass(),
        stroke: () => t.fail(),
    };
    t.context.makePath(ctx);
});

test("restoreSize", (t) => {
    t.context.file = {
        width: 42,
        height: 55,
    };
    t.context.isLoaded = true;
    t.context.restoreSize();
    t.is(t.context.width, 42);
    t.is(t.context.height, 55);
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.is(json.url, "url");
});

test("from", (t) => {
    const definition = {
        url: "url",
    };
    const image = Image.from(definition);

    t.is(image.url, "url");
});

test.todo("load");

test("defaultOptions", (t) => {
    t.is(Image.defaultOptions.fill, null);
});
