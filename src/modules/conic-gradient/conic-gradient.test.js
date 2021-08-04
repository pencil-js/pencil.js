import test from "ava";
import ConicGradient from "./conic-gradient.js";

test.beforeEach((t) => {
    t.context = new ConicGradient([0, 0], 0, {
        0: "red",
        1: "blue",
    });
});

test("constructor", (t) => {
    t.is(t.context.position.constructor.name, "Position");
    t.is(t.context.radius, 0);
    t.is(typeof t.context.colorStops, "object");
});

test("toString", (t) => {
    const expected = [
        ["0", "red"],
        ["1", "blue"],
    ];
    const ctx = {
        createConicGradient: () => ({
            itsMe: "lethe",
            addColorStop: (...args) => t.deepEqual(args, expected[ctx.call++]),
        }),
        call: 0,
    };
    t.plan(3);
    const gradient = t.context.toString(ctx);
    t.is(gradient.itsMe, "lethe");
});
