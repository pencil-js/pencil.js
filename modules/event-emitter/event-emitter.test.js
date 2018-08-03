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

test("fire targeted", (t) => {
    t.context.on("event", () => t.fail(), true);

    t.context.fire({
        name: "event",
    });
    t.pass();
});

test("clone", (t) => {
    t.throws(() => t.context.clone(), ReferenceError);
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.is(json.constructor, "EventEmitter");
});

test("from", (t) => {
    t.throws(() => EventEmitter.from(), ReferenceError);
});
