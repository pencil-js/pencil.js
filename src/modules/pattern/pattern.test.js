import test from "ava";
import Pattern from ".";

const img = new window.Image();
test.beforeEach((t) => {
    t.context = new Pattern(img, {
        repeat: "???",
        scale: 2,
        origin: [1, 2],
    });
});

test("constructor", (t) => {
    t.is(typeof t.context.options, "object");
    t.is(t.context.source, img);
});

test("toString", (t) => {
    const pattern = {
        setTransform (matrix) {
            t.true(matrix instanceof window.DOMMatrix);
        },
    };
    const ctx = {
        createPattern () {
            return pattern;
        },
    };
    t.is(t.context.toString(ctx), pattern);
    t.plan(2);
});

test("defaultOptions", (t) => {
    const { repeat, scale, origin } = Pattern.defaultOptions;
    t.is(repeat, Pattern.repetition.repeat);
    t.is(scale, 1);
    t.is(origin.x, 0);
    t.is(origin.y, 0);
});
