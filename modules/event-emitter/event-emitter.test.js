import test from "ava";
import EventEmitter from "./event-emitter";

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

test("events", (t) => {
    t.is(Object.keys(EventEmitter.events).length, 0);
});
