import test from "ava";
import Input from ".";
import MouseEvent from "../mouse-event";
import Rectangle from "../rectangle";

test.beforeEach((t) => {
    t.context = new Input([100, 100], Rectangle);
});

test("constructor", (t) => {
    t.is(t.context.base, Rectangle);
});

test("events listeners", (t) => {
    const { fill, hover } = Input.defaultOptions;
    t.is(t.context.options.fill, fill);

    t.context.fire(new MouseEvent(MouseEvent.events.hover, t.context));
    t.is(t.context.options.fill, hover);

    t.context.fire(new MouseEvent(MouseEvent.events.leave, t.context));
    t.is(t.context.options.fill, fill);

    t.context.click = () => t.pass();
    t.plan(4);
    t.context.fire(new MouseEvent(MouseEvent.events.click, t.context));
});

test("get and set value", (t) => {
    t.throws(() => t.context.value, {
        instanceOf: ReferenceError,
    });
    t.throws(() => t.context.value = 42, {
        instanceOf: ReferenceError,
    });
});

test("click", (t) => {
    t.context.click();
    t.pass();
});

test("isHover", (t) => {
    const ctx = new window.CanvasRenderingContext2D();
    ctx.isPointInPath = () => true;
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
    t.is(options.foreground, "#444");
    t.is(options.fill, "#f6f6f6");
    t.is(options.stroke, "#aaa");
    t.is(options.hover, "#dcdcdc");
});

test("events", (t) => {
    t.is(Input.events.change, "change");
});
