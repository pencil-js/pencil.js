import test from "ava";
import Arc from "./arc";

test.beforeEach((t) => {
    t.context = new Arc([100, 50], 20, 40, 0.1, 0.6);
});

test("constructor", (t) => {
    t.is(t.context.width, 20, "init width");
    t.is(t.context.height, 40, "init height");
    t.is(t.context.startAngle, 0.1, "init start angle");
    t.is(t.context.endAngle, 0.6, "init end angle");

    const defaultArc = new Arc();
    t.is(defaultArc.width, 0, "default width");
    t.is(defaultArc.height, 0, "default height");
    t.is(defaultArc.startAngle, 0, "default start angle");
    t.is(defaultArc.endAngle, 0.5, "default end angle");
});

test("trace", (t) => {
    const path = {
        ellipse: (...params) => {
            const PI2 = Math.PI * 2;
            t.deepEqual(params, [0, 0, 10, 20, 0, (0.1 - 0.25) * PI2, (0.6 - 0.25) * PI2]);
        },
    };
    t.plan(1);
    t.context.trace(path);
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.is(json.width, 20, "retrieved width");
    t.is(json.height, 40, "retrieved height");
    t.is(json.startAngle, 0.1, "retrieved start angle");
    t.is(json.endAngle, 0.6, "retrieved end angle");
    t.is(json.constructor, "Arc");
});

test("from", (t) => {
    const definition = {
        width: 10,
        height: 20,
        startAngle: 0.1,
        endAngle: 0.9,
    };
    const arc = Arc.from(definition);

    t.is(arc.width, 10);
    t.is(arc.height, 20);
    t.is(arc.startAngle, 0.1);
    t.is(arc.endAngle, 0.9);
});

test("defaultOptions", (t) => {
    t.is(Arc.defaultOptions.cap, Arc.caps.round, "default cap is round");
    t.is(Arc.defaultOptions.fill, null, "no default fill");
    t.is(Arc.defaultOptions.join, null, "no default join");
});

test("caps", (t) => {
    t.is(Arc.caps.butt, "butt");
    t.is(Arc.caps.round, "round");
    t.is(Arc.caps.square, "square");
});
