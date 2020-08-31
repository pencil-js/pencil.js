import test from "ava";
import Rectangle from "../rectangle";
import Square from "../square";
import "./resizable";

test("resizable", (t) => {
    t.is(typeof Rectangle.prototype.resizable, "function");
    t.is(Rectangle.prototype.resizable.name, "resizable");
    const rectangle = new Rectangle([0, 0]);
    rectangle.resizable();
});

test("resizable square without x and y axis", (t) => {
    t.throws(() => {
        const square = new Square([0, 0], 10);
        square.resizable({
            x: false,
        });
    });
});
