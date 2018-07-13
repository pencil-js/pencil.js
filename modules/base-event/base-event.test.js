/* global describe test expect */

import BaseEvent from "./base-event";

describe("BaseEvent", () => {
    test("creation", () => {
        const target = null;
        const name = "TestEvent";
        const fakeEvent = new BaseEvent(target, name);

        expect(fakeEvent.target).toBe(null);
        expect(fakeEvent.name).toBe(name);
    });
});
