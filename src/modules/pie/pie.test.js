import test from "ava";
import Pie from ".";

test.beforeEach((t) => {
    t.context = new Pie([0, 0], 99, 0.1, 0.9);
});

test("constructor", (t) => {
    t.is(t.context.radius, 99);
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.is(json.radius, 99);
    t.is(json.width, undefined);
    t.is(json.height, undefined);
    t.is(json.constructor, "Pie");
});
