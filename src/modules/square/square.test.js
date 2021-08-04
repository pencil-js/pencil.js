import test from "ava";
import Square from "./square.js";

test.beforeEach((t) => {
    t.context = new Square([0, 0], 123);
});

test("constructor", (t) => {
    t.is(t.context.width, 123);
    t.is(t.context.height, 123);
});

test("get and set size", (t) => {
    t.is(t.context.size, 123);

    t.context.size = 99;
    t.is(t.context.size, 99);
    t.is(t.context.width, 99);
    t.is(t.context.height, 99);

    t.context.width = 42;
    t.is(t.context.width, 42);
    t.is(t.context.height, 42);

    t.context.height = 24;
    t.is(t.context.width, 24);
    t.is(t.context.height, 24);
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.is(json.size, 123);
    t.is(json.width, undefined);
    t.is(json.height, undefined);
    t.is(json.constructor, "Square");
});

test("from", (t) => {
    const definition = {
        size: 123,
    };
    const square = Square.from(definition);

    t.is(square.size, 123);
});
