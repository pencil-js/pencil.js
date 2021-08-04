import test from "ava";
import RegularPolygon from "./regular-polygon.js";
import almostEqual from "../../../test/_almost-equal.js";

test.beforeEach((t) => {
    t.context = new RegularPolygon([10, 20], 5, 20);
});

test("constructor", (t) => {
    t.is(t.context.points.length, 5);
    t.is(t.context.radius, 20);
    t.is(t.context.position.x, 10);
    t.is(t.context.position.y, 20);

    t.throws(() => new RegularPolygon(), {
        instanceOf: RangeError,
    });
});

test("set radius", (t) => {
    t.context.radius = 42;

    t.true(t.context.points.every(p => almostEqual(p.distance(), 42)));
    t.is(t.context.radius, 42);
});

test("trace", (t) => {
    const path = {
        lineTo: () => {
            t.pass();
        },
    };
    t.plan(t.context.points.length + 2);
    t.context.trace(path);
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.is(json.nbSides, 5);
    t.is(json.radius, 20);
    t.is(json.points, undefined);
    t.is(json.constructor, "RegularPolygon");
});

test("from", (t) => {
    const definition = {
        nbSides: 7,
        radius: 20,
    };
    const polygon = RegularPolygon.from(definition);

    t.is(polygon.points.length, 7);
    t.is(polygon.radius, 20);
});

test("getRotatingPoints", (t) => {
    const points = RegularPolygon.getRotatingPoints(4, 50);

    t.is(points.length, 4);
});
