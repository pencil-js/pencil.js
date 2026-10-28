import { test, expect, beforeEach } from "vitest";


let context: any;
import Square from "./square.js";

beforeEach(() => {
    context = new Square([0, 0], 123);
});

test("constructor", () => {
    expect(context.width).toBe(123);
    expect(context.height).toBe(123);
});

test("get and set size", () => {
    expect(context.size).toBe(123);

    context.size = 99;
    expect(context.size).toBe(99);
    expect(context.width).toBe(99);
    expect(context.height).toBe(99);

    context.width = 42;
    expect(context.width).toBe(42);
    expect(context.height).toBe(42);

    context.height = 24;
    expect(context.width).toBe(24);
    expect(context.height).toBe(24);
});

test("toJSON", () => {
    const json = context.toJSON();

    expect(json.size).toBe(123);
    expect(json.width).toBe(undefined);
    expect(json.height).toBe(undefined);
    expect(json.constructor).toBe("Square");
});

test("from", () => {
    const definition = {
        size: 123,
    };
    const square = Square.from(definition);

    expect(square.size).toBe(123);
});
