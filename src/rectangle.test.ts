import { test, expect, beforeEach } from "vitest";


let context: any;
import Rectangle from "./rectangle.js";

beforeEach(() => {
    context = new Rectangle([-20, 20], 123, 22, {
        origin: Rectangle.origins.center,
    });
});

test("constructor", () => {
    expect(context.width).toBe(123);
    expect(context.height).toBe(22);
    expect(context.options.origin).toBe(Rectangle.origins.center);

    const defaultRectangle = new Rectangle();
    expect(defaultRectangle.width).toBe(0);
    expect(defaultRectangle.height).toBe(0);
});

test("trace", () => {
    const path = {
        rect: (...params) => {
            expect(params).toEqual([0, 0, 123, 22]);
        },
    };
    expect.assertions(1);
    context.trace(path);
});

test("trace rounded", () => {
    context.options.rounded = 11;
    const path = {
        roundRect: (...params) => {
            expect(params).toEqual([0, 0, 123, 22, 11]);
        },
    };
    expect.assertions(1);
    context.trace(path);
});

test("getOrigin", () => {
    const { origins } = Rectangle;
    const expected = {
        [origins.topLeft]: [0, 0],
        [origins.topCenter]: [-123 / 2, 0],
        [origins.topRight]: [-123, 0],
        [origins.centerLeft]: [0, -22 / 2],
        [origins.center]: [-123 / 2, -22 / 2],
        [origins.centerRight]: [-123, -22 / 2],
        [origins.bottomLeft]: [0, -22],
        [origins.bottomCenter]: [-123 / 2, -22],
        [origins.bottomRight]: [-123, -22],
    };
    Object.keys(expected).forEach((origin) => {
        context.options.origin = origin;
        const defaultOrigin = context.getOrigin();
        expect(defaultOrigin.x).toBe(expected[origin][0]);
        expect(defaultOrigin.y).toBe(expected[origin][1]);
    });
});

test("toJSON", () => {
    const json = context.toJSON();

    expect(json.width).toBe(123);
    expect(json.height).toBe(22);
    expect(json.constructor).toBe("Rectangle");
});

test("from", () => {
    const definition = {
        width: 42,
        height: 666,
    };
    const rectangle = Rectangle.from(definition);

    expect(rectangle.width).toBe(42);
    expect(rectangle.height).toBe(666);
});
