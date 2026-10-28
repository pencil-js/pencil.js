import { test, expect, beforeEach } from "vitest";


let context: any;
import LinearGradient from "./linear-gradient.js";

beforeEach(() => {
    context = new LinearGradient([0, 0], [100, 200], {
        0: "red",
        1: "#123456",
    });
});

test("constructor", () => {
    expect(context.from.constructor.name).toBe("Position");
    expect(context.to.constructor.name).toBe("Position");
    expect(typeof context.colorStops).toBe("object");
});

test("toString", () => {
    const expected = [
        [0, "red"],
        [1, "#123456"],
    ];
    const ctx = {
        createLinearGradient: () => ({
            itsMe: "mario",
            addColorStop: (...args) => expect(args).toEqual(expected[ctx.call++]),
        }),
        call: 0,
    };
    expect.assertions(3);
    const gradient = context.toString(ctx);
    expect(gradient.itsMe).toBe("mario");
});
