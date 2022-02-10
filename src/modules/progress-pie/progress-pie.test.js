import test from "ava";
import ProgressPie from ".";

test.beforeEach((t) => {
    t.context = new ProgressPie([0, 0], {
        value: 0.8,
        radius: 300,
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

test("get and set radius", (t) => {
    t.is(t.context.radius, 300);

    t.context.radius = 666;
    t.is(t.context.radius, 666);
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
    const options = ProgressPie.defaultOptions;
    t.is(options.value, 0);
    t.is(options.radius, 100);
    t.is(options.speed, 0.3);
});
