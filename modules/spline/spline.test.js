/* global test expect */

import Position from "@pencil.js/position";
import Spline from "./spline";

test("Spline creation and trace", () => {
    const n = 5;
    const points = (new Array(n)).fill().map((x, index) => new Position(index + 1, index + 1));
    const spline = new Spline([0, 0], points, 0.7);

    expect(spline.tension).toBe(0.7);
    expect(spline.points.length).toBe(n);

    const path = new Path2D();
    spline.trace(path);
    expect(path.bezierCurveTo.mock.calls.length).toBe(n);

    spline.tension = 0;
    spline.trace(path);
    expect(path.lineTo.mock.calls.length).toBe(n);
});

test("Spline static", () => {
    const points = [new Position(10, 10), new Position(0, 20), new Position(20, 30)];
    const ctrls = Spline.getControlPoint(points, 0.5);
    expect(ctrls.length).toBe(2);
    expect(ctrls[0] instanceof Position).toBe(true);
    expect(ctrls[0].x).toBe(-5);
    expect(ctrls[0].y).toBe(10);
    expect(ctrls[1] instanceof Position).toBe(true);
    expect(ctrls[1].x).toBe(5);
    expect(ctrls[1].y).toBe(30);

    expect(() => Spline.getControlPoint([], 0)).toThrowError(RangeError);
});
