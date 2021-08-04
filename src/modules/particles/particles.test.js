import test from "ava";
import Particles from "./particles.js";

test.beforeEach((t) => {
    t.context = new Particles([10, 20], {
        trace: () => "",
    }, (i, additional) => ({
        position: [100, 200],
        i,
        ...additional,
    }), (data, i) => {
        data.called = i;
    });
});

test("constructor", (t) => {
    t.true(typeof t.context.base === "object");
    t.is(t.context.data.length, 0);
});

test("generate and trace", (t) => {
    t.context.generate(20, {
        add: 42,
        ttl: 1,
    });
    t.is(t.context.data.length, 20);
    t.context.data.forEach((data, i) => {
        t.true(data.position.constructor.name === "Position");
        t.is(data.position.x, 100);
        t.is(data.position.y, 200);
        t.is(data.i, i);
        t.is(data.add, 42);
        t.is(data.ttl, 1);
        t.is(data.called, undefined);
    });

    const ctx = {
        addPath: () => t.pass(),
    };
    t.context.trace(ctx);
    t.context.data.forEach((data, i) => {
        t.is(data.called, i);
        t.is(data.ttl, 0);
    });

    t.context.trace(ctx);
    t.is(t.context.data.length, 0);
});

test("trace and generate", (t) => {
    const args = ["a", "b"];
    t.context.options.emit = 11;
    t.context.options.args = args;

    let expected = 0;
    t.context.generator = (index, ...passed) => {
        t.is(index, expected++);
        t.deepEqual(passed, args);
    };

    const ctx = {
        addPath: () => t.pass(),
    };
    t.context.trace(ctx);
    t.is(t.context.data.length, 11);
});

test("isHover", (t) => {
    t.false(t.context.isHover(t.context.position));
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.truthy(json.base);
    t.is(json.data.length, 0);
});

test.todo("from");

test("defaultOptions and defaultData", (t) => {
    const { defaultOptions, defaultData } = Particles;

    t.is(defaultOptions.frequency, 1);
    t.is(defaultOptions.emit, null);
    t.true(defaultOptions.args.length === 0);

    t.true(defaultData.position.constructor.name === "Position");
    t.is(defaultData.position.x, 0);
    t.is(defaultData.position.y, 0);
});
