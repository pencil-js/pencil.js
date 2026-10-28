import { test, expect, beforeEach } from "vitest";
import pathRecorder from "../test/_path-recorder.js";
import Position from "./position.js";
import Path, { Instruction } from "./path.js";

let context: Path;

const names = (calls: Array<[string, ...Array<unknown>]>) => calls.map(([name]) => name);

beforeEach(() => {
    context = new Path([10, 20], [
        Path.lineTo([100, 100]),
        Path.quarterTo([200, 200]),
    ], false);
});

test("constructor", () => {
    expect(context.instructions.length).toBe(2);
    expect(context.isClosed).toBe(false);
    // Not closed path use line options
    expect(context.options.fill).toBe(null);
    expect(context.options.stroke).toBe("#000");

    const closed = new Path([0, 0], []);
    expect(closed.isClosed).toBe(true);
    expect(closed.options.fill).toBe("#000");
});

test("trace closed", () => {
    context.isClosed = true;
    const path = pathRecorder();
    context.trace(path);
    expect(names(path.calls)).toEqual(["moveTo", "lineTo", "bezierCurveTo", "closePath"]);
    expect(path.calls[0]).toEqual(["moveTo", 0, 0]);
});

test("trace not closed", () => {
    const path = pathRecorder();
    context.trace(path);
    expect(names(path.calls)).toEqual(["moveTo", "lineTo", "bezierCurveTo"]);
});

test("trace instructions string", () => {
    const path = new Path([10, 20], "C 40 10, 65 10, 95 80 S 150 150, 180 80");
    const recorder = pathRecorder();
    path.trace(recorder);
    expect(names(recorder.calls)).toEqual(["addPath"]);
    expect(recorder.calls[0][1]).toBeInstanceOf(Path2D);
});

test("isHover", () => {
    const ctx = window.document.createElement("canvas").getContext("2d")!;
    // Not closed path is only stroked
    expect(context.isHover([50, 50], ctx)).toBe(true);
    expect(context.isHover([50, 0], ctx)).toBe(false);
});

test("toJSON and from", () => {
    const json = JSON.parse(JSON.stringify(context));
    expect(json.instructions).toEqual([
        {
            type: "lineTo",
            target: [100, 100],
        },
        {
            type: "quarterTo",
            target: [200, 200],
            args: [true],
        },
    ]);
    expect(json.isClosed).toBe(false);

    const copy = Path.from(json);
    const path = pathRecorder();
    copy.trace(path);
    const original = pathRecorder();
    context.trace(original);
    expect(path.calls).toEqual(original.calls);
});

test("toJSON with string instructions", () => {
    const path = new Path([0, 0], "l 10 10");
    const json = path.toJSON();
    expect(json.instructions).toBe("l 10 10");
    expect((Path.from(json) as Path).instructions).toBe("l 10 10");
});

test("toJSON with custom instruction", () => {
    context.instructions = [new Instruction(() => {}, [0, 0])];
    expect(() => JSON.stringify(context)).toThrow(ReferenceError);
});

test("from with unknown instruction", () => {
    expect(() => Path.from({
        constructor: "Path",
        position: [0, 0],
        instructions: [{
            type: "unknown",
            target: [0, 0],
        }],
    })).toThrow(ReferenceError);
});

test("lineTo", () => {
    const path = pathRecorder();
    Path.lineTo([100, 200]).execute(path, new Position());
    expect(path.calls).toEqual([["lineTo", 100, 200]]);
});

test("moveTo", () => {
    const path = pathRecorder();
    Path.moveTo([100, 200]).execute(path, new Position());
    expect(path.calls).toEqual([["moveTo", 100, 200]]);
});

test("quarterTo halfTo arcTo bezierTo", () => {
    const instructions = [
        Path.quarterTo([100, 200]),
        Path.halfTo([100, 200], false),
        Path.arcTo([100, 200], 0.1, 0.5),
        Path.bezierTo([100, 200], [1, 2], [10, 20]),
    ];
    for (const instruction of instructions) {
        const path = pathRecorder();
        const reached = instruction.execute(path, new Position());
        expect(reached.equals([100, 200])).toBe(true);
        const [[name, ...args]] = path.calls;
        expect(name).toBe("bezierCurveTo");
        expect(args.slice(4)).toEqual([100, 200]);
    }
});

test("quadTo", () => {
    const path = pathRecorder();
    Path.quadTo([100, 200], [5, 6]).execute(path, new Position());
    expect(path.calls).toEqual([["quadraticCurveTo", 5, 6, 100, 200]]);
});

test("splineThrough", () => {
    const points = [
        [10, 20],
        [30, 40],
        [1, 2],
    ];
    const path = pathRecorder();
    const instruction = Path.splineThrough(points, 0.5);
    expect(instruction.target.equals([1, 2])).toBe(true);
    instruction.execute(path, new Position());
    expect(path.calls.map(([, ...args]) => args.slice(4))).toEqual(points);

    // Serialization round-trip
    const revived = Instruction.from(JSON.parse(JSON.stringify(instruction)));
    const other = pathRecorder();
    revived.execute(other, new Position());
    expect(other.calls).toEqual(path.calls);
});

test("waveTo", () => {
    const path = pathRecorder();
    const reached = Path.waveTo([90, 0], 3).execute(path, new Position());
    expect(reached.equals([90, 0])).toBe(true);
    expect(path.calls.length).toBe(3);
    expect(path.calls.map(([, ...args]) => args.slice(4))).toEqual([[30, 0], [60, 0], [90, 0]]);
});

test("sinTo", () => {
    const path = pathRecorder();
    Path.sinTo([100, 0], 2, 10).execute(path, new Position());
    // Two sinusoid is four half-waves
    expect(path.calls.length).toBe(4);
    const [, , c1y] = path.calls[0];
    const [, , c2y] = path.calls[1];
    // Alternate side
    expect(Math.sign(c1y as number)).toBe(-Math.sign(c2y as number));
    expect(path.calls[3].slice(5)).toEqual([100, 0]);
});
