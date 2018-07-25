import test from "ava";
import KeyboardEvent from "./keyboard-event";

test("constructor", (t) => {
    const target = null;
    const name = "TestEvent";
    const key = "shift";
    const fakeEvent = new KeyboardEvent(target, name, key);

    t.is(fakeEvent.target, null);
    t.is(fakeEvent.name, name);
    t.is(fakeEvent.key, key);
});

test("events", (t) => {
    t.is(KeyboardEvent.events.down, "keydown");
    t.is(KeyboardEvent.events.up, "keyup");
});

test("keys", (t) => {
    t.not(KeyboardEvent.keys, undefined);
});
