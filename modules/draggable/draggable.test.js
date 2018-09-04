import test from "ava";
import Component from "@pencil.js/component";
import "./draggable";
import Rectangle from "../rectangle";

test("draggable", (t) => {
    t.is(typeof Component.prototype.draggable, "function");
    t.is(Component.prototype.draggable.name, "draggable");
    const rectangle = new Rectangle([0, 0]);
    rectangle.draggable();
});
