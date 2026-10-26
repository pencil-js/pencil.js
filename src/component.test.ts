import { test, expect, beforeEach } from "vitest";


let context: any;
import Component from "./component.js";

beforeEach(() => {
    context = new Component([0, 0], {
        fill: "#369",
        origin: [1, 2],
        shadow: {
            position: [10, 20],
            blur: 5,
            color: "#123",
        },
    });
});

test("constructor", () => {
    expect(context.options.shadow.position.x).toBe(10);
    expect(context.options.shadow.position.y).toBe(20);
    expect(context.options.shadow.color).toBe("#123");
    expect(context.options.origin.x).toBe(1);
    expect(context.options.origin.y).toBe(2);

    expect(context.isClicked).toBe(false);
    expect(context.isHovered).toBe(false);
});

test("getOrigin", () => {
    const origin = context.getOrigin();
    expect(origin).toBe(context.options.origin);

    context.options.origin = [100, 200];
    const customOrigin = context.getOrigin();
    expect(customOrigin.x).toBe(100);
    expect(customOrigin.y).toBe(200);
});

test("setOptions", () => {
    context.setOptions({
        shadow: {
            blur: 3,
        },
    });
    expect(context.options.shadow.position.x).toBe(10);
    expect(context.options.shadow.position.y).toBe(20);
    expect(context.options.shadow.color).toBe("#123");
    expect(context.options.shadow.blur).toBe(3);

    context.setOptions({
        fill: "red",
    });
    expect(context.options.shadow.position.x).toBe(10);
    expect(context.options.shadow.position.y).toBe(20);
    expect(context.options.fill).toBe("red");

    context.setOptions();
    expect(context.options.shadow.position.x).toBe(10);
    expect(context.options.shadow.position.y).toBe(20);
    expect(context.options.fill).toBe("red");
});

test("makePath", () => {
    context.trace = (path: Path2D) => {
        expect(true).toBe(true);
        path.rect(0, 0, 10, 10);
        return context;
    };
    const ctx = window.document.createElement("canvas").getContext("2d")!;
    ctx.translate = () => expect(true).toBe(true);
    ctx.fill = () => expect(true).toBe(true);
    ctx.stroke = () => expect(true).toBe(true);
    context.options.stroke = "#abc";

    expect.assertions(5);
    context.makePath(ctx);
});

test("makePath skip", () => {
    context.trace = () => expect.fail();
    const ctx = {
        save: () => expect(true).toBe(true),
        translate: () => expect(true).toBe(true),
        fill: () => expect.fail(),
        stroke: () => expect.fail(),
        restore: () => expect(true).toBe(true),
    };

    context.options.fill = null;
    context.options.stroke = null;
    context.makePath(ctx);
    context.options.stroke = "any";
    context.options.strokeWidth = 0;
    context.makePath(ctx);
    context.options.strokeWidth = -1;
    context.makePath(ctx);
    expect(true).toBe(true);
});

test("setContext", () => {
    context.trace = () => {};
    const ctx = {
        translate: (...args) => expect(args).toEqual([10, 20]),
        setLineDash: arg => expect(arg).toEqual([12, 18, 24]),
    };
    context.options.origin = [10, 20];
    context.options.stroke = "#abc";
    context.options.strokeWidth = 6;
    context.options.dashed = [2, 3, 4];
    context.options.join = "a";
    context.options.cap = "b";

    context.setContext(ctx);
    expect(ctx.fillStyle).toBe("#369");
    expect(ctx.strokeStyle).toBe("#abc");
    expect(ctx.lineWidth).toBe(6);
    expect(ctx.lineJoin).toBe("a");
    expect(ctx.lineCap).toBe("b");
    expect(ctx.shadowColor).toBe("#123");
    expect(ctx.shadowBlur).toBe(5);
    expect(ctx.shadowOffsetX).toBe(10);
    expect(ctx.shadowOffsetY).toBe(20);
});

test("trace", () => {
    expect(() => context.trace()).toThrow();
});

test("isHover", () => {
    context.trace = (path: Path2D) => {
        path.rect(0, 0, 10, 10);
        return context;
    };
    const ctx = window.document.createElement("canvas").getContext("2d")!;
    expect(context.isHover([5, 5], ctx)).toBe(true);
    expect(context.isHover([15, 5], ctx)).toBe(false);
    // Default context
    expect(context.isHover([5, 5])).toBe(true);

    // Stroke only
    context.path = null;
    context.options.fill = null;
    context.options.stroke = "red";
    context.options.strokeWidth = 4;
    expect(context.isHover([5, 5], ctx)).toBe(false);
    expect(context.isHover([11, 5], ctx)).toBe(true);
});

test("isHover not shown", () => {
    context.options.shown = false;
    expect(context.isHover([0, 0], null)).toBe(false);
});

test("isHover not rendered", () => {
    const ctx = window.document.createElement("canvas").getContext("2d")!;
    context.options.fill = null;
    context.options.stroke = null;
    expect(context.isHover([0, 0], ctx)).toBe(false);
});

test("defaultOptions", () => {
    const options = Component.defaultOptions;
    expect(options.fill).toBe("#000");
    expect(options.stroke).toBe(null);
    expect(options.strokeWidth).toBe(2);
    expect(options.dashed).toBe(false);
    expect(options.cursor).toBe(Component.cursors.default);
    expect(options.join).toBe(Component.joins.miter);
    expect(options.origin.x).toBe(0);
    expect(options.origin.y).toBe(0);
    expect(options.shadow.color).toBe(null);
    expect(options.shadow.blur).toBe(0);
    expect(options.shadow.position.x).toBe(0);
    expect(options.shadow.position.y).toBe(0);
});

test("cursors", () => {
    expect(typeof Component.cursors === "object").toBe(true);
});

test("joins", () => {
    expect(Component.joins.miter).toBe("miter");
    expect(Component.joins.round).toBe("round");
    expect(Component.joins.bevel).toBe("bevel");
});

test("dashes", () => {
    expect(Component.dashes.default).toEqual([4, 4]);
    expect(Component.dashes.dots).toEqual([1, 4]);
    expect(Component.dashes.long).toEqual([9, 4]);
    expect(Component.dashes.sewing).toEqual([4, 4, 1, 4]);
});
