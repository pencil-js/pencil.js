import test from "ava";
import BaseEvent from ".";

test.beforeEach((t) => {
    t.context = new BaseEvent("name", null);
});

test("constructor", (t) => {
    t.is(t.context.target, null);
    t.is(t.context.name, "name");
    t.is(t.context.bubble, true);
});

test("stop", (t) => {
    t.context.stop();
    t.is(t.context.bubble, false);
});
