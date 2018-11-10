import test from "ava";
import Component from "./component";

test.beforeEach((t) => {
    t.context = new Component([0, 0], {
        fill: "#369",
    });
});

test("constructor", (t) => {
    t.true(t.context.options.fill.constructor.name === "Color");
    t.is(t.context.options.stroke, null);
    t.false(t.context.isClicked);
    t.false(t.context.isHovered);
});

test("makePath", (t) => {
    t.context.trace = () => {};
    const ctx = {
        fill: () => t.pass(),
        stroke: () => t.pass(),
    };
    t.context.options = {
        fill: "#369",
        stroke: "#abc",
        strokeWidth: 6,
        join: "a",
        cap: "b",
    };
    t.context.makePath(ctx);
    t.is(ctx.fillStyle, "#336699");
    t.is(ctx.strokeStyle, "#aabbcc");
    t.is(ctx.lineWidth, 6);
    t.is(ctx.lineJoin, "a");
    t.is(ctx.lineCap, "b");
});

test("makePath skip", (t) => {
    t.context.trace = () => {};
    const ctx = {
        fill: () => t.fail(),
        stroke: () => t.fail(),
    };
    t.context.options.fill = null;
    t.context.options.stroke = null;
    t.context.makePath(ctx);
    t.context.options.stroke = "any";
    t.context.options.strokeWidth = 0;
    t.context.makePath(ctx);
    t.pass();
});

test("trace", (t) => {
    t.throws(() => t.context.trace(), ReferenceError);
});

test("isHover", (t) => {
    t.context.trace = () => {};
    const ctx = {
        isPointInPath: () => true,
    };
    t.true(t.context.isHover([0, 0], ctx));

    t.context.options.clip = {
        isHover: () => false,
    };
    t.false(t.context.isHover([0, 0], ctx));
});

test("isHover not shown", (t) => {
    t.context.options.shown = false;
    t.false(t.context.isHover([0, 0], null));
});

test("toJSON", (t) => {
    const json = t.context.toJSON();
    t.deepEqual(json.options.fill, [0.2, 0.4, 0.6, 1]);
    t.is(json.options.stroke, undefined);
});

test("defaultOptions", (t) => {
    const options = Component.defaultOptions;
    t.is(options.fill.toString(), "#000000");
    t.is(options.stroke, null);
    t.is(options.strokeWidth, 2);
    t.is(options.cursor, Component.cursors.default);
    t.is(options.join, Component.joins.miter);
});

test("cursors", (t) => {
    t.truthy(Component.cursors);
});

test("joins", (t) => {
    t.is(Component.joins.miter, "miter");
    t.is(Component.joins.round, "round");
    t.is(Component.joins.bevel, "bevel");
});
