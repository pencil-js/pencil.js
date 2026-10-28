import { test, expect, beforeEach } from "vitest";


let context: any;
import Spline from "./spline.js";

beforeEach(() => {
    const points = [...new Array(5)].map((_, i) => [(i + 1) ** 2, (i + 1) * 2]);
    context = new Spline([120, 55], points, 0.7);
});

test("creation", () => {
    expect(context.tension).toBe(0.7);
    expect(context.points.length).toBe(5);
});

test("trace", () => {
    expect.assertions(11);
    let i = 0;
    context.trace({
        moveTo: (...params) => expect(params).toEqual([0, 0]),
        bezierCurveTo: (c1x, c1y, c2x, c2y, x, y) => {
            expect(x).toBe(context.points[i].x);
            expect(y).toBe(context.points[i].y);
            ++i;
        },
    });
});

test("trace with tension at 0", () => {
    expect.assertions(11);
    let i = 0;
    context.tension = 0;
    context.trace({
        moveTo: (...params) => expect(params).toEqual([0, 0]),
        lineTo: (x, y) => {
            expect(x).toBe(context.points[i].x);
            expect(y).toBe(context.points[i].y);
            ++i;
        },
    });
});

test("trace with absolute option", () => {
    let i = 0;
    context.options.absolute = true;
    context.trace({
        moveTo: (...params) => expect(params).toEqual([0, 0]),
        bezierCurveTo: (c1x, c1y, c2x, c2y, x, y) => {
            expect(context.points[i].x - context.position.x).toBe(x);
            expect(context.points[i].y - context.position.y).toBe(y);
            ++i;
        },
    });
});

test("toJSON", () => {
    const json = context.toJSON();

    expect(json.points.length).toBe(5);
    expect(json.tension).toBe(0.7);
    expect(json.constructor).toBe("Spline");
});

test("from", () => {
    const definition = {
        points: [
            [10, 20],
            [30, 40],
        ],
        tension: 0.5,
    };
    const spline = Spline.from(definition);

    expect(spline.points.length).toBe(2);
    expect(spline.tension).toBe(0.5);
});

test("defaultTension", () => {
    expect(Spline.defaultTension).toBe(0.2);
});

test("splineThrough", () => {
    const points = [
        [100, 200],
        [200, 200],
        [300, 300],
        [400, 100],
    ];
    expect.assertions(points.length - 1);
    Spline.splineThrough({
        bezierCurveTo: () => expect(true).toBe(true),
    }, points, 0.5);
});

test("splineThrough 2 points", () => {
    expect.assertions(1);
    Spline.splineThrough({
        lineTo: (...params) => expect(params).toEqual([300, 400]),
    }, [
        [100, 200],
        [300, 400],
    ]);
});

test("splineThrough throws", () => {
    expect(() => Spline.splineThrough({}, [[1, 2]])).toThrow();
    expect(() => Spline.splineThrough({}, [])).toThrow();
});
