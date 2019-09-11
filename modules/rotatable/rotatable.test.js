import test from "ava";
import Component from "../component";
import ".";
import Rectangle from "../rectangle";

test("rotatable", (t) => {
    t.is(typeof Component.prototype.rotatable, "function");
    t.is(Component.prototype.rotatable.name, "rotatable");

    const rectangle = new Rectangle([0, 0]);
    rectangle.rotatable();

    t.throws(() => rectangle.draggable());
});
