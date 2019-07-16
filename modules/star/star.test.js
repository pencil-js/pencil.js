import test from "ava";
import Star from ".";

test.beforeEach((t) => {
    t.context = new Star([10, 20], 11, 6, 0.2);
});

test("constructor", (t) => {
    t.is(t.context.points.length, 12);
    t.is(t.context.bevelRatio, 0.2);

    const defaultStar = new Star();
    t.is(defaultStar.points.length, 10);
    t.is(defaultStar.bevelRatio, 0.5);
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
