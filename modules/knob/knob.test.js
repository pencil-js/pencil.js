import test from "ava";
import Knob from ".";
import almostEqual from "../../test/_almost-equal";

test.beforeEach((t) => {
    t.context = new Knob([0, 0], {
        value: 2,
    });
});

test("constructor", (t) => {
    t.true(t.context.background.isRotatable);
});

test("get and set value", (t) => {
    t.context.value = 8;
    t.true(almostEqual(t.context.value, 8));
    t.true(almostEqual(t.context.background.options.rotation, 8 / 10));

    t.context.value = -5;
    t.true(almostEqual(t.context.value, 5));
    t.true(almostEqual(t.context.background.options.rotation, 5 / 10));

    t.context.value = 16;
    t.true(almostEqual(t.context.value, 6));
    t.true(almostEqual(t.context.background.options.rotation, 6 / 10));
});

test("default options and NOTCH_SIZE", (t) => {
    const { defaultOptions } = Knob;
    t.is(defaultOptions.min, 0);
    t.is(defaultOptions.max, 10);
    t.is(defaultOptions.value, 0);
    t.is(defaultOptions.radius, 100);

    t.is(Knob.NOTCH_SIZE, 0.09);
});
