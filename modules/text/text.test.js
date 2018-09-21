import test from "ava";
import Text from "./text";

test.beforeEach((t) => {
    t.context = new Text([0, 0], "Hello\nworld");
});

test("constructor", (t) => {
    t.deepEqual(t.context.lines, ["Hello", "world"]);

    const defaultText = new Text();
    t.deepEqual(defaultText.lines, [""]);
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
});

test("makePath", (t) => {
    const expected = [
        ["Hello", 0, 0],
        ["world", 0, 5],
    ];
    const ctx = {
        fillText: (...params) => {
            t.deepEqual(params, expected[ctx.call]);
        },
        strokeText: (...params) => {
            t.deepEqual(params, expected[ctx.call++]);
        },
        call: 0,
    };
    t.plan(8);
    t.context.options.fill = "#123456";
    t.context.options.stroke = "#456789";
    t.context.makePath(ctx);

    t.is(ctx.font, Text.getFontDefinition(t.context.options));
    t.is(ctx.textAlign, t.context.options.align);
    t.is(ctx.fillStyle, t.context.options.fill);
    t.is(ctx.strokeStyle, t.context.options.stroke);
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

test("isHover", (t) => {
    t.true(t.context.isHover([1, 1]));
    t.false(t.context.isHover([99, 0]));

    t.context.options.shown = false;
    t.false(t.context.isHover([1, 1]));
});

test("getOriginPosition", (t) => {
    t.context.options.align = Text.alignments.center;
    t.is(t.context.getOriginPosition().x, 0.5);

    t.context.options.align = Text.alignments.right;
    t.is(t.context.getOriginPosition().x, 1);

    t.context.options.align = "bad";
    t.is(t.context.getOriginPosition().x, 0);
});

test("measures and width/height", (t) => {
    t.deepEqual(t.context.getMeasures(), {
        width: 1,
        height: 10,
    });
    t.is(t.context.width, 1);
    t.is(t.context.height, 10);
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

test.todo("load");

test("getFontDefinition", (t) => {
    t.is(Text.getFontDefinition(t.context.options), `${t.context.options.fontSize}px ${t.context.options.font}`);

    t.context.options.bold = true;
    t.context.options.italic = true;
    t.true(Text.getFontDefinition(t.context.options).includes("bold"));
    t.true(Text.getFontDefinition(t.context.options).includes("italic"));
});

test("measure", (t) => {
    t.deepEqual(Text.measure("whatever"), {
        width: 1,
        height: 5,
    });
    t.deepEqual(Text.measure("whatever", {}), {
        width: 1,
        height: 5,
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
