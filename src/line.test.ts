import { test, expect, beforeEach } from "vitest";


let context: any;
import Component from "./component.js";
import Line from "./line.js";

beforeEach(() => {
    context = new Line([100, 50], [
        [150, 150],
        [200, 200],
    ]);
});

test("constructor", () => {
    expect(context.position.x).toBe(100);
    expect(context.position.y).toBe(50);
    expect(context.points.length).toBe(2);
});

test("trace", () => {
    const expected = [
        [150, 150],
        [200, 200],
    ];
    let i = 0;
    const path = {
        moveTo: (...params) => {
            expect(params).toEqual([0, 0]);
        },
        lineTo: (...params) => {
            expect(params).toEqual(expected[i++]);
        },
    };
    expect.assertions(3);
    context.trace(path);
});

test("trace absolute", () => {
    context.options.absolute = true;
    const expected = [
        [50, 100],
        [100, 150],
    ];
    let i = 0;
    const path = {
        moveTo: (...params) => {
            expect(params).toEqual([0, 0]);
        },
        lineTo: (...params) => {
            expect(params).toEqual(expected[i++]);
        },
    };
    expect.assertions(3);
    context.trace(path);
});

test("toJSON", () => {
    const json = context.toJSON();

    expect(json.position).toEqual(context.position.toJSON());
    expect(json.points).toEqual(context.points.map((point: any) => point.toJSON()));
    expect(json.constructor).toBe("Line");
});

test("from", () => {
    const definition = {
        points: [
            [10, 20],
            [100, 200],
        ],
    };
    const line = Line.from(definition);

    expect(line.points.length).toBe(2);
    line.points.forEach((point, index) => {
        expect(point.x).toBe(definition.points[index][0]);
        expect(point.y).toBe(definition.points[index][1]);
    });
});

test("defaultOptions", () => {
    const { cap, join, fill, stroke, absolute } = Line.defaultOptions;
    expect(cap).toBe(Line.caps.round);
    expect(join).toBe(Line.joins.round);
    expect(fill).toBe(null);
    expect(stroke).toBe(Component.defaultOptions.fill);
    expect(absolute).toBe(false);
});

test("caps", () => {
    expect(Line.caps.butt).toBe("butt");
    expect(Line.caps.round).toBe("round");
    expect(Line.caps.square).toBe("square");
});
