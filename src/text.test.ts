import { test, expect, beforeEach } from "vitest";


let context: any;
import Text from "./text.js";

const getContext = () => window.document.createElement("canvas").getContext("2d")!;

beforeEach(() => {
    context = new Text([0, 0], "Hello\nworld");
});

test("constructor", async () => {
    expect(context.lines).toEqual(["Hello", "world"]);

    const defaultText = new Text();
    expect(defaultText.lines).toEqual([""]);

    const textWithUrl = new Text([0, 0], "test", {
        font: "http://test.com",
    });
    await new Promise(((resolve) => {
        textWithUrl.on("ready", () => {
            expect(textWithUrl.options.font).toBe("http---test-com");
            resolve();
        });
    }));
});

test("get and set text", () => {
    expect(context.text).toBe("Hello\nworld");

    context.text = "Hello world";
    expect(context.lines.length).toBe(1);
    expect(context.text).toBe("Hello world");

    context.text = ["Array", "build"];
    expect(context.lines.length).toBe(2);
    expect(context.text).toBe("Array\nbuild");

    context.text = ["Mix", "Array\nand line-break"];
    expect(context.lines.length).toBe(3);
    expect(context.text).toBe("Mix\nArray\nand line-break");

    context.text = 666;
    expect(context.lines.length).toBe(1);
    expect(context.text).toBe("666");

    context.text = [42, {
        toString () {
            return "toString function";
        },
    }];
    expect(context.lines.length).toBe(2);
    expect(context.text).toBe("42\ntoString function");
});

test("makePath", () => {
    const expected = [
        ["Hello", 0, 0],
        ["world", 0, 20],
    ];
    const ctx: any = getContext();
    let call = 0;
    ctx.fillText = (...params: Array<unknown>) => {
        expect(params).toEqual(expected[call]);
    };
    ctx.strokeText = (...params: Array<unknown>) => {
        expect(params).toEqual(expected[call++]);
    };
    expect.assertions(4);
    context.options.fill = "#123456";
    context.options.stroke = "#456789";
    context.makePath(ctx);
});

test("makePath with underscore", () => {
    context.text = " ";
    context.options.underscore = true;

    const ctx: any = getContext();
    ctx.lineTo = () => expect(true).toBe(true);
    expect.assertions(2);

    context.options.fill = "#ff0000";
    context.makePath(ctx);
    expect(ctx.strokeStyle).toBe(context.options.fill);
});

test("makePath with no text", () => {
    const ctx = {
        fillText: () => expect.fail(),
        strokeText: () => expect.fail(),
    };
    context.text = "";
    context.makePath(ctx);
    expect(true).toBe(true);
});

test("makePath with no fill nor stroke", () => {
    const ctx = {
        fillText: () => expect.fail(),
        strokeText: () => expect.fail(),
    };
    context.options.fill = null;
    context.options.stroke = null;
    context.makePath(ctx);
    expect(true).toBe(true);
});

test("setContext", () => {
    const ctx = {
        translate: (...args) => expect(args).toEqual([10, 20]),
        setLineDash: arg => expect(arg).toEqual([]),
    };
    context.options.stroke = "#123";
    context.options.origin = [10, 20];
    context.options.font = "whatever";
    context.options.fontSize = 99;
    context.options.align = "left";
    context.options.bold = true;
    context.options.italic = true;

    context.setContext(ctx);
    expect(ctx.font).toBe("bold italic 99px whatever");
    expect(ctx.textAlign).toBe("left");
    expect(ctx.textBaseline).toBe("top");
});

test("getAlignOffset ", () => {
    expect(context.getAlignOffset()).toBe(0);

    context.options.align = Text.alignments.left;
    expect(context.getAlignOffset()).toBe(0);

    context.options.align = Text.alignments.center;
    expect(context.getAlignOffset()).toBe(0.5);

    context.options.align = Text.alignments.right;
    expect(context.getAlignOffset()).toBe(1);
});

test("trace", () => {
    const path = {
        rect: () => expect(true).toBe(true),
    };
    context.trace(path);
    expect.assertions(1);
});

test("measures and width/height", () => {
    const width = Math.max(Text.measure("Hello").width, Text.measure("world").width);
    expect(context.getMeasures()).toEqual({
        width,
        height: 40,
    });
    expect(context.width).toBe(width);
    expect(context.height).toBe(40);
    // Size is read-only
    context.width = 999;
    expect(context.width).toBe(width);
});

test("toJSON", () => {
    const json = context.toJSON();

    expect(json.text).toBe("Hello\nworld");
    expect(json.constructor).toBe("Text");
});

test("from", () => {
    const definition = {
        text: "whatever",
    };
    const text = Text.from(definition);

    expect(text.text).toBe("whatever");
});

test("load", async () => {
    const fontUrls = [
        "font",
        "url",
    ];
    const names = await Text.load(fontUrls);
    expect(names).toEqual(fontUrls);
});

test("getFontDefinition", () => {
    expect(Text.getFontDefinition(context.options)).toBe(`${context.options.fontSize}px ${context.options.font}`);

    context.options.bold = true;
    context.options.italic = true;
    expect(Text.getFontDefinition(context.options).includes("bold")).toBe(true);
    expect(Text.getFontDefinition(context.options).includes("italic")).toBe(true);
});

test("measure", () => {
    const small = Text.measure("whatever");
    expect(small.height).toBe(20);
    expect(small.width).toBeGreaterThan(0);
    const big = Text.measure("whatever", {
        fontSize: 40,
    });
    expect(big.height).toBe(40);
    expect(big.width).toBeCloseTo(small.width * 2, 0);
    expect(Text.measure(["a", "b"], {
        lineHeight: 2,
    }).height).toBe(80);
});

test("defaultOptions", () => {
    const opts = Text.defaultOptions;
    expect(opts.font).toBe("sans-serif");
    expect(opts.fontSize).toBe(20);
    expect(opts.align).toBe("start");
    expect(opts.bold).toBe(false);
    expect(opts.italic).toBe(false);
});

test("alignments", () => {
    const aligns = Text.alignments;
    expect(aligns.start).toBe("start");
    expect(aligns.end).toBe("end");
    expect(aligns.left).toBe("left");
    expect(aligns.center).toBe("center");
    expect(aligns.right).toBe("right");
});
