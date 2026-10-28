import { test, expect, beforeEach } from "vitest";
import pathRecorder from "../test/_path-recorder.js";


let context: any;
import Heart from "./heart.js";

beforeEach(() => {
    context = new Heart([100, 100], 2);
});

test("constructor", () => {
    expect(context.radius).toBe(2);
    expect(context.position.x).toBe(100);
    expect(context.position.y).toBe(100);
});

test("trace", () => {
    const path = pathRecorder();
    context.trace(path);
    expect(path.calls.map(([name]) => name)).toEqual(["moveTo", "bezierCurveTo", "bezierCurveTo", "bezierCurveTo", "bezierCurveTo", "closePath"]);
    expect(path.calls[0]).toEqual(["moveTo", 0, -0.8]);
});

test("toJSON", () => {
    const json = context.toJSON();

    expect(json.radius).toBe(2);
    expect(json.constructor).toBe("Heart");
});

test("from", () => {
    const definition = {
        position: {
            x: 0,
            y: 0,
        },
        radius: 100,
    };
    const heart = Heart.from(definition);

    expect(heart instanceof Heart).toBe(true);
    expect(heart.radius).toBe(100);
    expect(heart.position.x).toBe(0);
    expect(heart.position.y).toBe(0);
});
