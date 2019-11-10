import test from "ava";
import Sprite from ".";
import almostEqual from "../../test/_almost-equal";

test.beforeEach((t) => {
    t.context = new Sprite([1, 2], "url", ["data"]);
});

test("constructor", (t) => {
    t.is(t.context.constructor.name, "Sprite");
    t.is(t.context.url, "url");
    t.deepEqual(t.context.frames, ["data"]);
    t.is(t.context.frame, 0);
    t.false(t.context.isPaused);
});

test("setFrame", (t) => {
    t.context.setFrame(0.5);
    t.true(almostEqual(t.context.frame, 0.5));

    t.context.setFrame(2.3);
    t.true(almostEqual(t.context.frame, 0.3));
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.is(json.url, "url");
    t.deepEqual(json.frames, ["data"]);
    t.is(json.frame, 0);
    t.false(json.isPaused);
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
