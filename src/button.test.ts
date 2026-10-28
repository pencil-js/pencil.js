import { test, expect, beforeEach } from "vitest";


let context: any;
import Button from "./button.js";

beforeEach(() => {
    context = new Button([100, 100], {
        value: ["multi\nline", "button text"],
    });
});

test("constructor", () => {
    // Force value on button
    context.value = context.options.value;

    expect(context.text.lines.length).toBe(3);
    const margin = context.options.fontSize * Button.MARGIN;
    expect(context.width).toBeCloseTo(context.text.width + (margin * 4));
    expect(context.height).toBeCloseTo(68);

    expect(context.text).not.toBe(undefined);
    ["font", "fontSize", "bold", "italic"].forEach((prop) => {
        expect(context.text.options[prop]).toBe(context.options[prop]);
    });
});

test("get and set value", () => {
    expect(context.value).toBe(context.text.text);

    context.value = "test";
    expect(context.text.text).toBe("test");
});

test("defaultOptions", () => {
    const options = Button.defaultOptions;
    expect(options.value).toBe("");
    ["font", "fontSize", "bold", "italic"].forEach((prop) => {
        expect(options[prop]).toBe(context.text.constructor.defaultOptions[prop]);
    });
});

test("MARGIN", () => {
    expect(Button.MARGIN).toBe(0.2);
});
