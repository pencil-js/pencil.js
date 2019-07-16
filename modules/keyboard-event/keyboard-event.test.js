import test from "ava";
import KeyboardEvent from ".";

test("constructor", (t) => {
    const target = null;
    const name = "TestEvent";
    const key = "shift";
    const fakeEvent = new KeyboardEvent(name, target, key);

    t.is(fakeEvent.target, null);
    t.is(fakeEvent.name, name);
    t.is(fakeEvent.key, key);
});

test("events", (t) => {
    t.is(typeof KeyboardEvent.events.down, "string");
    t.is(typeof KeyboardEvent.events.up, "string");
});

test("keys", (t) => {
    t.not(KeyboardEvent.keys, undefined);
});
