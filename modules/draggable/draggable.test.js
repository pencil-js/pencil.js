import test from "ava";
import Component from "../component";
import ".";
import Rectangle from "../rectangle";

test("draggable", (t) => {
    t.is(typeof Component.prototype.draggable, "function");
    t.is(Component.prototype.draggable.name, "draggable");

    const rectangle = new Rectangle([0, 0]);
    rectangle.draggable({
        constrain: [
            [0, 0],
            [10, 20],
        ],
    });
});
