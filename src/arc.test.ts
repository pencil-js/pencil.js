import { test, expect, beforeEach } from "vitest";


let context: any;
import Arc from "./arc.js";

beforeEach(() => {
    context = new Arc([100, 50], 20, 40, 0.1, 0.6);
});

test("constructor", () => {
    expect(context.width).toBe(20);
    expect(context.height).toBe(40);
    expect(context.startAngle).toBe(0.1);
    expect(context.endAngle).toBe(0.6);

    const defaultArc = new Arc();
    expect(defaultArc.width).toBe(0);
    expect(defaultArc.height).toBe(0);
    expect(defaultArc.startAngle).toBe(0);
    expect(defaultArc.endAngle).toBe(0.5);
});

test("trace", () => {
    const path = {
        ellipse: (...params) => {
            const PI2 = Math.PI * 2;
            expect(params).toEqual([0, 0, 20, 40, 0, (0.1 - 0.25) * PI2, (0.6 - 0.25) * PI2]);
        },
    };
    expect.assertions(1);
    context.trace(path);
});

test("toJSON", () => {
    const json = context.toJSON();

    expect(json.width).toBe(20);
    expect(json.height).toBe(40);
    expect(json.startAngle).toBe(0.1);
    expect(json.endAngle).toBe(0.6);
    expect(json.constructor).toBe("Arc");
});

test("from", () => {
    const definition = {
        width: 10,
        height: 20,
        startAngle: 0.1,
        endAngle: 0.9,
    };
    const arc = Arc.from(definition);

    expect(arc.width).toBe(10);
    expect(arc.height).toBe(20);
    expect(arc.startAngle).toBe(0.1);
    expect(arc.endAngle).toBe(0.9);
});

test("defaultOptions", () => {
    expect(Arc.defaultOptions.cap).toBe(Arc.caps.round);
    expect(Arc.defaultOptions.fill).toBe(null);
});

test("caps", () => {
    expect(Arc.caps.butt).toBe("butt");
    expect(Arc.caps.round).toBe("round");
    expect(Arc.caps.square).toBe("square");
});
