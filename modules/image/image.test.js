import test from "ava";
import Image from ".";

test.beforeEach((t) => {
    t.context = new Image([10, 20], "url");
});

test("constructor", (t) => {
    t.is(t.context.file, null);
    t.is(t.context.isLoaded, false);
    t.is(t.context.ratio, 0);
});

test.cb("get and set url", (t) => {
    t.is(t.context.url, "url");

    const savedLoad = Image.load;
    Image.load = url => new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                url,
                width: 10,
                height: 20,
            });
        }, 50);
    });

    t.false(t.context.isLoaded);
    t.context.on("ready", () => {
        t.is(t.context.ratio, 0.5);
        t.true(t.context.isLoaded);
        t.is(t.context.width, 10);
        t.is(t.context.height, 20);
        t.end();
    });
    t.context.url = "loadable";
    t.is(t.context.url, "loadable");

    Image.load = savedLoad;
});

test("makePath", (t) => {
    t.context.isLoaded = true;
    const ctx = {
        save: () => t.pass(),
        restore: () => t.pass(),
        translate: () => t.pass(),
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

test("load", (t) => {
    const promise = Image.load([
        "url",
    ]);
    t.true(promise instanceof Promise);
});

test("defaultOptions", (t) => {
    t.is(Image.defaultOptions.fill, null);
});
