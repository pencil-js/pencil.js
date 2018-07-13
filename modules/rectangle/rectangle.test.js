/* global describe beforeEach test expect */

import Rectangle from "./rectangle";

describe("Rectangle", () => {
    let rect;
    beforeEach(() => {
        rect = new Rectangle([-20, 20], 123.4, 22.22);
    });

    test("creation and trace", () => {
        expect(rect.width).toBeCloseTo(123.4);
        expect(rect.height).toBeCloseTo(22.22);
    });

    test("trace", () => {
        const path = new Path2D();
        rect.trace(path);
        expect(path.rect).toHaveBeenCalledTimes(1);
        expect(path.rect).toHaveBeenCalledWith(-0, -0, 123.4, 22.22);
    });

    test("getOriginPosition", () => {
        const defaultOrigin = rect.getOriginPosition();
        expect(defaultOrigin.x).toBe(0);
        expect(defaultOrigin.y).toBe(0);

        rect.options.origin = Rectangle.origins.center;
        const centerOrigin = rect.getOriginPosition();
        expect(centerOrigin.x).toBeCloseTo(123.4 / 2);
        expect(centerOrigin.y).toBeCloseTo(22.22 / 2);
    });

    test("toJSON", () => {
        const json = rect.toJSON();
        expect(json.width).toBeCloseTo(123.4);
        expect(json.height).toBeCloseTo(22.22);
    });

    describe("statics", () => {
        test.skip("from", () => {
        });

        test("defaultOptions", () => {
            expect(Rectangle.defaultOptions.origin).toBe(Rectangle.origins.topLeft);
        });

        test("origins", () => {
            expect(Rectangle.origins.topLeft).toBe("topLeft");
            expect(Rectangle.origins.topRight).toBe("topRight");
            expect(Rectangle.origins.center).toBe("center");
            expect(Rectangle.origins.bottomLeft).toBe("bottomLeft");
            expect(Rectangle.origins.bottomRight).toBe("bottomRight");
        });
    });
});
