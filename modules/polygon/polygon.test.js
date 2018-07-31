import test from "ava";
import Polygon from "./polygon";

test.beforeEach((t) => {
    t.context = new Polygon([10, 20], [
        [100, 200],
        [300, 400],
    ]);
});

test("constructor", (t) => {
    t.is(t.context.points.length, 2);

    t.throws(() => new Polygon(), RangeError);
});

test("trace", (t) => {
    const expected = [
        [100, 200],
        [300, 400],
        [0, 0],
    ];
    const path = {
        lineTo: (...params) => {
            t.deepEqual(params, expected[path.call++ % expected.length]);
        },
        call: 0,
    };
    t.plan(t.context.points.length + 3);
    t.context.trace(path);
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.deepEqual(json.points, [
        [100, 200],
        [300, 400],
    ]);
});

test.todo("from");
