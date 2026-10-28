import { test, expect, beforeEach } from "vitest";


let context: any;
import ProgressBar from "./progress-bar.js";

beforeEach(() => {
    context = new ProgressBar([0, 0], {
        value: 0.8,
        width: 300,
    });
});

test("render", () => {
    const ctx = window.document.createElement("canvas").getContext("2d")!;
    expect(() => context.render(ctx)).not.toThrow();
});

test("get and set width", () => {
    expect(context.width).toBe(300);
    expect(context.height).toBe(20);

    context.width = 666;
    expect(context.width).toBe(666);

    expect(() => context.width = 1).toThrow();
});

test("get and set value", () => {
    context.fire({
        name: "attach",
        target: context,
    });
    expect(context.value).toBe(0.8);

    context.options.speed = 1;
    context.value = 0.5;
    expect(context.value).toBe(0.5);

    context.value = 2;
    expect(context.value).toBe(1);
});

test("defaultOptions", () => {
    const options = ProgressBar.defaultOptions;
    expect(options.value).toBe(0);
    expect(options.width).toBe(200);
    expect(options.speed).toBe(0.3);
});

test("HEIGHT", () => {
    expect(ProgressBar.HEIGHT).toBe(20);
});
