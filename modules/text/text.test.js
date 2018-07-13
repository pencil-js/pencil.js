/* global describe beforeEach test expect */

import Text from "./text";

describe("Text", () => {
    const str = "Hello\nworld";
    let text;
    beforeEach(() => {
        text = new Text([55, 22.5], str);
    });

    test("creation", () => {
        expect(text.lines).toEqual(["Hello", "world"]);
    });

    test("get and set text", () => {
        expect(text.text).toBe(str);

        text.text = "Hello world";
        expect(text.lines.length).toBe(1);
        expect(text.text).toBe("Hello world");

        text.text = ["Array", "build"];
        expect(text.lines.length).toBe(2);
        expect(text.text).toBe("Array\nbuild");

        text.text = ["Mix", "Array\nand line-break"];
        expect(text.lines.length).toBe(3);
        expect(text.text).toBe("Mix\nArray\nand line-break");
    });

    test("makePath", () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        text.options.fill = "#123456";
        text.options.stroke = null;
        text.makePath(ctx);

        expect(ctx.font).toBe(text.getFontDefinition());
        expect(ctx.textAlign).toBe(text.options.align);
        expect(ctx.fillStyle).toBe(text.options.fill);
        expect(ctx.fillText).toHaveBeenCalledTimes(text.lines.length);
        expect(ctx.strokeText).not.toHaveBeenCalled();
    });

    test("getFontDefinition", () => {
        expect(text.getFontDefinition()).toBe(`${text.options.fontSize}px ${text.options.font}`);

        text.options.bold = true;
        text.options.italic = true;
        expect(text.getFontDefinition()).toMatch("bold");
        expect(text.getFontDefinition()).toMatch("italic");
    });

    test.skip("isHover", () => {
    });

    test.skip("getOriginPosition", () => {
    });

    test("get hash", () => {
        const initialHash = text.hash;
        text.text += "!";
        const textHash = text.hash;
        expect([initialHash]).not.toContain(textHash);
        text.options.font += "e";
        const fontHash = text.hash;
        expect([initialHash, textHash]).not.toContain(fontHash);
        text.options.fontSize += 1;
        const fontSizeHash = text.hash;
        expect([initialHash, textHash, fontHash]).not.toContain(fontSizeHash);
        text.options.bold = !text.options.bold;
        const boldHash = text.hash;
        expect([initialHash, textHash, fontHash, fontSizeHash]).not.toContain(boldHash);
        text.options.italic = !text.options.italic;
        const italicHash = text.hash;
        expect([initialHash, textHash, fontHash, fontSizeHash, boldHash]).not.toContain(italicHash);
    });

    test("set hash", () => {
        const another = new Text([0, 0], ["Some", "test"], {
            font: "test, open",
            fontSize: 42,
            bold: true,
            italic: true,
        });
        text.hash = another.hash;
        expect(text.text).toBe(another.text);
        expect(text.options.font).toBe(another.options.font);
        expect(text.options.fontSize).toBe(another.options.fontSize);
        expect(text.options.bold).toBe(another.options.bold);
        expect(text.options.italic).toBe(another.options.italic);
    });

    test("measures and width/height", () => {
        // Text is without root therefore can't be measured
        expect(text.getMeasures()).toEqual({
            width: 0,
            height: 0,
        });
        expect(text.width).toBe(0);
        expect(text.height).toBe(0);
        // TODO: test with root

        // Text measures returns cache
        // eslint-disable-next-line no-underscore-dangle, mess with cache on purpose
        text._cachedMeasures[text.hash] = {
            width: 42,
            height: 55,
        };
        expect(text.width).toBe(42);
        expect(text.height).toBe(55);
    });

    test("toJSON", () => {
        const json = text.toJSON();

        expect(json.text).toBe(str);
    });

    describe("statics", () => {
        test.skip("from", () => {
        });

        test.skip("load", () => {
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
    });
});
