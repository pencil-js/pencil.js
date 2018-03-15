/* global test expect beforeAll */

import Position from "@pencil.js/position";
import Circle from "./circle";

let circle;
beforeAll(() => {
    circle = new Circle(new Position(), 10);
});

test("Circle creation", () => {
    expect(circle.radius).toBe(10);
    expect(circle.startAngle).toBe(0);
    expect(circle.endAngle).toBe(1);
});

test("Circle isHover", () => {
    expect(circle.isHover(new Position())).toBe(true);
    expect(circle.isHover(new Position(0, 10))).toBe(true);
    expect(circle.isHover(new Position(10, 10))).toBe(false);
});
