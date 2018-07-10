/* global test expect */

import BaseEvent from "./base-event";

test("BaseEvent creation", () => {
    const target = null;
    const name = "TestEvent";
    const fakeEvent = new BaseEvent(target, name);

    expect(fakeEvent.target).toBe(null);
    expect(fakeEvent.name).toBe(name);
});
