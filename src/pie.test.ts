import { test, expect, beforeEach } from "vitest";


let context: any;
import Pie from "./pie.js";

beforeEach(() => {
    context = new Pie([0, 0], 99, 0.1, 0.9);
});

test("constructor", () => {
    expect(context.radius).toBe(99);
});

test("toJSON", () => {
    const json = context.toJSON();

    expect(json.radius).toBe(99);
    expect(json.width).toBe(undefined);
    expect(json.height).toBe(undefined);
    expect(json.constructor).toBe("Pie");
});
