import test from "ava";
import RadialGradient from ".";

test.beforeEach((t) => {
    t.context = new RadialGradient([0, 0], 100, {
        0: "red",
        1: "#123456",
    });
});

test("constructor", (t) => {
    t.is(t.context.position.constructor.name, "Position");
    t.is(t.context.radius, 100);
    t.is(typeof t.context.colorStops, "object");
});

test("toString", (t) => {
    const expected = [
        ["0", "red"],
        ["1", "#123456"],
    ];
    const ctx = {
        createRadialGradient: () => ({
            itsMe: "mario",
            addColorStop: (...args) => t.deepEqual(args, expected[ctx.call++]),
        }),
        call: 0,
    };
    t.plan(3);
    const gradient = t.context.toString(ctx);
    t.is(gradient.itsMe, "mario");
});
