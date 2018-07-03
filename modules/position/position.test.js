/* global test expect describe  beforeEach afterEach */

import { random } from "@pencil.js/math";
import Position from "./position";

test("Position creation", () => {
    const pos = new Position();

    expect(pos.x).toBe(0);
    expect(pos.y).toBe(0);

    const pos2 = new Position(-42, 55.55);

    expect(pos2.x).toBe(-42);
    expect(pos2.y).toBe(55.55);
});

test("Position set values", () => {
    const pos = new Position();
    pos.set(-42, 55.55);

    expect(pos.x).toBe(-42);
    expect(pos.y).toBe(55.55);

    pos.set(new Position(99.99, 1));

    expect(pos.x).toBe(99.99);
    expect(pos.y).toBe(1);
});

test("Position clone and equals", () => {
    const pos = new Position(42, 55.55);
    const clone = pos.clone();

    expect(clone).not.toBe(pos);
    expect(pos.x).toBe(clone.x);
    expect(pos.y).toBe(clone.y);
    expect(pos.equals(clone)).toBe(true);
});

describe("Position calculations", () => {
    let one;
    let two;

    beforeEach(() => {
        one = new Position(80, 90);
        two = new Position(60, 70);
    });

    afterEach(() => {
        // Original unchanged
        expect(one.x).toBe(80);
        expect(one.y).toBe(90);

        expect(two.x).toBe(60);
        expect(two.y).toBe(70);
    });

    const calculation = (functionName, operation) => {
        const subPos = one.clone()[functionName](two);
        expect(subPos.x).toBeCloseTo(operation(one.x, two.x));
        expect(subPos.y).toBeCloseTo(operation(one.y, two.y));

        const oneValue = +random(1, 100).toFixed(2);
        const subVal = one.clone()[functionName](oneValue);
        expect(subVal.x).toBeCloseTo(operation(one.x, oneValue));
        expect(subVal.y).toBeCloseTo(operation(one.y, oneValue));

        const twoValues = [
            +random(1, 100).toFixed(2),
            +random(1, 100).toFixed(2),
        ];
        const subTwoVal = one.clone()[functionName](...twoValues);
        expect(subTwoVal.x).toBeCloseTo(operation(one.x, twoValues[0]));
        expect(subTwoVal.y).toBeCloseTo(operation(one.y, twoValues[1]));
    };

    test("Position subtract", () => {
        // Subtract
        calculation("subtract", (a, b) => a - b);
    });

    test("Position add", () => {
        // Add
        calculation("add", (a, b) => a + b);
    });

    test("Position divide", () => {
        // Divide
        calculation("divide", (a, b) => a / b);
    });

    test("Position multiply", () => {
        // Multiply
        calculation("multiply", (a, b) => a * b);
    });
});

test("Position rotate", () => {
    const pos = new Position(10, 0);

    pos.rotate(0.5);
    expect(pos.x).toBeCloseTo(-10);
    expect(pos.y).toBeCloseTo(0);

    pos.rotate(1);
    expect(pos.x).toBeCloseTo(-10);
    expect(pos.y).toBeCloseTo(0);

    pos.rotate(0.5);
    expect(pos.x).toBeCloseTo(10);
    expect(pos.y).toBeCloseTo(0);
});

test("Position constrain", () => {
    const pos = new Position(0, 0);

    pos.constrain([-10, -10], [10, 10]);
    expect(pos.x).toBe(0);
    expect(pos.y).toBe(0);

    pos.constrain([-10, -10], [10, -5]);
    expect(pos.x).toBe(0);
    expect(pos.y).toBe(-5);

    pos.constrain([-10, -10], [-8, -8]);
    expect(pos.x).toBe(-8);
    expect(pos.y).toBe(-8);
});

test("Position lerp", () => {
    const pos = new Position();
    const target = new Position(10, 100);

    pos.lerp(target, 0.5);
    expect(pos.x).toBeCloseTo(5);
    expect(pos.y).toBeCloseTo(50);

    pos.lerp(target, 0.5);
    expect(pos.x).toBeCloseTo(7.5);
    expect(pos.y).toBeCloseTo(75);
});

test("Position distance", () => {
    const pos = new Position(20, -10);
    const pos2 = new Position(pos.x + 30, pos.y + 40); // 3² + 4² = 5²

    const dist = pos.distance(pos2);
    expect(dist).toBe(50);
    expect(pos2.distance(pos)).toBe(dist);
});

test("Position average", () => {
    const n = 10;
    const points = (new Array(n)).fill().map((p, index) => new Position(index, index * 7));
    const average = Position.average.apply(null, points);

    expect(average instanceof Position).toBe(true);
    const avr = (n - 1) / 2;
    expect(average.x).toBeCloseTo(avr);
    expect(average.y).toBeCloseTo(avr * 7);
});
