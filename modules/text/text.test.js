/* global beforeAll test expect jest */

import Position from "@pencil.js/position";
import Component from "@pencil.js/component";
import Text from "./text";

const str = "Hello world";
let text;
beforeAll(() => {
    text = new Text(new Position(55, 22.5), str);
});

test("Text creation", () => {
    expect(text.text).toBe(str);
});

test("Text render", () => {
    const ctx = {
        fillText: jest.fn(),
    };
    text.trace(ctx);

    expect(ctx.fillText.mock.calls.length).toBe(1);
    expect(ctx.font).toBe(`${Text.defaultOptions.fontSize}px ${Text.defaultOptions.font}`);
    expect(ctx.textAlign).toBe(Text.defaultOptions.align);
    expect(ctx.textBaseline).toBe("top");
    expect(ctx.fillStyle).toBe(Component.defaultOptions.fill);
    expect(ctx.fillText.mock.calls[0]).toEqual([str, 0, 0]);
});

test("Text isHover", () => {
    // Text is without root therefore can't be hovered
    expect(text.isHover(new Position(0, 0))).toBe(false);
    // TODO: test with root
});

test("Text measures", () => {
    // Text is without root therefore can't be measured
    expect(text.getMeasures()).toEqual({
        width: 0,
        height: 0,
    });
    expect(text.width).toBe(0);
    expect(text.height).toBe(0);
    // TODO: test with root

    // eslint-disable-next-line no-underscore-dangle, mess with cache on purpose
    text._cachedMeasures[text.hash] = {
        width: 42,
        height: 55,
    };
    expect(text.width).toBe(42);
    expect(text.height).toBe(55);
});

test("Text statics", () => {
    const aligns = Text.alignments;
    expect(aligns.start).toBe("start");
    expect(aligns.end).toBe("end");
    expect(aligns.left).toBe("left");
    expect(aligns.center).toBe("center");
    expect(aligns.right).toBe("right");

    const opts = Text.defaultOptions;
    expect(opts.font).toBe("sans-serif");
    expect(opts.fontSize).toBe(20);
    expect(opts.align).toBe("start");
    expect(opts.bold).toBe(false);
    expect(opts.italic).toBe(false);
});
