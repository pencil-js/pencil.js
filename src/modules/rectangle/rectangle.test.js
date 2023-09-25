import test from "ava";
import Rectangle from "./rectangle.js";

test.beforeEach((t) => {
    t.context = new Rectangle([-20, 20], 123, 22, {
        origin: Rectangle.origins.center,
    });
});

test("constructor", (t) => {
    t.is(t.context.width, 123);
    t.is(t.context.height, 22);
    t.is(t.context.options.origin, Rectangle.origins.center);

    const defaultRectangle = new Rectangle();
    t.is(defaultRectangle.width, 0);
    t.is(defaultRectangle.height, 0);
});

test("trace", (t) => {
    const path = {
        rect: (...params) => {
            t.deepEqual(params, [0, 0, 123, 22]);
        },
    };
    t.plan(1);
    t.context.trace(path);
});

test("trace rounded", (t) => {
    t.context.options.rounded = 11;
    const path = {
        roundRect: (...params) => {
            t.deepEqual(params, [0, 0, 123, 22, 11]);
        },
    };
    t.plan(1);
    t.context.trace(path);
});

test("getOrigin", (t) => {
    const { origins } = Rectangle;
    const expected = {
        [origins.topLeft]: [0, 0],
        [origins.topCenter]: [-123 / 2, 0],
        [origins.topRight]: [-123, 0],
        [origins.centerLeft]: [0, -22 / 2],
        [origins.center]: [-123 / 2, -22 / 2],
        [origins.centerRight]: [-123, -22 / 2],
        [origins.bottomLeft]: [0, -22],
        [origins.bottomCenter]: [-123 / 2, -22],
        [origins.bottomRight]: [-123, -22],
    };
    Object.keys(expected).forEach((origin) => {
        t.context.options.origin = origin;
        const defaultOrigin = t.context.getOrigin();
        t.is(defaultOrigin.x, expected[origin][0]);
        t.is(defaultOrigin.y, expected[origin][1]);
    });
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.is(json.width, 123);
    t.is(json.height, 22);
    t.is(json.constructor, "Rectangle");
});

test("from", (t) => {
    const definition = {
        width: 42,
        height: 666,
    };
    const rectangle = Rectangle.from(definition);

    t.is(rectangle.width, 42);
    t.is(rectangle.height, 666);
});
