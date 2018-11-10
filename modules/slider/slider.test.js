import test from "ava";
import Slider from "./slider";

test.beforeEach((t) => {
    t.context = new Slider([0, 0], {
        value: 8,
        min: 1,
        max: 100,
    });
});

test.todo("constructor");

test.todo("click");

test.todo("get and set width");

test.todo("get and set value");

test.todo("defaultOptions");

test.todo("HEIGHT");
