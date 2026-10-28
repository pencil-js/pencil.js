import { test, expect } from "vitest";
import KeyboardEvent from "./keyboard-event.js";

test("constructor", () => {
    const target = null;
    const name = "TestEvent";
    const event = {
        key: "Shift",
    };
    const fakeEvent = new KeyboardEvent(name, target, event);

    expect(fakeEvent.target).toBe(null);
    expect(fakeEvent.name).toBe(name);
    expect(fakeEvent.key).toBe(event.key);
    expect(fakeEvent.getModifier()).toBe(event.key);
});

test("events", () => {
    expect(typeof KeyboardEvent.events.down).toBe("string");
    expect(typeof KeyboardEvent.events.up).toBe("string");
});

test("keys", () => {
    expect(KeyboardEvent.keys).not.toBe(undefined);
});
