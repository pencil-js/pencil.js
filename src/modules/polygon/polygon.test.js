import test from "ava";
import Polygon from "./polygon.js";

test.beforeEach((t) => {
    t.context = new Polygon([10, 20], [
        [100, 200],
        [300, 400],
        [500, 600],
    ]);
});

test("constructor", (t) => {
    t.is(t.context.points.length, 3);

    t.throws(() => new Polygon(), {
        instanceOf: RangeError,
    });
});

test("trace", (t) => {
    const expected = [
        [100, 200],
        [300, 400],
        [500, 600],
    ];
    const path = {
        lineTo: (...params) => {
            t.deepEqual(params, expected[path.call++ % expected.length]);
        },
        call: 0,
    };
    t.plan(t.context.points.length + 2);
    t.context.trace(path);
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.deepEqual(json.points, t.context.points);
    t.is(json.constructor, "Polygon");
});

test("from", (t) => {
    const definition = {
        points: [
            [10, 20],
            [100, 200],
            [1000, 2000],
        ],
    };
    const polygon = Polygon.from(definition);

    t.is(polygon.points.length, 3);
    polygon.points.forEach((point, index) => {
        t.is(point.x, definition.points[index][0]);
        t.is(point.y, definition.points[index][1]);
    });
});
