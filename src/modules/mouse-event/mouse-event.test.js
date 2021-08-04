import test from "ava";
import MouseEvent from "./mouse-event.js";

test("constructor", (t) => {
    const target = null;
    const name = "TestEvent";
    const position = [120, 42];
    const event = {
        button: 1,
    };
    const fakeEvent = new MouseEvent(name, target, position, event);

    t.is(fakeEvent.target, target);
    t.is(fakeEvent.name, name);
    t.is(fakeEvent.position.x, 120);
    t.is(fakeEvent.position.y, 42);
    t.is(fakeEvent.button, event.button);
    t.is(fakeEvent.getModifier(), event.button);
});

test("buttons", (t) => {
    Object.keys(MouseEvent.buttons).forEach((key) => {
        t.is(typeof MouseEvent.buttons[key], "string");
    });
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
    t.is(typeof MouseEvent.events.doubleClick, "string");
});
