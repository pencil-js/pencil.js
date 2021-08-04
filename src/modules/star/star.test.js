import test from "ava";
import Star from "./star.js";
import almostEqual from "../../../test/_almost-equal.js";

test.beforeEach((t) => {
    t.context = new Star([10, 20], 6, 11, 0.2);
});

test("constructor", (t) => {
    t.is(t.context.nbBranches, 6);
    t.is(t.context.points.length, 12);
    t.is(t.context.radius, 11);
    t.is(t.context.bevelRatio, 0.2);

    const defaultStar = new Star();
    t.is(defaultStar.points.length, 10);
    t.is(defaultStar.bevelRatio, 0.5);
});

const checkPointsDistance = (t) => {
    t.context.points.forEach((point, index) => {
        const distance = point.distance();
        const expected = t.context.radius * (index % 2 ? t.context.bevelRatio : 1);
        t.true(almostEqual(distance, expected));
    });
};

test("set nbBranches", (t) => {
    t.context.nbBranches = 4;
    t.is(t.context.nbBranches, 4);
    t.is(t.context.points.length, 8);
    checkPointsDistance(t);
});

test("set radius", (t) => {
    t.context.radius = 23;
    t.is(t.context.radius, 23);
    checkPointsDistance(t);
});

test("set bevel ratio", (t) => {
    t.context.bevelRatio = 0.5;
    t.is(t.context.bevelRatio, 0.5);
    checkPointsDistance(t);
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.is(json.nbBranches, 6);
    t.is(json.bevelRatio, 0.2);
    t.is(json.nbSides, undefined);
    t.is(json.constructor, "Star");
});

test("from", (t) => {
    const definition = {
        nbBranches: 7,
        bevelRatio: 0.3,
    };
    const star = Star.from(definition);

    t.is(star.points.length, 14);
    t.is(star.bevelRatio, 0.3);
});
