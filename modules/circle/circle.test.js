/* global test expect beforeAll */

import Circle from "./circle";

let circle;
beforeAll(() => {
    circle = new Circle(undefined, 10);
});

test("Circle creation", () => {
    expect(circle.radius).toBe(10);
    expect(circle.startAngle).toBe(0);
    expect(circle.endAngle).toBe(1);
});
