import { test, expect } from "vitest";
import MouseEvent from "./mouse-event.js";

test("constructor", () => {
    const target = null;
    const name = "TestEvent";
    const position = [120, 42];
    const event = {
        button: 1,
    };
    const fakeEvent = new MouseEvent(name, target, position, event as unknown as Event);

    expect(fakeEvent.target).toBe(target);
    expect(fakeEvent.name).toBe(name);
    expect(fakeEvent.position.x).toBe(120);
    expect(fakeEvent.position.y).toBe(42);
    // Buttons are strings to match MouseEvent.buttons values
    expect(fakeEvent.button).toBe("1");
    expect(fakeEvent.getModifier()).toBe(MouseEvent.buttons.middle);
});

test("buttons", () => {
    Object.keys(MouseEvent.buttons).forEach((key) => {
        expect(typeof MouseEvent.buttons[key]).toBe("string");
    });
});

test("events", () => {
    expect(typeof MouseEvent.events.down).toBe("string");
    expect(typeof MouseEvent.events.up).toBe("string");
    expect(typeof MouseEvent.events.click).toBe("string");
    expect(typeof MouseEvent.events.move).toBe("string");
    expect(typeof MouseEvent.events.hover).toBe("string");
    expect(typeof MouseEvent.events.leave).toBe("string");
    expect(typeof MouseEvent.events.wheel).toBe("string");
    expect(typeof MouseEvent.events.scrollDown).toBe("string");
    expect(typeof MouseEvent.events.scrollUp).toBe("string");
    expect(typeof MouseEvent.events.zoomOut).toBe("string");
    expect(typeof MouseEvent.events.zoomIn).toBe("string");
    expect(typeof MouseEvent.events.grab).toBe("string");
    expect(typeof MouseEvent.events.drag).toBe("string");
    expect(typeof MouseEvent.events.drop).toBe("string");
    expect(typeof MouseEvent.events.resize).toBe("string");
    expect(typeof MouseEvent.events.doubleClick).toBe("string");
});
