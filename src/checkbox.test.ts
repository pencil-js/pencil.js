import { test, expect, beforeEach } from "vitest";


let context: any;
import Checkbox from "./checkbox.js";

beforeEach(() => {
    context = new Checkbox([100, 100]);
});

test("constructor", () => {
    expect(!!context.fill.options.shown).toBe(!!context.options.value);
});

test("get and set width and height", () => {
    expect(context.width).toBe(20);
    expect(context.height).toBe(20);

    context.width = 30;
    expect(context.width).toBe(30);
    expect(context.height).toBe(30);

    context.height = 40;
    expect(context.width).toBe(40);
    expect(context.height).toBe(40);
});

test("click and toggle", () => {
    context.value = true;
    context.click();
    expect(context.value).toBe(false);
    context.click();
    expect(context.value).toBe(true);

    context.toggle();
    expect(context.value).toBe(false);
    context.toggle();
    expect(context.value).toBe(true);

    context.toggle(true);
    expect(context.value).toBe(true);
    context.toggle(false);
    expect(context.value).toBe(false);
});

test("get and set value", () => {
    expect(context.value).toBe(!!context.fill.options.shown);
    context.value = true;
    expect(context.fill.options.shown).toBe(true);
    context.value = false;
    expect(context.fill.options.shown).toBe(false);
});

test("defaultOptions", () => {
    const options = Checkbox.defaultOptions;
    expect(options.size).toBe(20);
});

test("MARGIN", () => {
    expect(Checkbox.MARGIN).toBe(0.2);
});
