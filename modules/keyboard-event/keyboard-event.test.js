/* global test expect */

import KeyboardEvent from "./keyboard-event";

test("KeyboardEvent creation", () => {
    const target = null;
    const name = "TestEvent";
    const key = "shift";
    const fakeEvent = new KeyboardEvent(target, name, key);

    expect(fakeEvent.target).toBe(null);
    expect(fakeEvent.name).toBe(name);
    expect(fakeEvent.key).toBe(key);
});

test("KeyboardEvent statics", () => {
    expect(KeyboardEvent.events.down).toBe("keydown");
    expect(KeyboardEvent.events.up).toBe("keyup");

    expect(KeyboardEvent.keys).toBeDefined();
});
