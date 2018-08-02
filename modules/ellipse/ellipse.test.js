import test from "ava";
import Ellipse from "./ellipse";

test.beforeEach((t) => {
    t.context = new Ellipse([10, 20], 50, 100);
});

test("constructor", (t) => {
    t.is(t.context.width, 50);
    t.is(t.context.height, 100);
    t.is(t.context.startAngle, 0);
    t.is(t.context.endAngle, 1);
});

test("toJSON", (t) => {
    const json = t.context.toJSON();
    t.is(json.width, 50);
    t.is(json.height, 100);
    t.is(json.startAngle, undefined);
    t.is(json.endAngle, undefined);
});

test.todo("from");

test("defaultOptions", (t) => {
    t.truthy(Ellipse.defaultOptions.fill);
    t.falsy(Ellipse.defaultOptions.stroke);
});
