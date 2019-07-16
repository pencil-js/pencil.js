import test from "ava";
import Input from ".";
import MouseEvent from "../mouse-event";

test.beforeEach((t) => {
    t.context = new Input([100, 100]);
});

test("constructor", (t) => {
    t.truthy(t.context.background);
});

test("events listeners", (t) => {
    const { background } = t.context;
    t.is(background.options.fill, t.context.options.background);

    background.fire(new MouseEvent(MouseEvent.events.hover, background));
    t.is(background.options.fill, t.context.options.hover);

    background.fire(new MouseEvent(MouseEvent.events.leave, background));
    t.is(background.options.fill, t.context.options.background);

    t.context.click = () => t.pass();
    t.plan(4);
    background.fire(new MouseEvent(MouseEvent.events.click, background));
});

test("get and set value", (t) => {
    t.throws(() => t.context.value, ReferenceError);
    t.throws(() => t.context.value = 42, ReferenceError);
});

test("click", (t) => {
    t.context.click();
    t.pass();
});

test("isHover", (t) => {
    const ctx = {
        isPointInPath: () => true,
    };
    t.true(t.context.isHover([0, 0], ctx));

    t.context.options.shown = false;
    t.false(t.context.isHover([0, 0], ctx));
});

test("toJSON", (t) => {
    Object.defineProperty(Input.prototype, "value", {
        get: () => 42,
    });
    const json = t.context.toJSON();

    t.is(json.options.value, t.context.value);
    t.is(json.children.length, 0);
    t.is(json.constructor, "Input");
});

test("from", (t) => {
    const definition = {
        position: [1, 2],
        options: {},
    };
    const input = Input.from(definition);

    t.true(input instanceof Input);
});

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
