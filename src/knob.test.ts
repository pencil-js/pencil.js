import { test, expect, beforeEach } from "vitest";


let context: any;
import Knob from "./knob.js";
import almostEqual from "../test/_almost-equal.js";

beforeEach(() => {
    context = new Knob([0, 0], {
        value: 2,
    });
});

test("constructor", () => {
    expect(context.isRotatable).toBe(true);
    context.click(); // Should do nothing
});

test("get and set radius", () => {
    expect(context.radius).toBe(100);

    context.radius = 200;
    expect(context.radius).toBe(200);
});

test("get and set value", () => {
    context.value = 0.8;
    expect(almostEqual(context.value, 0.8)).toBe(true);
    expect(almostEqual(context.options.rotation, 0.8)).toBe(true);

    context.value = -1.5;
    expect(almostEqual(context.value, 0.5)).toBe(true);
    expect(almostEqual(context.options.rotation, 0.5)).toBe(true);

    context.value = 2.6;
    expect(almostEqual(context.value, 0.6)).toBe(true);
    expect(almostEqual(context.options.rotation, 0.6)).toBe(true);
});

test("default options and NOTCH_SIZE", () => {
    const { defaultOptions } = Knob;
    expect(defaultOptions.min).toBe(0);
    expect(defaultOptions.max).toBe(1);
    expect(defaultOptions.value).toBe(0);
    expect(defaultOptions.radius).toBe(100);

    expect(Knob.NOTCH_SIZE).toBe(0.09);
});
