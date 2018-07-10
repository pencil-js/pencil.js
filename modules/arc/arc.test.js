/* global describe beforeEach test expect */

import Arc from "./arc";

describe("Arc", () => {
    let arc;
    beforeEach(() => {
        arc = new Arc([100, 50], 20, 0.1, 0.6);
    });

    test("creation", () => {
        expect(arc.radius).toBe(20);
        expect(arc.startAngle).toBeCloseTo(0.1);
        expect(arc.endAngle).toBeCloseTo(0.6);
    });

    test("trace", () => {
        const path = new Path2D();
        arc.trace(path);

        expect(path.arc.mock.calls.length).toBe(1);
        const PI2 = Math.PI * 2;
        const expected = [0, 0, 20, (0.1 - 0.25) * PI2, (0.6 - 0.25) * PI2];
        path.arc.mock.calls[0].forEach((value, index) => expect(value).toBeCloseTo(expected[index]));
    });

    test("toJSON", () => {
        const json = arc.toJSON();

        expect(json.radius).toBe(20);
        expect(json.startAngle).toBeCloseTo(0.1);
        expect(json.endAngle).toBeCloseTo(0.6);
    });
});
