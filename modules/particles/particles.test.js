import test from "ava";
import Particles from "./particles";

test.beforeEach((t) => {
    t.context = new Particles([10, 20], {
        trace: () => "",
    }, 10, i => ({
        position: [100, 200],
        rotation: i,
    }));
});

test("constructor", (t) => {
    t.true(typeof t.context.base === "object");
    t.is(t.context.data.length, 10);
    t.context.data.forEach((data, i) => {
        t.true(data.position.constructor.name === "Position");
        t.is(data.position.x, 100);
        t.is(data.position.y, 200);
        t.is(data.rotation, i);
    });
});

test("trace", (t) => {
    t.context.trace({
        addPath: () => t.pass(),
    });
    t.plan(10);
});

test("isHover", (t) => {
    t.false(t.context.isHover(t.context.position));
});

test("defaultOptions", (t) => {
    const { defaultOptions } = Particles;
    t.true(defaultOptions.position.constructor.name === "Position");
    t.is(defaultOptions.position.x, 0);
    t.is(defaultOptions.position.y, 0);
    t.is(defaultOptions.rotation, 0);
    t.true(defaultOptions.scale.constructor.name === "Position");
    t.is(defaultOptions.scale.x, 1);
    t.is(defaultOptions.scale.y, 1);
});
