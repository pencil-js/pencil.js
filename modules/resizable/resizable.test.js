import test from "ava";
import Rectangle from "@pencil.js/rectangle";
import "./resizable";

test("resizable", (t) => {
    t.is(typeof Rectangle.prototype.resizable, "function");
    t.is(Rectangle.prototype.resizable.name, "resizable");
    const rectangle = new Rectangle([0, 0]);
    rectangle.resizable();
});
