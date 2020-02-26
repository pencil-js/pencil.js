import test from "ava";
import Component from ".";

test.beforeEach((t) => {
    t.context = new Component([0, 0], {
        fill: "#369",
        shadow: {
            position: [10, 20],
            color: "#123",
        },
    });
});

test("constructor", (t) => {
    t.is(t.context.options.shadow.position.x, 10);
    t.is(t.context.options.shadow.position.y, 20);

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
    t.context.trace = () => t.pass();
    const ctx = {
        save: () => t.pass(),
        translate: () => t.pass(),
        fill: () => t.pass(),
        stroke: () => t.pass(),
        restore: () => t.pass(),
    };
    t.context.options.stroke = "#abc";

    t.plan(6);
    t.context.makePath(ctx);
});

test("makePath skip", (t) => {
    t.context.trace = () => t.fail();
    const ctx = {
        save: () => t.pass(),
        translate: () => t.pass(),
        fill: () => t.fail(),
        stroke: () => t.fail(),
        restore: () => t.pass(),
    };

    t.context.options.fill = null;
    t.context.options.stroke = null;
    t.context.makePath(ctx);
    t.context.options.stroke = "any";
    t.context.options.strokeWidth = 0;
    t.context.makePath(ctx);
    t.context.options.strokeWidth = -1;
    t.context.makePath(ctx);
    t.pass();
});

test("setContext", (t) => {
    t.context.trace = () => {};
    const ctx = {
        translate: (...args) => t.deepEqual(args, [10, 20]),
    };
    t.context.options.origin = [10, 20];
    t.context.options.stroke = "#abc";
    t.context.options.strokeWidth = 6;
    t.context.options.join = "a";
    t.context.options.cap = "b";

    const [willFill, willStroke] = t.context.setContext(ctx);
    t.true(willFill && willStroke);
    t.is(ctx.fillStyle, "#369");
    t.is(ctx.strokeStyle, "#abc");
    t.is(ctx.lineWidth, 6);
    t.is(ctx.lineJoin, "a");
    t.is(ctx.lineCap, "b");
    t.is(ctx.shadowColor, "#123");
    t.is(ctx.shadowBlur, 0);
    t.is(ctx.shadowOffsetX, 10);
    t.is(ctx.shadowOffsetY, 20);
});

test("trace", (t) => {
    t.throws(() => t.context.trace(), ReferenceError);
});

test("isHover", (t) => {
    t.context.trace = () => {};
    const ctx = {
        save: () => {},
        translate: () => {},
        clip: () => {},
        isPointInPath: () => true,
        restore: () => true,
    };
    t.true(t.context.isHover([0, 0], ctx));

    t.context.options.clip = {
        position: {},
        isHover: () => false,
    };
    t.false(t.context.isHover([0, 0], ctx));
});

test("isHover not shown", (t) => {
    t.context.options.shown = false;
    t.false(t.context.isHover([0, 0], null));
});

test("isHover not rendered", (t) => {
    const ctx = new window.CanvasRenderingContext2D();
    t.context.options.fill = null;
    t.context.options.stroke = null;
    t.false(t.context.isHover([0, 0], ctx));
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
    t.is(options.shadow.color, null);
    t.is(options.shadow.blur, 0);
    t.is(options.shadow.position.x, 0);
    t.is(options.shadow.position.y, 0);
});

test("cursors", (t) => {
    t.true(typeof Component.cursors === "object");
});

test("joins", (t) => {
    t.is(Component.joins.miter, "miter");
    t.is(Component.joins.round, "round");
    t.is(Component.joins.bevel, "bevel");
});
