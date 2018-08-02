import test from "ava";
import Circle from "./circle";

test.beforeEach((t) => {
    t.context = new Circle([0, 0], 10);
});

test("constructor", (t) => {
    t.is(t.context.startAngle, 0);
    t.is(t.context.endAngle, 1);
});

test("get and set radius", (t) => {
    t.is(t.context.radius, 10);

    t.context.radius = 20;
    t.is(t.context.radius, 20);
    t.is(t.context.width, 40);
    t.is(t.context.height, 40);
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.is(json.radius, 10);
    t.is(json.startAngle, undefined);
    t.is(json.endAngle, undefined);
});

test.todo("from");
