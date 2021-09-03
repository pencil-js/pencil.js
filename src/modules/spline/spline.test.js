import test from "ava";
import Spline from ".";

test.beforeEach((t) => {
    const points = [...new Array(5)].map((_, i) => [(i + 1) ** 2, (i + 1) * 2]);
    t.context = new Spline([120, 55], points, 0.7);
});

test("creation", (t) => {
    t.is(t.context.tension, 0.7);
    t.is(t.context.points.length, 5);
});

test("trace", (t) => {
    t.plan(6);
    t.context.trace({
        moveTo: (...params) => t.deepEqual(params, [0, 0]),
        bezierCurveTo: () => t.pass(),
    });
});

test("trace with tension at 0", (t) => {
    t.plan(6);
    t.context.tension = 0;
    t.context.trace({
        moveTo: (...params) => t.deepEqual(params, [0, 0]),
        lineTo: () => t.pass(),
    });
});

test("trace with absolute option", (t) => {
    let i = 0;
    t.context.options.absolute = true;
    t.context.trace({
        moveTo: (...params) => t.deepEqual(params, [0, 0]),
        bezierCurveTo: (c1x, c1y, c2x, c2y, x, y) => {
            t.is(t.context.points[i].x - t.context.position.x, x);
            t.is(t.context.points[i].y - t.context.position.y, y);
            ++i;
        },
    });
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.is(json.points.length, 5);
    t.is(json.tension, 0.7);
    t.is(json.constructor, "Spline");
});

test("from", (t) => {
    const definition = {
        points: [
            [10, 20],
            [30, 40],
        ],
        tension: 0.5,
    };
    const spline = Spline.from(definition);

    t.is(spline.points.length, 2);
    t.is(spline.tension, 0.5);
});

test("defaultTension", (t) => {
    t.is(Spline.defaultTension, 0.2);
});

test("splineThrough", (t) => {
    const points = [
        [100, 200],
        [200, 200],
        [300, 300],
        [400, 100],
    ];
    t.plan(points.length);
    Spline.splineThrough({
        bezierCurveTo: () => t.pass(),
    }, points, 0.5);
});

test("splineThrough 2 points", (t) => {
    t.plan(1);
    Spline.splineThrough({
        lineTo: (...params) => t.deepEqual(params, [300, 400]),
    }, [
        [100, 200],
        [300, 400],
    ]);
});

test("splineThrough throws", (t) => {
    t.throws(() => Spline.splineThrough({}, [[1, 2]]), {
        instanceOf: RangeError,
    });
    t.throws(() => Spline.splineThrough({}, []), {
        instanceOf: RangeError,
    });
});
