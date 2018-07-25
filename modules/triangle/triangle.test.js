import test from "ava";
import Triangle from "./triangle";

test.beforeEach((t) => {
    t.context = new Triangle([0, 0], 10);
});

test("constructor", (t) => {
    t.is(t.context.points.length, 3);
});

test("toJSON", (t) => {
    const json = t.context.toJSON();
    t.is(json.nbSides, undefined);
});
