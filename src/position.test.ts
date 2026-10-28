import { test, expect, beforeEach } from "vitest";


let context: any;
import Vector from "./vector.js";
import Position from "./position.js";
import almostEqual from "../test/_almost-equal.js";

beforeEach(() => {
    context = new Position(-42, 55);
});

test("constructor", () => {
    expect(context.x).toBe(-42);
    expect(context.y).toBe(55);

    const defaultPosition = new Position();

    expect(defaultPosition.x).toBe(0);
    expect(defaultPosition.y).toBe(0);
});

test("set", () => {
    context.set(99, -1);

    expect(context.x).toBe(99);
    expect(context.y).toBe(-1);

    context.set(new Position(10, 20));

    expect(context.x).toBe(10);
    expect(context.y).toBe(20);

    context.set(42);

    expect(context.x).toBe(42);
    expect(context.y).toBe(42);
});

test("clone and equals", () => {
    const clone = context.clone();

    expect(clone).not.toBe(context);
    expect(context.x).toBe(clone.x);
    expect(context.y).toBe(clone.y);
    expect(context.equals([clone.x, clone.y])).toBe(true);
    expect(context.equals([123, 5])).toBe(false);
});

let one: any;
let two: any;
const setup = () => {
    one = new Position(80, 90);
    two = new Position(60, 70);
};
const check = () => {
    // Original unchanged
    expect(one.x).toBe(80);
    expect(one.y).toBe(90);

    expect(two.x).toBe(60);
    expect(two.y).toBe(70);
};

const calculation = (functionName: string, operation: (a: number, b: number) => number) => {
    setup();
    const subPos = one.clone()[functionName](two);
    expect(almostEqual(subPos.x, operation(one.x, two.x))).toBe(true);
    expect(almostEqual(subPos.y, operation(one.y, two.y))).toBe(true);

    const oneValue = 3.21;
    const subVal = one.clone()[functionName](oneValue);
    expect(almostEqual(subVal.x, operation(one.x, oneValue))).toBe(true);
    expect(almostEqual(subVal.y, operation(one.y, oneValue))).toBe(true);

    const twoValues = [
        5.82,
        9.07,
    ];
    const subTwoVal = one.clone()[functionName](...twoValues);
    expect(almostEqual(subTwoVal.x, operation(one.x, twoValues[0]))).toBe(true);
    expect(almostEqual(subTwoVal.y, operation(one.y, twoValues[1]))).toBe(true);
    check();
};

test("add", () => {
    calculation("add", (a, b) => a + b);
});

test("subtract", () => {
    calculation("subtract", (a, b) => a - b);
});

test("multiply", () => {
    calculation("multiply", (a, b) => a * b);
});

test("divide", () => {
    calculation("divide", (a, b) => a / b);
});

test("modulo", () => {
    calculation("modulo", (a, b) => a % b);
});

test("power", () => {
    calculation("power", (a, b) => a ** b);
});

test("rotate", () => {
    context.set(10, 0);

    context.rotate();
    expect(almostEqual(context.x, 10)).toBe(true);
    expect(almostEqual(context.y, 0)).toBe(true);

    context.rotate(0.5);
    expect(almostEqual(context.x, -10)).toBe(true);
    expect(almostEqual(context.y, 0)).toBe(true);

    context.rotate(1);
    expect(almostEqual(context.x, -10)).toBe(true);
    expect(almostEqual(context.y, 0)).toBe(true);

    context.rotate(0.5);
    expect(almostEqual(context.x, 10)).toBe(true);
    expect(almostEqual(context.y, 0)).toBe(true);
});

test("constrain", () => {
    context.constrain([-100, -100], [100, 100]);
    expect(context.x).toBe(-42);
    expect(context.y).toBe(55);

    context.constrain([100, -100], [-100, 100]);
    expect(context.x).toBe(-42);
    expect(context.y).toBe(55);

    context.constrain([10, -10], [-10, 10]);
    expect(context.x).toBe(-10);
    expect(context.y).toBe(10);

    context.constrain([0, 0], [100, 100]);
    expect(context.x).toBe(0);
    expect(context.y).toBe(10);
});

test("lerp", () => {
    const target = new Position(10, 100);

    context.lerp(target, 0.5);
    expect(almostEqual(context.x, -16)).toBe(true);
    expect(almostEqual(context.y, 77.5)).toBe(true);

    context.lerp([10, 100], 0.1);
    expect(almostEqual(context.x, -13.4)).toBe(true);
    expect(almostEqual(context.y, 79.75)).toBe(true);
});

test("distance", () => {
    const pos2 = new Position(context.x + 30, context.y - 40); // 3² + 4² = 5²

    const dist = context.distance(pos2);
    expect(almostEqual(dist, 50)).toBe(true);
    expect(almostEqual(pos2.distance(context), dist)).toBe(true);
});

test("dotProduct", () => {
    expect(context.dotProduct([-8, 3])).toBe(501);
});

test("crossProduct", () => {
    expect(context.crossProduct([-8, 3])).toBe(314);
});

test("isOnSameSide", () => {
    const splitter = new Vector([-1, -1], [1, 1]);
    const onSameSide = new Position(1, 55);
    const notSameSide = new Position(55, -42);

    expect(context.isOnSameSide(onSameSide, splitter)).toBe(true);
    expect(context.isOnSameSide(notSameSide, splitter)).toBe(false);
});

test("angle", () => {
    expect(context.set(0, -1).angle).toBe(0);
    expect(context.set(0, 1).angle).toBe(0.5);
    expect(context.set(-1, 0).angle).toBe(0.75);
    expect(context.set(1, 1).angle).toBe(0.375);
    expect(context.set(0, 0).angle).toBe(0);
});

test("length", () => {
    expect(context.set(0, -1).length).toBe(1);
    expect(context.set(0, 0).length).toBe(0);
    expect(context.set(-3, 4).length).toBe(5);
});

test("toJSON", () => {
    expect(context.toJSON()).toEqual([-42, 55]);
    expect(context.set(1.1, 3.333).toJSON()).toEqual([1.1, 3.333]);
});

test("from", () => {
    expect(Position.from(context)).toBe(context);

    const fromUndefined = Position.from(undefined);
    expect(fromUndefined.x).toBe(0);
    expect(fromUndefined.y).toBe(0);

    const fromEmptyArray = Position.from([]);
    expect(fromEmptyArray.x).toBe(0);
    expect(fromEmptyArray.y).toBe(0);

    const fromArray = Position.from([150, 42]);
    expect(fromArray.x).toBe(150);
    expect(fromArray.y).toBe(42);

    const fromObject = Position.from({
        x: 42,
        y: 666,
    });
    expect(fromObject.x).toBe(42);
    expect(fromObject.y).toBe(666);

    expect(() => Position.from(null)).toThrow();
});

test("average", () => {
    const n = 10;
    const points = [...new Array(n)].map((p, index) => new Position(index, index * 7));
    const average = Position.average(...points);

    expect(average instanceof Position).toBe(true);
    const avr = (n - 1) / 2;
    expect(almostEqual(average.x, avr)).toBe(true);
    expect(almostEqual(average.y, avr * 7)).toBe(true);
});
