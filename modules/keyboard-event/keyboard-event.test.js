/* global describe test expect */

import KeyboardEvent from "./keyboard-event";

describe("KeyboardEvent", () => {
    test("creation", () => {
        const target = null;
        const name = "TestEvent";
        const key = "shift";
        const fakeEvent = new KeyboardEvent(target, name, key);

        expect(fakeEvent.target).toBe(null);
        expect(fakeEvent.name).toBe(name);
        expect(fakeEvent.key).toBe(key);
    });

    describe("statics", () => {
        test("events", () => {
            expect(KeyboardEvent.events.down).toBe("keydown");
            expect(KeyboardEvent.events.up).toBe("keyup");
        });

        test("keys", () => {
            expect(KeyboardEvent.keys).toBeDefined();
        });
    });
});
