import test from "ava";
import LinearGradient from "./linear-gradient.js";

test.beforeEach((t) => {
    t.context = new LinearGradient([0, 0], [100, 200], {
        0: "red",
        1: "#123456",
    });
});

test("constructor", (t) => {
    t.is(t.context.from.constructor.name, "Position");
    t.is(t.context.to.constructor.name, "Position");
    t.is(typeof t.context.colorStops, "object");
});

test("toString", (t) => {
    const expected = [
        ["0", "red"],
        ["1", "#123456"],
    ];
    const ctx = {
        createLinearGradient: () => ({
            itsMe: "mario",
            addColorStop: (...args) => t.deepEqual(args, expected[ctx.call++]),
        }),
        call: 0,
    };
    t.plan(3);
    const gradient = t.context.toString(ctx);
    t.is(gradient.itsMe, "mario");
});
