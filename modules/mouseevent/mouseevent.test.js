/* global test expect */

import Position from "@pencil.js/position";
import MouseEvent from "./mouseevent";

test("MouseEvent creation", () => {
    const target = null;
    const name = "TestEvent";
    const position = new Position(120, 42);
    const fakeEvent = new MouseEvent(target, name, position);

    expect(fakeEvent.name).toBe(name);
    expect(fakeEvent.position).toEqual(position);
});
