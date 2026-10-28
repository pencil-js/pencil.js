import { test, expect, beforeEach } from "vitest";


let context: any;
import Ellipse from "./ellipse.js";

beforeEach(() => {
    context = new Ellipse([10, 20], 50, 100);
});

test("constructor", () => {
    expect(context.width).toBe(50);
    expect(context.height).toBe(100);
    expect(context.startAngle).toBe(0);
    expect(context.endAngle).toBe(1);
});

test("toJSON", () => {
    const json = context.toJSON();

    expect(json.width).toBe(50);
    expect(json.height).toBe(100);
    expect(json.startAngle).toBe(undefined);
    expect(json.endAngle).toBe(undefined);
    expect(json.constructor).toBe("Ellipse");
});

test("from", () => {
    const definition = {
        width: 10,
        height: 20,
    };
    const ellipse = Ellipse.from(definition);

    expect(ellipse.width).toBe(10);
    expect(ellipse.height).toBe(20);
});

test("defaultOptions", () => {
    expect(Ellipse.defaultOptions.fill).toBeTruthy();
    expect(Ellipse.defaultOptions.stroke).toBeFalsy();
});
