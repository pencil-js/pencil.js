import test from "ava";
import Input from "./input";

test.beforeEach((t) => {
    t.context = new Input([100, 100]);
});

test("constructor", (t) => {
    t.not(t.context.background, undefined);
});

test("get and set value", (t) => {
    t.throws(() => t.context.value, ReferenceError, "unimplemented get");
    t.throws(() => t.context.value = 42, ReferenceError, "unimplemented set");
});

test("click", (t) => {
    t.context.click();
    t.pass("without error");
});

test.todo("isHover");

test("toJSON", (t) => {
    Object.defineProperty(Input.prototype, "value", {
        get: () => 42,
    });
    const json = t.context.toJSON();

    t.is(json.options.value, t.context.value);
    t.is(json.children.length, 0);
    t.is(json.constructor, "Input");
});

test.todo("from");

test("defaultOptions", (t) => {
    const options = Input.defaultOptions;
    t.is(options.value, null);
    t.is(options.fill, "#444");
    t.is(options.background, "#f6f6f6");
    t.is(options.border, "#aaa");
    t.is(options.hover, "#dcdcdc");
});

test("events", (t) => {
    t.is(Input.events.change, "change");
});
