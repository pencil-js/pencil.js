import test from "ava";
import BaseEvent from "./base-event";

test("constructor", (t) => {
    const target = null;
    const name = "TestEvent";
    const fakeEvent = new BaseEvent(target, name);

    t.is(fakeEvent.target, null);
    t.is(fakeEvent.name, name);
});
