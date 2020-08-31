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

    t.context.removeListener("three", callback);
    t.context.fire({
        name: "three",
    });

    // Wrong callback
    t.context.removeListener(["four"], () => {});
    t.is(t.context.eventListeners.four.length, 2);

    t.context.removeListener(["four"], callback);
    t.context.fire({
        name: "four",
    });
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
