import test from "ava";
import Circle from "./circle";

test.beforeEach((t) => {
    t.context = new Circle([0, 0], 10);
});

test("constructor", (t) => {
    t.is(t.context.radius, 10);
    t.is(t.context.startAngle, 0);
    t.is(t.context.endAngle, 1);
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.is(json.radius, 10);
    t.is(json.startAngle, undefined);
    t.is(json.endAngle, undefined);
});

test.todo("from");

test.todo("defaultOptions");
