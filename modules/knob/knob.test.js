import test from "ava";
import Knob from ".";
import almostEqual from "../../test/_almost-equal";

test.beforeEach((t) => {
    t.context = new Knob([0, 0], {
        value: 2,
    });
});

test("constructor", (t) => {
    t.true(t.context.isRotatable);
    t.context.click(); // Should do nothing
});

test("get and set radius", (t) => {
    t.is(t.context.radius, 100);

    t.context.radius = 200;
    t.is(t.context.radius, 200);
});

test("get and set value", (t) => {
    t.context.value = 0.8;
    t.true(almostEqual(t.context.value, 0.8));
    t.true(almostEqual(t.context.options.rotation, 0.8));

    t.context.value = -1.5;
    t.true(almostEqual(t.context.value, 0.5));
    t.true(almostEqual(t.context.options.rotation, 0.5));

    t.context.value = 2.6;
    t.true(almostEqual(t.context.value, 0.6));
    t.true(almostEqual(t.context.options.rotation, 0.6));
});

test("default options and NOTCH_SIZE", (t) => {
    const { defaultOptions } = Knob;
    t.is(defaultOptions.min, 0);
    t.is(defaultOptions.max, 1);
    t.is(defaultOptions.value, 0);
    t.is(defaultOptions.radius, 100);

    t.is(Knob.NOTCH_SIZE, 0.09);
});
