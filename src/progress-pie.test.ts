import { test, expect, beforeEach } from "vitest";


let context: any;
import ProgressPie from "./progress-pie.js";

beforeEach(() => {
    context = new ProgressPie([0, 0], {
        value: 0.8,
        radius: 300,
    });
});

test("render", () => {
    const ctx = window.document.createElement("canvas").getContext("2d")!;
    expect(() => context.render(ctx)).not.toThrow();
});

test("get and set radius", () => {
    expect(context.radius).toBe(300);

    context.radius = 666;
    expect(context.radius).toBe(666);
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
    const options = ProgressPie.defaultOptions;
    expect(options.value).toBe(0);
    expect(options.radius).toBe(100);
    expect(options.speed).toBe(0.3);
});
