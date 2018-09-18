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
    t.is(t.context.horizontalRadius, 20);
    t.is(t.context.verticalRadius, 20);
});

test("trace", (t) => {
    const ctx = {
        arc: () => t.pass(),
    };
    t.plan(2);
    t.is(t.context.trace(ctx), t.context);
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.is(json.radius, 10);
    t.is(json.startAngle, undefined);
    t.is(json.endAngle, undefined);
    t.is(json.constructor, "Circle");
});

test("from", (t) => {
    const definition = {
        radius: 10,
    };
    const circle = Circle.from(definition);

    t.is(circle.radius, 10);
});
