import test from "ava";
import Component from "@pencil.js/component";
import Rectangle from "@pencil.js/rectangle";
import "@pencil.js/draggable";
import "./rotatable.js";

test("rotatable", (t) => {
    t.is(typeof Component.prototype.rotatable, "function");
    t.is(Component.prototype.rotatable.name, "rotatable");

    const rectangle = new Rectangle();
    const api = rectangle.rotatable();
    api.stop();

    t.throws(() => {
        const element = new Rectangle();
        element.draggable();
        element.rotatable();
    }, {
        message: "Component can't be both draggable and rotatable.",
    });
});
