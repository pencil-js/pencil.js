import test from "ava";
import Spline from "./spline";

test.beforeEach((t) => {
    const points = (new Array(5)).fill().map((x, index) => [index + 1, index + 1]);
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

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.is(json.points.length, 5);
    t.is(json.tension, 0.7);
});

test.todo("from");

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
    t.plan(points.length - 1);
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
    t.throws(() => Spline.splineThrough({}, [[1, 2]]), RangeError);
    t.throws(() => Spline.splineThrough({}, []), RangeError);
});

test("getControlPoint", (t) => {
    const points = [[10, 10], [0, 20], [20, 30]];
    const ctrls = Spline.getControlPoint(points, 0.5);
    t.is(ctrls.length, 2);
    t.is(ctrls[0].x, -5);
    t.is(ctrls[0].y, 10);
    t.is(ctrls[1].x, 5);
    t.is(ctrls[1].y, 30);

    t.throws(() => Spline.getControlPoint([], 0), RangeError);
});
