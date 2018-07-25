import test from "ava";
import MouseEvent from "./mouse-event";

test("constructor", (t) => {
    const target = null;
    const name = "TestEvent";
    const fakeEvent = new MouseEvent(target, name, [120, 42]);

    t.is(fakeEvent.target, target);
    t.is(fakeEvent.name, name);
    t.is(fakeEvent.position.x, 120);
    t.is(fakeEvent.position.y, 42);
});

test("events", (t) => {
    t.is(MouseEvent.events.down, "mousedown");
    t.is(MouseEvent.events.up, "mouseup");
    t.is(MouseEvent.events.click, "click");
    t.is(MouseEvent.events.move, "mousemove");
    t.is(MouseEvent.events.hover, "hover");
    t.is(MouseEvent.events.leave, "leave");
    t.is(MouseEvent.events.wheel, "mousewheel");
    t.is(MouseEvent.events.scrollDown, "scrolldown");
    t.is(MouseEvent.events.scrollUp, "scrollup");
    t.is(MouseEvent.events.zoomOut, "zoomout");
    t.is(MouseEvent.events.zoomIn, "zoomin");
    t.is(MouseEvent.events.grab, "grab");
    t.is(MouseEvent.events.drag, "drag");
    t.is(MouseEvent.events.drop, "drop");
    t.is(MouseEvent.events.resize, "resize");
});
