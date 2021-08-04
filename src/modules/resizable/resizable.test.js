import test from "ava";
import Rectangle from "@pencil.js/rectangle";
import Square from "@pencil.js/square";
import "./resizable.js";

test("resizable", (t) => {
    t.is(typeof Rectangle.prototype.resizable, "function");
    t.is(Rectangle.prototype.resizable.name, "resizable");
    const rectangle = new Rectangle([0, 0]);
    rectangle.resizable();
});

test("resizable throws", (t) => {
    t.throws(() => {
        const rect = new Rectangle([0, 0], 10, 20, {
            rotation: 0.3,
        });
        rect.resizable();
    });
    t.throws(() => {
        const rect = new Rectangle([0, 0], 10, 20, {
            origin: [2, 3],
        });
        rect.resizable();
    });
    t.throws(() => {
        const square = new Square([0, 0], 10);
        square.resizable({
            x: false,
        });
    });
});
