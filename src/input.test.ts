import { test, expect, beforeEach } from "vitest";


let context: any;
import MouseEvent from "./mouse-event.js";
import Rectangle from "./rectangle.js";
import Input from "./input.js";

class TestInput extends Input {
    #value = 0;

    get value () {
        return this.#value;
    }

    set value (value: number) {
        this.#value = value;
    }

    get width () {
        return 50;
    }

    get height () {
        return 20;
    }
}

beforeEach(() => {
    context = new TestInput([100, 100], Rectangle);
});

test("constructor", () => {
    expect(context.base).toBe(Rectangle);
});

test("events listeners", () => {
    const { fill, hover } = Input.defaultOptions;
    expect(context.options.fill).toBe(fill);

    context.fire(new MouseEvent(MouseEvent.events.hover, context));
    expect(context.options.fill).toBe(hover);

    context.fire(new MouseEvent(MouseEvent.events.leave, context));
    expect(context.options.fill).toBe(fill);

    context.click = () => expect(true).toBe(true);
    expect.assertions(4);
    context.fire(new MouseEvent(MouseEvent.events.click, context));
});

test("get and set value", () => {
    expect(context.value).toBe(0);
    context.value = 42;
    expect(context.value).toBe(42);
});

test("click", () => {
    let fired = false;
    context.on(Input.events.change, () => fired = true);
    context.click();
    expect(fired).toBe(true);
});

test("isHover", () => {
    const ctx = window.document.createElement("canvas").getContext("2d")!;
    expect(context.isHover([10, 10], ctx)).toBe(true);
    expect(context.isHover([60, 10], ctx)).toBe(false);

    context.options.shown = false;
    expect(context.isHover([0, 0], ctx)).toBe(false);
});

test("toJSON", () => {
    context.value = 42;
    const json = context.toJSON();

    expect(json.options.value).toBe(42);
    expect(json.constructor).toBe("TestInput");
});

test("from", () => {
    const definition = {
        position: [1, 2],
        options: {},
    };
    const input = TestInput.from(definition as any);

    expect(input instanceof TestInput).toBe(true);
});

test("defaultOptions", () => {
    const options = Input.defaultOptions;
    expect(options.value).toBe(null);
    expect(options.foreground).toBe("#444");
    expect(options.fill).toBe("#f6f6f6");
    expect(options.stroke).toBe("#aaa");
    expect(options.hover).toBe("#dcdcdc");
});

test("events", () => {
    expect(Input.events.change).toBe("change");
});
