import test from "ava";
import ProgressBar from ".";

test.beforeEach((t) => {
    t.context = new ProgressBar([0, 0], {
        value: 0.8,
        width: 300,
    });
});

test("click", (t) => {
    t.context.click();
    t.pass();
});

test("trace", (t) => {
    const noop = () => {};
    const ctx = {
        save: noop,
        translate: noop,
        scale: noop,
        restore: noop,
        fill: noop,
        stroke: noop,
        setLineDash: noop,
    };
    t.context.render(ctx);
    t.pass();
});

test("get and set width", (t) => {
    t.is(t.context.width, 300);
    t.is(t.context.height, 20);

    t.context.width = 666;
    t.is(t.context.width, 666);

    t.throws(() => t.context.width = 1, {
        instanceOf: RangeError,
    });
});

test("get and set value", (t) => {
    t.context.fire({
        name: "attach",
        target: t.context,
    });
    t.is(t.context.value, 0.8);

    t.context.options.speed = 1;
    t.context.value = 0.5;
    t.is(t.context.value, 0.5);

    t.context.value = 2;
    t.is(t.context.value, 1);
});

test("defaultOptions", (t) => {
    const options = ProgressBar.defaultOptions;
    t.is(options.value, 0);
    t.is(options.width, 200);
    t.is(options.speed, 0.3);
});

test("HEIGHT", (t) => {
    t.is(ProgressBar.HEIGHT, 20);
});
