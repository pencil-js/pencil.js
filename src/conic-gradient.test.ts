import { test, expect, beforeEach } from "vitest";


let context: any;
import ConicGradient from "./conic-gradient.js";

beforeEach(() => {
    context = new ConicGradient([0, 0], 0, {
        0: "red",
        1: "blue",
    });
});

test("constructor", () => {
    expect(context.position.constructor.name).toBe("Position");
    expect(context.startAngle).toBe(0);
    expect(typeof context.colorStops).toBe("object");
});

test("toString", () => {
    const expected = [
        [0, "red"],
        [1, "blue"],
    ];
    const ctx = {
        createConicGradient: () => ({
            itsMe: "lethe",
            addColorStop: (...args) => expect(args).toEqual(expected[ctx.call++]),
        }),
        call: 0,
    };
    expect.assertions(3);
    const gradient = context.toString(ctx);
    expect(gradient.itsMe).toBe("lethe");
});
