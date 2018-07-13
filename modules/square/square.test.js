/* global describe beforeEach test expect */

import Square from "./square";

describe("Square", () => {
    let square;
    beforeEach(() => {
        square = new Square([-20, 20], 123.4);
    });

    test("creation", () => {
        expect(square.width).toBeCloseTo(123.4);
        expect(square.height).toBeCloseTo(123.4);
    });

    test("get and set size", () => {
        expect(square.size).toBeCloseTo(123.4);

        const s = 99.9;
        square.size = s;
        expect(square.size).toBeCloseTo(s);
    });

    test("toJSON", () => {
        const json = square.toJSON();

        expect(json.size).toBeCloseTo(123.4);
        expect(json.width).not.toBeDefined();
        expect(json.height).not.toBeDefined();
    });

    describe("statics", () => {
        test.skip("from", () => {
        });
    });
});
