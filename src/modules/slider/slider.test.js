import test from "ava";
import Slider from "./slider.js";

test.beforeEach((t) => {
    t.context = new Slider([0, 0], {
        value: 8,
        min: 10,
        max: 100,
        width: 300,
    });
});

test("constructor", (t) => {
    t.not(t.context.handle, undefined);
});

test("click", (t) => {
    t.context.on(Slider.events.change, () => t.pass());
    t.plan(2);
    t.context.click({
        x: t.context.width / 2,
    });
    t.is(t.context.value, 55);
});

test("get and set width", (t) => {
    t.is(t.context.width, 300);

    t.context.width = 666;
    t.is(t.context.width, 666);

    t.throws(() => t.context.width = 1, {
        instanceOf: RangeError,
    });
});

test("get and set value", (t) => {
    t.context.value = 20;
    t.is(t.context.value, 20);

    t.context.value = 5;
    t.is(t.context.value, 10);

    t.context.value = 9999;
    t.is(t.context.value, 100);
});

test("defaultOptions", (t) => {
    const options = Slider.defaultOptions;
    t.is(options.min, 0);
    t.is(options.max, 1);
    t.is(options.width, 200);
});

test("HEIGHT", (t) => {
    t.is(Slider.HEIGHT, 20);
});
