import test from "ava";
import Rectangle from ".";

test.beforeEach((t) => {
    t.context = new Rectangle([-20, 20], 123, 22);
});

test("constructor", (t) => {
    t.is(t.context.width, 123);
    t.is(t.context.height, 22);

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

test("getOrigin", (t) => {
    const defaultOrigin = t.context.getOrigin();
    t.is(defaultOrigin.x, 0);
    t.is(defaultOrigin.y, 0);

    t.context.options.origin = Rectangle.origins.center;
    const centerOrigin = t.context.getOrigin();
    t.is(centerOrigin.x, -123 / 2);
    t.is(centerOrigin.y, -22 / 2);

    t.context.options.origin = Rectangle.origins.bottomRight;
    const bottomRightOrigin = t.context.getOrigin();
    t.is(bottomRightOrigin.x, -123);
    t.is(bottomRightOrigin.y, -22);
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

test("origins", (t) => {
    t.is(Rectangle.origins.topLeft, "topLeft");
    t.is(Rectangle.origins.topRight, "topRight");
    t.is(Rectangle.origins.center, "center");
    t.is(Rectangle.origins.bottomLeft, "bottomLeft");
    t.is(Rectangle.origins.bottomRight, "bottomRight");
});
