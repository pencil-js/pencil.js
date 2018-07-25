import test from "ava";
import Arc from "./arc";

test.beforeEach((t) => {
    t.context = new Arc([100, 50], 20, 0.1, 0.6);
});

test("constructor", (t) => {
    t.is(t.context.radius, 20, "init radius");
    t.is(t.context.startAngle, 0.1, "init start angle");
    t.is(t.context.endAngle, 0.6, "init end angle");

    const defaultArc = new Arc();
    t.is(defaultArc.radius, 0, "default radius");
    t.is(defaultArc.startAngle, 0, "default start angle");
    t.is(defaultArc.endAngle, 0.5, "default end angle");
});

test("trace", (t) => {
    const path = {
        arc: (...params) => {
            const PI2 = Math.PI * 2;
            t.deepEqual(params, [0, 0, 20, (0.1 - 0.25) * PI2, (0.6 - 0.25) * PI2], "call 'arc' with right params");
        },
    };
    t.plan(1);
    t.context.trace(path);
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.is(json.radius, 20, "retrieved radius");
    t.is(json.startAngle, 0.1, "retrieved start angle");
    t.is(json.endAngle, 0.6, "retrieved end angle");
});

test.todo("from");

test("defaultOptions", (t) => {
    t.is(Arc.defaultOptions.cap, Arc.caps.round, "default cap is round");
    t.is(Arc.defaultOptions.fill, undefined, "no default fill");
    t.is(Arc.defaultOptions.join, undefined, "no default join");
});

test("caps", (t) => {
    t.is(Arc.caps.butt, "butt");
    t.is(Arc.caps.round, "round");
    t.is(Arc.caps.square, "square");
});
