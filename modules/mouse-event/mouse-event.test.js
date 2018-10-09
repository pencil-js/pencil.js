import test from "ava";
import MouseEvent from "./mouse-event";

test("constructor", (t) => {
    const target = null;
    const name = "TestEvent";
    const fakeEvent = new MouseEvent(name, target, [120, 42]);

    t.is(fakeEvent.target, target);
    t.is(fakeEvent.name, name);
    t.is(fakeEvent.position.x, 120);
    t.is(fakeEvent.position.y, 42);
});

test("events", (t) => {
    t.is(typeof MouseEvent.events.down, "string");
    t.is(typeof MouseEvent.events.up, "string");
    t.is(typeof MouseEvent.events.click, "string");
    t.is(typeof MouseEvent.events.move, "string");
    t.is(typeof MouseEvent.events.hover, "string");
    t.is(typeof MouseEvent.events.leave, "string");
    t.is(typeof MouseEvent.events.wheel, "string");
    t.is(typeof MouseEvent.events.scrollDown, "string");
    t.is(typeof MouseEvent.events.scrollUp, "string");
    t.is(typeof MouseEvent.events.zoomOut, "string");
    t.is(typeof MouseEvent.events.zoomIn, "string");
    t.is(typeof MouseEvent.events.grab, "string");
    t.is(typeof MouseEvent.events.drag, "string");
    t.is(typeof MouseEvent.events.drop, "string");
    t.is(typeof MouseEvent.events.resize, "string");
});
