/* global beforeAll test expect */

import Text from "./text";

const str = "Hello\nworld";
let text;
beforeAll(() => {
    text = new Text([55, 22.5], str);
});

test("Text creation", () => {
    expect(text.text).toBe(str);
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

    // Text measures returns cache
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
