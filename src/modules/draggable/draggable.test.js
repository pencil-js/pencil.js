import test from "ava";
import Component from "@pencil.js/component";
import Rectangle from "@pencil.js/rectangle";
import "@pencil.js/rotatable";
import "./draggable.js";

test("draggable", (t) => {
    t.is(typeof Component.prototype.draggable, "function");
    t.is(Component.prototype.draggable.name, "draggable");

    const rectangle = new Rectangle();
    const api = rectangle.draggable({
        constrain: [
            [0, 0],
            [10, 20],
        ],
    });
    api.x = true;
    api.y = true;
    api.constrain = [[1, 2], [10, 20]];
    api.stop();

    t.throws(() => {
        const element = new Rectangle();
        element.rotatable();
        element.draggable();
    }, {
        message: "Component can't be both rotatable and draggable.",
    });
});
