import test from "ava";
import Path from "./path";

test.beforeEach((t) => {
    t.context = new Path([10, 20], [
        Path.lineTo([100, 100]),
        Path.arcTo([200, 200]),
    ], false);
});

test("constructor", (t) => {
    t.is(t.context.instructions.length, 2);
    t.false(t.context.isClosed);
    t.truthy(t.context.closing);
});

test.todo("trace");

test("trace not closed", (t) => {
    const ctx = {
        moveTo: (...params) => t.deepEqual(params, [0, 0]),
        lineTo: () => t.pass(),
        bezierCurveTo: () => t.pass(),
    };
    t.plan(3);
    t.context.trace(ctx);
});

test("trace instructions string", (t) => {
    const path = new Path([10, 20], "C 40 10, 65 10, 95 80 S 150 150, 180 80");
    const ctx = {
        addPath: () => t.pass(),
    };
    global.Path2D = class Path2D {
        constructor(string) {
            t.is(string, "C 40 10, 65 10, 95 80 S 150 150, 180 80 Z");
        }
    };
    path.trace(ctx);
});

test.todo("isHover");

test("isHover not closed", (t) => {
    t.false(t.context.isHover());
});

test.todo("toJSON");

test.todo("from");

test.todo("lineTo");

test.todo("moveTo");

test.todo("quarterTo");

test.todo("halfTo");

test.todo("arcTo");

test.todo("quadTo");

test.todo("bezierTo");

test.todo("splineThrough");

test.todo("waveTo");

test.todo("sinTo");
