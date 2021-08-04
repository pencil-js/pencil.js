import test from "ava";
import Text from "./text.js";

test.beforeEach((t) => {
    t.context = new Text([0, 0], "Hello\nworld");
});

test("constructor", async (t) => {
    t.deepEqual(t.context.lines, ["Hello", "world"]);

    const defaultText = new Text();
    t.deepEqual(defaultText.lines, [""]);

    const textWithUrl = new Text([0, 0], "test", {
        font: "http://test.com",
    });
    await new Promise(((resolve) => {
        textWithUrl.on("ready", () => {
            t.is(textWithUrl.options.font, "http---test-com");
            resolve();
        });
    }));
});

test("get and set text", (t) => {
    t.is(t.context.text, "Hello\nworld");

    t.context.text = "Hello world";
    t.is(t.context.lines.length, 1);
    t.is(t.context.text, "Hello world");

    t.context.text = ["Array", "build"];
    t.is(t.context.lines.length, 2);
    t.is(t.context.text, "Array\nbuild");

    t.context.text = ["Mix", "Array\nand line-break"];
    t.is(t.context.lines.length, 3);
    t.is(t.context.text, "Mix\nArray\nand line-break");

    t.context.text = 666;
    t.is(t.context.lines.length, 1);
    t.is(t.context.text, "666");

    t.context.text = [42, {
        toString () {
            return "toString function";
        },
    }];
    t.is(t.context.lines.length, 2);
    t.is(t.context.text, "42\ntoString function");
});

test("makePath", (t) => {
    const expected = [
        ["Hello", 0, 0],
        ["world", 0, 20],
    ];
    const ctx = {
        save: () => {},
        translate: () => {},
        restore: () => {},
        fillText: (...params) => {
            t.deepEqual(params, expected[ctx.call]);
        },
        strokeText: (...params) => {
            t.deepEqual(params, expected[ctx.call++]);
        },
        call: 0,
    };
    t.plan(4);
    t.context.options.fill = "#123456";
    t.context.options.stroke = "#456789";
    t.context.makePath(ctx);
});

test("makePath with underscore", (t) => {
    t.context.text = " ";
    t.context.options.underscore = true;

    const ctx = {
        save: () => {},
        translate: () => {},
        restore: () => {},
        beginPath: () => {},
        fillText: () => {},
        moveTo: () => {},
        lineTo: () => t.pass(),
        stroke: () => {},
        closePath: () => {},
    };
    t.plan(2);

    t.context.makePath(ctx);
    t.is(ctx.strokeStyle, t.context.options.fill);
});

test("makePath with no text", (t) => {
    const ctx = {
        fillText: () => t.fail(),
        strokeText: () => t.fail(),
    };
    t.context.text = "";
    t.context.makePath(ctx);
    t.pass();
});

test("makePath with no fill nor stroke", (t) => {
    const ctx = {
        fillText: () => t.fail(),
        strokeText: () => t.fail(),
    };
    t.context.options.fill = null;
    t.context.options.stroke = null;
    t.context.makePath(ctx);
    t.pass();
});

test("setContext", (t) => {
    const ctx = {
        translate: (...args) => t.deepEqual(args, [10, 20]),
        setLineDash: arg => t.deepEqual(arg, []),
    };
    t.context.options.stroke = "#123";
    t.context.options.origin = [10, 20];
    t.context.options.font = "whatever";
    t.context.options.fontSize = 99;
    t.context.options.align = "left";
    t.context.options.bold = true;
    t.context.options.italic = true;

    t.context.setContext(ctx);
    t.is(ctx.font, "bold italic 99px whatever");
    t.is(ctx.textAlign, "left");
    t.is(ctx.textBaseline, "top");
});

test("getAlignOffset ", (t) => {
    t.is(t.context.getAlignOffset(), 0);

    t.context.options.align = Text.alignments.left;
    t.is(t.context.getAlignOffset(), 0);

    t.context.options.align = Text.alignments.center;
    t.is(t.context.getAlignOffset(), 0.5);

    t.context.options.align = Text.alignments.right;
    t.is(t.context.getAlignOffset(), 1);
});

test("trace", (t) => {
    const path = {
        rect: () => t.pass(),
    };
    t.context.trace(path);
    t.plan(1);
});

test("measures and width/height", (t) => {
    t.deepEqual(t.context.getMeasures(), {
        width: 5,
        height: 40,
    });
    t.is(t.context.width, 5);
    t.is(t.context.height, 40);
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.is(json.text, "Hello\nworld");
    t.is(json.constructor, "Text");
});

test("from", (t) => {
    const definition = {
        text: "whatever",
    };
    const text = Text.from(definition);

    t.is(text.text, "whatever");
});

test("load", async (t) => {
    const fontUrls = [
        "font",
        "url",
    ];
    const names = await Text.load(fontUrls);
    t.deepEqual(names, fontUrls);
});

test("getFontDefinition", (t) => {
    t.is(Text.getFontDefinition(t.context.options), `${t.context.options.fontSize}px ${t.context.options.font}`);

    t.context.options.bold = true;
    t.context.options.italic = true;
    t.true(Text.getFontDefinition(t.context.options).includes("bold"));
    t.true(Text.getFontDefinition(t.context.options).includes("italic"));
});

test("measure", (t) => {
    t.deepEqual(Text.measure("whatever"), {
        width: 5,
        height: 20,
    });
    t.deepEqual(Text.measure("whatever", {
        fontSize: 40,
    }), {
        width: 5,
        height: 40,
    });
});

test("defaultOptions", (t) => {
    const opts = Text.defaultOptions;
    t.is(opts.font, "sans-serif");
    t.is(opts.fontSize, 20);
    t.is(opts.align, "start");
    t.is(opts.bold, false);
    t.is(opts.italic, false);
});

test("alignments", (t) => {
    const aligns = Text.alignments;
    t.is(aligns.start, "start");
    t.is(aligns.end, "end");
    t.is(aligns.left, "left");
    t.is(aligns.center, "center");
    t.is(aligns.right, "right");
});
