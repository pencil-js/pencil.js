import test from "ava";
import Line from "./line";

test.beforeEach((t) => {
    t.context = new Line([100, 50], [
        [150, 150],
        [200, 200],
    ]);
});

test("constructor", (t) => {
    t.is(t.context.position.x, 100);
    t.is(t.context.position.y, 50);
    t.is(t.context.points.length, 2);
});

test("trace", (t) => {
    const expected = [
        [150, 150],
        [200, 200],
    ];
    const path = {
        moveTo: (...params) => {
            t.deepEqual(params, [0, 0]);
        },
        lineTo: (...params) => {
            t.deepEqual(params, expected[path.call++]);
        },
        call: 0,
    };
    t.plan(3);
    t.context.trace(path);
});

test("ishover", (t) => {
    t.false(t.context.isHover([0, 0]));
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.deepEqual(json.position, t.context.position);
    t.deepEqual(json.points, t.context.points);
    t.is(json.constructor, "Line");
});

test("from", (t) => {
    const definition = {
        points: [
            [10, 20],
            [100, 200],
        ],
    };
    const line = Line.from(definition);

    t.is(line.points.length, 2);
    line.points.forEach((point, index) => {
        t.is(point.x, definition.points[index][0]);
        t.is(point.y, definition.points[index][1]);
    });
});

test("defaultOptions", (t) => {
    t.is(Line.defaultOptions.fill, null);
    t.is(Line.defaultOptions.cap, Line.caps.round);
    t.is(Line.defaultOptions.join, Line.joins.round);
});

test("caps", (t) => {
    t.is(Line.caps.butt, "butt");
    t.is(Line.caps.round, "round");
    t.is(Line.caps.square, "square");
});
