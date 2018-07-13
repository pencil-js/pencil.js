/* global describe beforeAll test expect */

import Circle from "./circle";

describe("Circle", () => {
    let circle;
    beforeAll(() => {
        circle = new Circle(undefined, 10);
    });

    test("creation", () => {
        expect(circle.radius).toBe(10);
        expect(circle.startAngle).toBe(0);
        expect(circle.endAngle).toBe(1);
    });

    test("toJSON", () => {
        const json = circle.toJSON();

        expect(json.radius).toBe(10);
        expect(json.startAngle).not.toBeDefined();
        expect(json.endAngle).not.toBeDefined();
    });
});
