/* global test expect */

import BaseEvent from "./baseevent";

test("BaseEvent creation", () => {
    const target = null;
    const name = "TestEvent";
    const fakeEvent = new BaseEvent(target, name);

    expect(fakeEvent.name).toBe(name);
});
