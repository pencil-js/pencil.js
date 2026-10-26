import { test, expect, beforeEach } from "vitest";


let context: any;
import Slider from "./slider.js";

beforeEach(() => {
    context = new Slider([0, 0], {
        value: 8,
        min: 10,
        max: 100,
        width: 300,
    });
});

test("constructor", () => {
    expect(context.handle).not.toBe(undefined);
});

test("click", () => {
    context.on(Slider.events.change, () => expect(true).toBe(true));
    expect.assertions(2);
    context.click({
        x: context.width / 2,
    });
    expect(context.value).toBe(55);
});

test("get and set width", () => {
    expect(context.width).toBe(300);

    context.width = 666;
    expect(context.width).toBe(666);

    expect(() => context.width = 1).toThrow();
});

test("get and set value", () => {
    context.value = 20;
    expect(context.value).toBe(20);

    context.value = 5;
    expect(context.value).toBe(10);

    context.value = 9999;
    expect(context.value).toBe(100);
});

test("defaultOptions", () => {
    const options = Slider.defaultOptions;
    expect(options.min).toBe(0);
    expect(options.max).toBe(1);
    expect(options.width).toBe(200);
});

test("HEIGHT", () => {
    expect(Slider.HEIGHT).toBe(20);
});
