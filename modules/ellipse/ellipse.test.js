import test from "ava";
import Ellipse from ".";

test.beforeEach((t) => {
    t.context = new Ellipse([10, 20], 50, 100);
});

test("constructor", (t) => {
    t.is(t.context.horizontalRadius, 50);
    t.is(t.context.verticalRadius, 100);
    t.is(t.context.startAngle, 0);
    t.is(t.context.endAngle, 1);
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.is(json.horizontalRadius, 50);
    t.is(json.verticalRadius, 100);
    t.is(json.startAngle, undefined);
    t.is(json.endAngle, undefined);
    t.is(json.constructor, "Ellipse");
});

test("from", (t) => {
    const definition = {
        horizontalRadius: 10,
        verticalRadius: 20,
    };
    const ellipse = Ellipse.from(definition);

    t.is(ellipse.horizontalRadius, 10);
    t.is(ellipse.verticalRadius, 20);
});

test("defaultOptions", (t) => {
    t.truthy(Ellipse.defaultOptions.fill);
    t.falsy(Ellipse.defaultOptions.stroke);
});
