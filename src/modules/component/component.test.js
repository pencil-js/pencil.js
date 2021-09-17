import test from "ava";
import Component from ".";

test.beforeEach((t) => {
    t.context = new Component([0, 0], {
        fill: "#369",
        origin: [1, 2],
        shadow: {
            position: [10, 20],
            blur: 5,
            color: "#123",
        },
    });
});

test("constructor", (t) => {
    t.is(t.context.options.shadow.position.x, 10);
    t.is(t.context.options.shadow.position.y, 20);
    t.is(t.context.options.shadow.color, "#123");
    t.is(t.context.options.origin.x, 1);
    t.is(t.context.options.origin.y, 2);

    t.false(t.context.isClicked);
    t.false(t.context.isHovered);
});

test("getOrigin", (t) => {
    const origin = t.context.getOrigin();
    t.is(origin, t.context.options.origin);

    t.context.options.origin = [100, 200];
    const customOrigin = t.context.getOrigin();
    t.is(customOrigin.x, 100);
    t.is(customOrigin.y, 200);
});

test("setOptions", (t) => {
    t.context.setOptions({
        shadow: {
            blur: 3,
        },
    });
    t.is(t.context.options.shadow.position.x, 10);
    t.is(t.context.options.shadow.position.y, 20);
    t.is(t.context.options.shadow.color, "#123");
    t.is(t.context.options.shadow.blur, 3);

    t.context.setOptions({
        fill: "red",
    });
    t.is(t.context.options.shadow.position.x, 10);
    t.is(t.context.options.shadow.position.y, 20);
    t.is(t.context.options.fill, "red");

    t.context.setOptions();
    t.is(t.context.options.shadow.position.x, 10);
    t.is(t.context.options.shadow.position.y, 20);
    t.is(t.context.options.fill, "red");
});

test("makePath", (t) => {
    t.context.trace = () => t.pass();
    const ctx = {
        translate: () => t.pass(),
        fill: () => t.pass(),
        stroke: () => t.pass(),
    };
    t.context.options.stroke = "#abc";

    t.plan(5);
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
        setLineDash: arg => t.deepEqual(arg, [12, 18, 24]),
    };
    t.context.options.origin = [10, 20];
    t.context.options.stroke = "#abc";
    t.context.options.strokeWidth = 6;
    t.context.options.dashed = [2, 3, 4];
    t.context.options.join = "a";
    t.context.options.cap = "b";

    t.context.setContext(ctx);
    t.is(ctx.fillStyle, "#369");
    t.is(ctx.strokeStyle, "#abc");
    t.is(ctx.lineWidth, 6);
    t.is(ctx.lineJoin, "a");
    t.is(ctx.lineCap, "b");
    t.is(ctx.shadowColor, "#123");
    t.is(ctx.shadowBlur, 5);
    t.is(ctx.shadowOffsetX, 10);
    t.is(ctx.shadowOffsetY, 20);
});

test("trace", (t) => {
    t.throws(() => t.context.trace(), {
        instanceOf: ReferenceError,
    });
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
    t.is(options.dashed, false);
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

test("dashes", (t) => {
    t.deepEqual(Component.dashes.default, [4, 4]);
    t.deepEqual(Component.dashes.dots, [1, 4]);
    t.deepEqual(Component.dashes.long, [9, 4]);
    t.deepEqual(Component.dashes.sewing, [4, 4, 1, 4]);
});
