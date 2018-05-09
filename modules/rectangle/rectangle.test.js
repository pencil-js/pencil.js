/* global test expect jest */

import Position from "@pencil.js/position";
import Rectangle from "./rectangle";

test("Rectangle creation and trace", () => {
    const w = 123;
    const h = 22.2;
    const rect = new Rectangle(new Position(-20, 20), w, h);

    expect(rect.width).toBe(w);
    expect(rect.height).toBe(h);

    const ctx = {
        rect: jest.fn(),
    };
    rect.trace(ctx);
    expect(ctx.rect.mock.calls.length).toBe(1);
    expect(ctx.rect.mock.calls[0]).toEqual([0, 0, w, h]);
});


test("Rectangle isHover", () => {
    const rect = new Rectangle(new Position(22, -10), 77, 13);

    expect(rect.isHover(new Position(55, -2))).toBe(true);
    expect(rect.isHover(new Position(99, 3))).toBe(true);
    expect(rect.isHover(new Position(10, 5))).toBe(false);
});
