import { test, expect } from "vitest";
import Rectangle from "./rectangle.js";
import Square from "./square.js";
import "./resizable.js";

test("resizable", () => {
    expect(typeof Rectangle.prototype.resizable).toBe("function");
    expect(Rectangle.prototype.resizable.name).toBe("resizable");
    const rectangle = new Rectangle([0, 0]);
    rectangle.resizable();
});

test("resizable throws", () => {
    expect(() => {
        const rect = new Rectangle([0, 0], 10, 20, {
            rotation: 0.3,
        });
        rect.resizable();
    }).toThrow();
    expect(() => {
        const rect = new Rectangle([0, 0], 10, 20, {
            origin: [2, 3],
        });
        rect.resizable();
    }).toThrow();
    expect(() => {
        const square = new Square([0, 0], 10);
        square.resizable({
            x: false,
        });
    }).toThrow();
});
