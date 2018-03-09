/* global test expect */

import Position from "@pencil.js/position";
import Square from "./square";

test("Square creation and trace", () => {
    const s = 123.4;
    const rect = new Square(new Position(-20, 20), s);

    expect(rect.width).toBe(s);
    expect(rect.height).toBe(s);
});

test("Square get and set size", () => {
    let s = 42.1;
    const rect = new Square(new Position(22, -10), s);

    expect(rect.size).toBe(s);

    s = 99.9;
    rect.size = s;
    expect(rect.size).toBe(s);
});
