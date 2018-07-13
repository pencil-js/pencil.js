/* global describe beforeEach test expect */

import Line from "./line";

describe("Line", () => {
    let line;
    beforeEach(() => {
        line = new Line([100, 50], [
            [150, 150],
            [200, 200],
        ]);
    });

    test("creation", () => {
        expect(line.position.x).toBe(100);
        expect(line.position.y).toBe(50);
        expect(Array.isArray(line.points)).toBe(true);
        expect(line.points.length).toBe(2);
        const expected = [
            [150, 150],
            [200, 200],
        ];
        line.points.forEach((point, index) => {
            expect(point.x).toBe(expected[index][0]);
            expect(point.y).toBe(expected[index][1]);
        });
    });

    test("trace", () => {
        const path = new Path2D();
        line.trace(path);

        expect(path.moveTo).toHaveBeenCalledTimes(1);
        expect(path.moveTo).toHaveBeenCalledWith(0, 0);
        expect(path.lineTo).toHaveBeenCalledTimes(2);
        expect(path.lineTo).toHaveBeenNthCalledWith(1, 150, 150);
        expect(path.lineTo).toHaveBeenNthCalledWith(2, 200, 200);
    });

    test("toJSON", () => {
        const json = line.toJSON();

        expect(json.position).toEqual([100, 50]);
        expect(json.points).toEqual([
            [150, 150],
            [200, 200],
        ]);
    });

    describe("statics", () => {
        test.skip("from", () => {
        });

        test("defaultOptions", () => {
            expect(Line.defaultOptions.fill).not.toBeDefined();
            expect(Line.defaultOptions.cap).toBe(Line.caps.round);
            expect(Line.defaultOptions.join).toBe(Line.joins.round);
        });

        test("caps", () => {
            expect(Line.caps.butt).toBe("butt");
            expect(Line.caps.round).toBe("round");
            expect(Line.caps.square).toBe("square");
        });
    });
});
