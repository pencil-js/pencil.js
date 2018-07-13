/* global describe test expect */

import MouseEvent from "./mouse-event";

describe("MouseEvent", () => {
    test("creation", () => {
        const target = null;
        const name = "TestEvent";
        const fakeEvent = new MouseEvent(target, name, [120, 42]);

        expect(fakeEvent.target).toBe(target);
        expect(fakeEvent.name).toBe(name);
        expect(fakeEvent.position.x).toBe(120);
        expect(fakeEvent.position.y).toBe(42);
    });

    describe("statics", () => {
        test("events", () => {
            expect(MouseEvent.events.down).toBe("mousedown");
            expect(MouseEvent.events.up).toBe("mouseup");
            expect(MouseEvent.events.click).toBe("click");
            expect(MouseEvent.events.move).toBe("mousemove");
            expect(MouseEvent.events.hover).toBe("hover");
            expect(MouseEvent.events.leave).toBe("leave");
            expect(MouseEvent.events.wheel).toBe("mousewheel");
            expect(MouseEvent.events.scrollDown).toBe("scrolldown");
            expect(MouseEvent.events.scrollUp).toBe("scrollup");
            expect(MouseEvent.events.zoomOut).toBe("zoomout");
            expect(MouseEvent.events.zoomIn).toBe("zoomin");
            expect(MouseEvent.events.grab).toBe("grab");
            expect(MouseEvent.events.drag).toBe("drag");
            expect(MouseEvent.events.drop).toBe("drop");
            expect(MouseEvent.events.resize).toBe("resize");
        });
    });
});
