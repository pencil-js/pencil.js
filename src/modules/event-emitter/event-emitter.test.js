import test from "ava";
import EventEmitter from ".";

test.beforeEach((t) => {
    t.context = new EventEmitter();
});

test("constructor", (t) => {
    t.deepEqual(t.context.eventListeners, {});
});

test("on and fire", (t) => {
    t.context.on("pass", () => t.pass())
        .on("pass", () => t.pass())
        .on("fail", () => t.fail());

    t.plan(3);
    t.is(Object.keys(t.context.eventListeners).length, 2);

    t.context.fire({
        name: "unknown",
    }).fire({
        name: "pass",
    });
});

test("on with array of event", (t) => {
    t.context.on([
        "pass1",
        "pass2",
        "fail",
    ], () => t.pass());

    t.plan(3);
    t.is(Object.keys(t.context.eventListeners).length, 3);
    t.context.fire({
        name: "pass1",
    }).fire({
        name: "pass2",
    });
});

test("on with modifier", (t) => {
    t.context
        .on("pass.ok", () => t.pass())
        .on("pass", () => t.pass())
        .on("pass.fail", () => t.fail());

    t.plan(3);

    t.context.fire({
        name: "pass",
        getModifier () {
            return "ok";
        },
    }).fire({
        name: "pass",
        getModifier () {
            return "other";
        },
    });
});

test("fire targeted", (t) => {
    t.context.on("event", () => t.fail(), true);

    t.context.fire({
        name: "event",
    });
    t.pass();
});

test("removeListener", (t) => {
    const callback = () => t.fail();
    t.context.on(["one", "two", "three", "four", "five"], callback);
    t.context.on(["three", "four", "five"], () => {});

    t.context.fire({
        name: "unknown",
    });
    t.is(Object.keys(t.context.eventListeners).length, 5);

    t.context.removeListener("one");
    t.context.fire({
        name: "one",
    });

    t.context.removeListener("unknown");

    t.context.removeListener(["two", "unknown"]);
    t.context.fire({
        name: "two",
    });

    // Wrong callback
    t.context.removeListener("three", () => {});
    t.is(t.context.eventListeners.three.length, 2);

    // Wrong callback
    t.context.removeListener(["four"], () => {});
    t.is(t.context.eventListeners.four.length, 2);

    t.context.removeListener(["three", "four"], callback);
    t.context.fire({
        name: "three",
    }).fire({
        name: "four",
    });
});

test("removeListener with modifiers", (t) => {
    const callback = () => {};
    t.context
        .on("one", callback)
        .on("one.a", callback)
        .on("one.b", callback);
    t.is(t.context.eventListeners.one.length, 3);
    t.context.removeListener("one");
    t.is(t.context.eventListeners.one, undefined);

    t.context
        .on("two", callback)
        .on("two.mod", callback);
    t.is(t.context.eventListeners.two.length, 2);
    t.context.removeListener("two.mod");
    t.is(t.context.eventListeners.two.length, 1);

    t.context
        .on("three", callback)
        .on("three.mod", callback)
        .on("three", () => {})
        .on("three.mod", () => {});
    t.is(t.context.eventListeners.three.length, 4);
    t.context.removeListener("three", callback);
    t.is(t.context.eventListeners.three.length, 2);

    t.context
        .on("four", callback)
        .on("four.mod", callback)
        .on("four", () => {})
        .on("four.mod", () => {});
    t.is(t.context.eventListeners.four.length, 4);
    t.context.removeListener("four.mod", callback);
    t.is(t.context.eventListeners.four.length, 3);
});

test("removeAllListener", (t) => {
    t.context.on(["one", "two", "three"], () => {});

    t.is(Object.keys(t.context.eventListeners).length, 3);

    t.context.removeAllListener();
    t.is(Object.keys(t.context.eventListeners).length, 0);
});

test("events", (t) => {
    t.is(Object.keys(EventEmitter.events).length, 0);
});
