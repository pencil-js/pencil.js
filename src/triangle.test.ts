import { test, expect, beforeEach } from "vitest";


let context: any;
import Triangle from "./triangle.js";

beforeEach(() => {
    context = new Triangle([0, 0], 10);
});

test("constructor", () => {
    expect(context.points.length).toBe(3);
});

test("toJSON", () => {
    const json = context.toJSON();

    expect(json.nbSides).toBe(undefined);
    expect(json.constructor).toBe("Triangle");
});

test("from", () => {
    const definition = {
        radius: 20,
    };
    const triangle = Triangle.from(definition);

    expect(triangle.radius).toBe(20);
});
