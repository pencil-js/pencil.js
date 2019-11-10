import test from "ava";
import Sprite from ".";
import almostEqual from "../../test/_almost-equal";

test.beforeEach((t) => {
    t.context = new Sprite([1, 2], "url", [{
        spriteSourceSize: {},
        frame: {},
    }, {
        spriteSourceSize: {},
        frame: {},
    }]);
});

test("constructor", (t) => {
    t.is(t.context.constructor.name, "Sprite");
    t.is(t.context.url, "url");
    t.is(t.context.frames.length, 2);
    t.is(t.context.frame, 0);
    t.false(t.context.isPaused);
});

test("makePath", (t) => {
    t.context.isLoaded = true;
    t.context.options.loop = false;
    t.context.frame = 0.9;
    const ctx = new window.CanvasRenderingContext2D();
    t.context.makePath(ctx);
    t.pass();
});

test("setFrame", (t) => {
    t.context.setFrame(0.5);
    t.true(almostEqual(t.context.frame, 0.5));

    t.context.setFrame(5.3);
    t.true(almostEqual(t.context.frame, 1.3));
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.is(json.url, "url");
    t.is(json.frames.length, 2);
    t.is(json.frame, 0);
    t.false(json.isPaused);
});

test("from", (t) => {
    const sprite = Sprite.from({
        position: [10, 20],
        url: "url",
        frames: [{}],
        frame: 0.6,
        isPaused: true,
    });

    t.is(sprite.url, "url");
    t.is(sprite.frames.length, 1);
    t.true(almostEqual(sprite.frame, 0.6));
    t.true(sprite.isPaused);
});

test("sheet", async (t) => {
    window.fetch = () => new Promise(resolve => resolve({
        json: () => new Promise(res => res({
            meta: {
                image: "",
            },
            frames: {},
        })),
    }));

    Sprite.load = () => t.pass();

    const sheet = await Sprite.sheet("url");
    t.true(typeof sheet.json === "object");
    t.true(typeof sheet.extract === "function");

    const sprite = sheet.extract([4, 5], "any");

    t.true(sprite instanceof Sprite);
});

test("play / pause", (t) => {
    t.context.options.speed = 0.1;
    t.context.pause();

    t.is(t.context.options.speed, 0.1);
    t.true(t.context.isPaused);

    t.context.play();
    t.is(t.context.options.speed, 0.1);
    t.false(t.context.isPaused);

    t.context.play(2);
    t.is(t.context.options.speed, 2);
});

test("defaultOptions", (t) => {
    t.is(Sprite.defaultOptions.speed, 1);
    t.is(Sprite.defaultOptions.loop, true);
});
