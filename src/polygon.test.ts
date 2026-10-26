import { test, expect, beforeEach } from "vitest";
import pathRecorder from "../test/_path-recorder.js";


let context: any;
import Polygon from "./polygon.js";

beforeEach(() => {
    context = new Polygon([10, 20], [
        [100, 200],
        [300, 400],
        [500, 600],
    ]);
});

test("constructor", () => {
    expect(context.points.length).toBe(3);

    expect(() => new Polygon()).toThrow();
});

test("trace", () => {
    const expected = [
        [100, 200],
        [300, 400],
        [500, 600],
    ];
    const path = pathRecorder();
    context.trace(path);
    expect(path.calls).toEqual([
        ["moveTo", ...expected[0]],
        ["lineTo", ...expected[1]],
        ["lineTo", ...expected[2]],
        ["closePath"],
    ]);
});

test("toJSON", () => {
    const json = context.toJSON();

    expect(json.points).toEqual(context.points.map((point: any) => point.toJSON()));
    expect(json.constructor).toBe("Polygon");
});

test("from", () => {
    const definition = {
        points: [
            [10, 20],
            [100, 200],
            [1000, 2000],
        ],
    };
    const polygon = Polygon.from(definition);

    expect(polygon.points.length).toBe(3);
    polygon.points.forEach((point, index) => {
        expect(point.x).toBe(definition.points[index][0]);
        expect(point.y).toBe(definition.points[index][1]);
    });
});
