import test from "ava";
import Image from "./image.js";

test.beforeEach((t) => {
    t.context = new Image([10, 20], "url");
});

test("constructor", (t) => {
    t.is(t.context.file, null);
    t.is(t.context.isLoaded, false);
});

test("get and set url", async (t) => {
    t.is(t.context.url, "url");

    const savedLoad = Image.load;
    Image.load = url => new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                src: url,
                width: 10,
                height: 20,
            });
        }, 10);
    });

    t.context.url = null;
    t.false(t.context.isLoaded);
    t.context.url = "loadable";
    await new Promise((resolve) => {
        t.context.on("ready", () => {
            t.true(t.context.isLoaded);
            t.is(t.context.width, 10);
            t.is(t.context.height, 20);
            resolve();
        });
    });
    t.is(t.context.url, "loadable");

    Image.load = savedLoad;
});

test("set same url", (t) => {
    const savedLoad = Image.load;
    Image.load = () => t.fail();

    t.context.url = "url";
    t.pass();

    Image.load = savedLoad;
});

test("fail url load", async (t) => {
    const savedLoad = Image.load;
    Image.load = () => Promise.reject();

    t.context.url = "fail";
    await new Promise((resolve, reject) => {
        t.context
            .on("ready", () => reject())
            .on("error", (event) => {
                t.is(event.target, t.context);
                resolve();
            });
    });

    Image.load = savedLoad;
});

test("set url as a image file", (t) => {
    const file = new window.Image();
    file.src = "whoa";

    t.context.url = file;

    t.is(t.context.url, "whoa");
    t.is(t.context.file, file);
});

test("set url as another Image", async (t) => {
    const savedLoad = Image.load;
    Image.load = url => new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                url,
                width: Math.random(),
                height: Math.random(),
            });
        }, 100);
    });

    const blueprintReady = new Image(undefined, "I'm ready");
    await new Promise((resolve) => {
        blueprintReady.on("ready", () => {
            t.context.url = blueprintReady;

            t.is(t.context.url, blueprintReady.url);
            t.is(t.context.file, blueprintReady.file);
            resolve();
        });
    });

    Image.load = savedLoad;

    t.pass();
});

test("makePath", (t) => {
    t.context.isLoaded = true;
    t.context.options.fill = true;
    t.context.options.stroke = true;
    const ctx = {
        save: () => t.pass(),
        restore: () => t.pass(),
        translate: () => t.pass(),
        drawImage: () => t.pass(),
        fill: () => t.pass(),
        stroke: () => t.pass(),
    };
    t.context.makePath(ctx);
});

test("isHover", (t) => {
    // not loaded, should call nothing
    t.false(t.context.isHover([0, 0], {}));

    const ctx = {
        save: () => t.pass(),
        restore: () => t.pass(),
        translate: () => t.pass(),
        isPointInPath: () => t.pass(),
    };
    t.context.isLoaded = true;
    t.context.isHover([0, 0], ctx);
});

test("tint option", (t) => {
    t.context.options.tint = {
        toString () {
            t.pass();
            return "";
        },
    };

    const ctx = {
        drawImage: (canvas, x, y) => {
            t.is(canvas.constructor.name, "HTMLCanvasElement");
            t.is(x, 0);
            t.is(y, 0);
        },
    };
    t.context.draw(ctx);

    t.plan(4);
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
