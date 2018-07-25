import test from "ava";
import Text from "./text";

test.beforeEach((t) => {
    t.context = new Text([0, 0], "Hello\nworld");
});

test("constructor", (t) => {
    t.deepEqual(t.context.lines, ["Hello", "world"]);
    // eslint-disable-next-line no-underscore-dangle
    t.deepEqual(t.context._cachedMeasures, {});

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
        ["world", 0, 0],
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

    t.is(ctx.font, t.context.getFontDefinition());
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

test("getFontDefinition", (t) => {
    t.is(t.context.getFontDefinition(), `${t.context.options.fontSize}px ${t.context.options.font}`);

    t.context.options.bold = true;
    t.context.options.italic = true;
    t.true(t.context.getFontDefinition().includes("bold"));
    t.true(t.context.getFontDefinition().includes("italic"));
});

test("isHover", (t) => {
    // eslint-disable-next-line no-underscore-dangle, mess with cache on purpose
    t.context._cachedMeasures[t.context.hash] = {
        width: 42,
        height: 55,
    };
    t.true(t.context.isHover([21, 22.5]));
    t.false(t.context.isHover([99, 0]));

    t.context.options.shown = false;
    t.false(t.context.isHover([21, 22.5]));
});

test("getOriginPosition", (t) => {
    // eslint-disable-next-line no-underscore-dangle, mess with cache on purpose
    t.context._cachedMeasures[t.context.hash] = {
        width: 42,
        height: 55,
    };

    t.context.options.align = Text.alignments.center;
    t.is(t.context.getOriginPosition().x, 21);

    t.context.options.align = Text.alignments.right;
    t.is(t.context.getOriginPosition().x, 42);

    t.context.options.align = "bad";
    t.is(t.context.getOriginPosition().x, 0);
});

test("get hash", (t) => {
    const initialHash = t.context.hash;
    t.context.text += "!";
    const textHash = t.context.hash;
    t.not([initialHash].includes(textHash));
    t.context.options.font += "e";
    const fontHash = t.context.hash;
    t.not([initialHash, textHash].includes(fontHash));
    t.context.options.fontSize += 1;
    const fontSizeHash = t.context.hash;
    t.not([initialHash, textHash, fontHash].includes(fontSizeHash));
    t.context.options.bold = !t.context.options.bold;
    const boldHash = t.context.hash;
    t.not([initialHash, textHash, fontHash, fontSizeHash].includes(boldHash));
    t.context.options.italic = !t.context.options.italic;
    const italicHash = t.context.hash;
    t.not([initialHash, textHash, fontHash, fontSizeHash, boldHash].includes(italicHash));
});

test("set hash", (t) => {
    const another = new Text([0, 0], ["Some", "test"], {
        font: "test, open",
        fontSize: 42,
        bold: true,
        italic: true,
    });
    t.context.hash = another.hash;
    t.is(t.context.text, another.text);
    t.is(t.context.options.font, another.options.font);
    t.is(t.context.options.fontSize, another.options.fontSize);
    t.is(t.context.options.bold, another.options.bold);
    t.is(t.context.options.italic, another.options.italic);
});

test("measures and width/height", (t) => {
    // Text is without root therefore can't be measured
    t.deepEqual(t.context.getMeasures(), {
        width: 0,
        height: 0,
    });
    t.is(t.context.width, 0);
    t.is(t.context.height, 0);
    // TODO: test with root

    // Text measures returns cache
    // eslint-disable-next-line no-underscore-dangle, mess with cache on purpose
    t.context._cachedMeasures[t.context.hash] = {
        width: 42,
        height: 55,
    };
    t.is(t.context.width, 42);
    t.is(t.context.height, 55);
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.is(json.text, "Hello\nworld");
});

test.todo("from");

test.todo("load");

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
