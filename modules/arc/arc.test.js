/* global describe beforeEach test expect */

import Arc from "./arc";

describe("Arc", () => {
    let arc;
    beforeEach(() => {
        arc = new Arc([100, 50], 20, 0.1, 0.6);
    });

    test("creation", () => {
        expect(arc.position.x).toBe(100);
        expect(arc.position.y).toBe(50);
        expect(arc.radius).toBe(20);
        expect(arc.startAngle).toBeCloseTo(0.1);
        expect(arc.endAngle).toBeCloseTo(0.6);
    });

    test("trace", () => {
        const path = new Path2D();
        arc.trace(path);

        expect(path.arc).toHaveBeenCalledTimes(1);
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

    describe("statics", () => {
        test.skip("from", () => {
        });

        test("defaultOptions", () => {
            expect(Arc.defaultOptions.cap).toBe(Arc.caps.round);
            expect(Arc.defaultOptions.fill).not.toBeDefined();
            expect(Arc.defaultOptions.join).not.toBeDefined();
        });

        test("caps", () => {
            expect(Arc.caps.butt).toBe("butt");
            expect(Arc.caps.round).toBe("round");
            expect(Arc.caps.square).toBe("square");
        });
    });
});
