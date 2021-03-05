import test from "ava";
import KeyboardEvent from ".";

test("constructor", (t) => {
    const target = null;
    const name = "TestEvent";
    const event = {
        key: "Shift",
    };
    const fakeEvent = new KeyboardEvent(name, target, event);

    t.is(fakeEvent.target, null);
    t.is(fakeEvent.name, name);
    t.is(fakeEvent.key, event.key);
    t.is(fakeEvent.getModifier(), event.key);
});

test("events", (t) => {
    t.is(typeof KeyboardEvent.events.down, "string");
    t.is(typeof KeyboardEvent.events.up, "string");
});

test("keys", (t) => {
    t.not(KeyboardEvent.keys, undefined);
});
