import { test, expect, beforeEach } from "vitest";
import pathRecorder from "../test/_path-recorder.js";


let context: any;
import RegularPolygon from "./regular-polygon.js";
import almostEqual from "../test/_almost-equal.js";

beforeEach(() => {
    context = new RegularPolygon([10, 20], 5, 20);
});

test("constructor", () => {
    expect(context.points.length).toBe(5);
    expect(context.radius).toBe(20);
    expect(context.position.x).toBe(10);
    expect(context.position.y).toBe(20);

    expect(() => new RegularPolygon()).toThrow();
});

test("set radius", () => {
    context.radius = 42;

    expect(context.points.every(p => almostEqual(p.distance(), 42))).toBe(true);
    expect(context.radius).toBe(42);
});

test("trace", () => {
    const path = pathRecorder();
    context.trace(path);
    expect(path.calls.length).toBe(context.points.length + 1);
});

test("toJSON", () => {
    const json = context.toJSON();

    expect(json.nbSides).toBe(5);
    expect(json.radius).toBe(20);
    expect(json.points).toBe(undefined);
    expect(json.constructor).toBe("RegularPolygon");
});

test("from", () => {
    const definition = {
        nbSides: 7,
        radius: 20,
    };
    const polygon = RegularPolygon.from(definition);

    expect(polygon.points.length).toBe(7);
    expect(polygon.radius).toBe(20);
});

test("getRotatingPoints", () => {
    const points = RegularPolygon.getRotatingPoints(4, 50);

    expect(points.length).toBe(4);
});
