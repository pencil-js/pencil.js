import { test, expect, beforeEach } from "vitest";
import pathRecorder from "../test/_path-recorder.js";
import Circle from "./circle.js";
import Particles from "./particles.js";
import Position from "./position.js";
import Square from "./square.js";
import { from, register } from "./serialization.js";

let context: Particles;

beforeEach(() => {
    context = new Particles([10, 20], new Circle(undefined, 5, {
        fill: "red",
    }), (i, additional) => ({
        position: [100, 200],
        i,
        ...(additional as object),
    }), (data, i) => {
        data.called = i;
    });
});

test("constructor", () => {
    expect(context.base).toBeInstanceOf(Circle);
    expect(context.data.length).toBe(0);
    // Inherit base options
    expect(context.options.fill).toBe("red");
});

test("generate, update and trace", () => {
    context.generate(20, {
        add: 42,
        ttl: 2,
    });
    expect(context.data.length).toBe(20);
    context.data.forEach((data, i) => {
        expect(data.position).toBeInstanceOf(Position);
        expect(data.position.x).toBe(100);
        expect(data.position.y).toBe(200);
        expect(data.i).toBe(i);
        expect(data.add).toBe(42);
        expect(data.ttl).toBe(2);
        expect(data.called).toBe(undefined);
    });

    const path = pathRecorder();
    context.trace(path);
    expect(path.calls.length).toBe(20);
    // Trace doesn't update
    expect(context.data[0].called).toBe(undefined);

    context.update();
    context.data.forEach((data, i) => {
        expect(data.called).toBe(i);
        expect(data.ttl).toBe(1);
    });

    context.update();
    expect(context.data.length).toBe(0);
});

test("transformations", () => {
    context.base = new Square(undefined, 10, {
        origin: [-5, -5],
    });
    context.generate(1);
    context.data[0].rotation = 0.25;
    context.data[0].scale = 2;
    const path = pathRecorder();
    context.trace(path);
    const matrix = path.calls[0][2] as DOMMatrix;
    expect(matrix.a).toBeCloseTo(0);
    expect(matrix.b).toBeCloseTo(2);
    // Origin is rotated and scaled
    expect(matrix.e).toBeCloseTo(110);
    expect(matrix.f).toBeCloseTo(190);
});

test("update and generate", () => {
    const args = ["a", "b"];
    context.options.emit = 11;
    context.options.args = args;

    let expected = 0;
    context.generator = (index, ...passed) => {
        expect(index).toBe(expected++);
        expect(passed).toEqual(args);
        return {};
    };

    context.update();
    expect(context.data.length).toBe(11);
});

test("render", () => {
    const ctx = window.document.createElement("canvas").getContext("2d")!;
    context.generate(3);
    context.render(ctx);
    expect(context.data[2].called).toBe(2);
});

test("isHover", () => {
    expect(context.isHover()).toBe(false);
});

test("toJSON and from", () => {
    context.generate(2);
    const json = JSON.parse(JSON.stringify(context));

    expect(json.base.constructor).toBe("Circle");
    expect(json.data.length).toBe(2);
    expect(json.data[0].position).toEqual([100, 200]);

    register(Circle, Particles);
    const copy = from<Particles>(json);
    expect(copy).toBeInstanceOf(Particles);
    expect(copy.base).toBeInstanceOf(Circle);
    expect(copy.data[1].position.equals([100, 200])).toBe(true);
});

test("defaultOptions and defaultData", () => {
    const { defaultOptions, defaultData } = Particles;

    expect(defaultOptions.frequency).toBe(1);
    expect(defaultOptions.emit).toBe(null);
    expect(defaultOptions.args.length === 0).toBe(true);

    expect(defaultData.position).toBeInstanceOf(Position);
    expect(defaultData.position.x).toBe(0);
    expect(defaultData.position.y).toBe(0);
});
