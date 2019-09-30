import test from "ava";
import Heart from ".";

test.beforeEach((t) => {
    t.context = new Heart([100, 100], 2);
});

test("constructor", (t) => {
    t.is(t.context.radius, 2);
    t.is(t.context.position.x, 100);
    t.is(t.context.position.y, 100);
});

test("trace", (t) => {
    t.context.trace({
        moveTo: () => t.pass(),
        bezierCurveTo: () => t.pass(),
    });
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.is(json.radius, 2);
    t.is(json.constructor, "Heart");
});


test("from", (t) => {
    const definition = {
        position: {
            x: 0,
            y: 0,
        },
        radius: 100,
    };
    const heart = Heart.from(definition);

    t.true(heart instanceof Heart);
    t.is(heart.radius, 100);
    t.is(heart.position.x, 0);
    t.is(heart.position.y, 0);
});
