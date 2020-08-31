import test from "ava";
import Particles from ".";

test.beforeEach((t) => {
    t.context = new Particles([10, 20], {
        trace: () => "",
    }, 10, i => ({
        position: [100, 200],
        rotation: i,
    }), (data, i) => {
        data.called = i;
    });
});

test("constructor", (t) => {
    t.true(typeof t.context.base === "object");
    t.is(t.context.data.length, 10);
    t.context.data.forEach((data, i) => {
        t.true(data.position.constructor.name === "Position");
        t.is(data.position.x, 100);
        t.is(data.position.y, 200);
        t.is(data.rotation, i);
        t.is(data.called, undefined);
    });
});

test("trace", (t) => {
    t.context.trace({
        addPath: () => t.pass(),
    });
    t.plan(20);
    t.context.data.forEach((data, i) => {
        t.is(data.called, i);
    });
});

test("isHover", (t) => {
    t.false(t.context.isHover(t.context.position));
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.truthy(json.base);
    t.is(json.data.length, 10);
});

test.todo("from");

test("defaultData", (t) => {
    const { defaultData } = Particles;
    t.true(defaultData.position.constructor.name === "Position");
    t.is(defaultData.position.x, 0);
    t.is(defaultData.position.y, 0);
});
