import test from "ava";
import Spline from "./spline";

test.beforeEach((t) => {
    t.context = new Spline([0, 0], [
        [10, 20],
        [30, 40],
        [50, 60],
    ], 0.5);
});

test.todo("constructor");

test.todo("trace");

test.todo("toJSON");

test.todo("from");

test.todo("defaultTension");

test.todo("splineThrough");

test.todo("getControlPoint");
