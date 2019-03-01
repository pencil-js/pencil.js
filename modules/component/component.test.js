import test from "ava";
import Component from "./component";

test.beforeEach((t) => {
    t.context = new Component([0, 0], {
        fill: "#369",
    });
});

test("constructor", (t) => {
    t.false(t.context.isClicked);
    t.false(t.context.isHovered);
});

test("getOrigin", (t) => {
    const defaultOrigin = t.context.getOrigin();
    t.is(defaultOrigin.x, 0);
    t.is(defaultOrigin.y, 0);

    t.context.options.origin = [100, 200];
    const customOrigin = t.context.getOrigin();
    t.is(customOrigin.x, 100);
    t.is(customOrigin.y, 200);
});

test("makePath", (t) => {
    t.context.trace = () => {};
    const ctx = {
        save: () => t.pass(),
        restore: () => t.pass(),
        translate: () => t.pass(),
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
    t.is(ctx.fillStyle, "#369");
    t.is(ctx.strokeStyle, "#abc");
    t.is(ctx.lineWidth, 6);
    t.is(ctx.lineJoin, "a");
    t.is(ctx.lineCap, "b");
});

test("makePath skip", (t) => {
    t.context.trace = () => {};
    const ctx = {
        save: () => t.pass(),
        restore: () => t.pass(),
        translate: () => t.pass(),
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

test("defaultOptions", (t) => {
    const options = Component.defaultOptions;
    t.is(options.fill, "#000");
    t.is(options.stroke, null);
    t.is(options.strokeWidth, 2);
    t.is(options.cursor, Component.cursors.default);
    t.is(options.join, Component.joins.miter);
    t.is(options.origin.x, 0);
    t.is(options.origin.y, 0);
});

test("cursors", (t) => {
    t.truthy(Component.cursors);
});

test("joins", (t) => {
    t.is(Component.joins.miter, "miter");
    t.is(Component.joins.round, "round");
    t.is(Component.joins.bevel, "bevel");
});
