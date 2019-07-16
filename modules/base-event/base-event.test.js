import test from "ava";
import BaseEvent from ".";

test("constructor", (t) => {
    const target = null;
    const name = "TestEvent";
    const fakeEvent = new BaseEvent(name, target);

    t.is(fakeEvent.target, null);
    t.is(fakeEvent.name, name);
});
