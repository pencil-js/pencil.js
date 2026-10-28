import { test, expect, beforeEach } from "vitest";


let context: any;
import RadialGradient from "./radial-gradient.js";

beforeEach(() => {
    context = new RadialGradient([0, 0], 100, {
        0: "red",
        1: "#123456",
    });
});

test("constructor", () => {
    expect(context.position.constructor.name).toBe("Position");
    expect(context.radius).toBe(100);
    expect(typeof context.colorStops).toBe("object");
});

test("toString", () => {
    const expected = [
        [0, "red"],
        [1, "#123456"],
    ];
    const ctx = {
        createRadialGradient: () => ({
            itsMe: "mario",
            addColorStop: (...args) => expect(args).toEqual(expected[ctx.call++]),
        }),
        call: 0,
    };
    expect.assertions(3);
    const gradient = context.toString(ctx);
    expect(gradient.itsMe).toBe("mario");
});
