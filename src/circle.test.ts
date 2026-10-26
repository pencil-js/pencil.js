import { test, expect, beforeEach } from "vitest";


let context: any;
import Circle from "./circle.js";

beforeEach(() => {
    context = new Circle([0, 0], 10);
});

test("constructor", () => {
    expect(context.startAngle).toBe(0);
    expect(context.endAngle).toBe(1);
});

test("get and set radius", () => {
    expect(context.radius).toBe(10);

    context.radius = 20;
    expect(context.radius).toBe(20);
    expect(context.width).toBe(20);
    expect(context.height).toBe(20);
});

test("trace", () => {
    const ctx = {
        arc: () => expect(true).toBe(true),
    };
    expect.assertions(2);
    expect(context.trace(ctx)).toBe(context);
});

test("toJSON", () => {
    const json = context.toJSON();

    expect(json.radius).toBe(10);
    expect(json.startAngle).toBe(undefined);
    expect(json.endAngle).toBe(undefined);
    expect(json.constructor).toBe("Circle");
});

test("from", () => {
    const definition = {
        radius: 10,
    };
    const circle = Circle.from(definition);

    expect(circle.radius).toBe(10);
});
