/* global test expect describe beforeEach afterEach */

import Position from "./position";
import Vector from "../vector/vector";

describe("Position", () => {
    let pos;
    beforeEach(() => {
        pos = new Position();
    });

    test("creation", () => {
        expect(pos.x).toBeCloseTo(0);
        expect(pos.y).toBeCloseTo(0);

        const pos2 = new Position(-42, 55.55);

        expect(pos2.x).toBeCloseTo(-42);
        expect(pos2.y).toBeCloseTo(55.55);
    });

    test("set", () => {
        pos.set(-42, 55.55);

        expect(pos.x).toBeCloseTo(-42);
        expect(pos.y).toBeCloseTo(55.55);

        pos.set(new Position(99.99, 1));

        expect(pos.x).toBeCloseTo(99.99);
        expect(pos.y).toBeCloseTo(1);
    });

    test("clone and equals", () => {
        pos.set(-42, 55.55);
        const clone = pos.clone();

        expect(clone).not.toBe(pos);
        expect(pos.x).toBeCloseTo(clone.x);
        expect(pos.y).toBeCloseTo(clone.y);
        expect(pos.equals([clone.x, clone.y])).toBe(true);
        expect(pos.equals([123, 5])).toBe(false);
    });

    describe("calculations", () => {
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

            const oneValue = 3.21;
            const subVal = one.clone()[functionName](oneValue);
            expect(subVal.x).toBeCloseTo(operation(one.x, oneValue));
            expect(subVal.y).toBeCloseTo(operation(one.y, oneValue));

            const twoValues = [
                5.82,
                9.07,
            ];
            const subTwoVal = one.clone()[functionName](...twoValues);
            expect(subTwoVal.x).toBeCloseTo(operation(one.x, twoValues[0]));
            expect(subTwoVal.y).toBeCloseTo(operation(one.y, twoValues[1]));
        };

        test("subtract", () => {
            // Subtract
            calculation("subtract", (a, b) => a - b);
        });

        test("add", () => {
            // Add
            calculation("add", (a, b) => a + b);
        });

        test("divide", () => {
            // Divide
            calculation("divide", (a, b) => a / b);
        });

        test("multiply", () => {
            // Multiply
            calculation("multiply", (a, b) => a * b);
        });
    });

    test("rotate", () => {
        pos.set(10, 0);

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

    test("constrain", () => {
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

    test("lerp", () => {
        const target = new Position(10, 100);

        pos.lerp(target, 0.5);
        expect(pos.x).toBeCloseTo(5);
        expect(pos.y).toBeCloseTo(50);

        pos.lerp(target, 0.5);
        expect(pos.x).toBeCloseTo(7.5);
        expect(pos.y).toBeCloseTo(75);
    });

    test("distance", () => {
        pos.set(20, -10);
        const pos2 = new Position(pos.x + 30, pos.y + 40); // 3² + 4² = 5²

        const dist = pos.distance(pos2);
        expect(dist).toBe(50);
        expect(pos2.distance(pos)).toBe(dist);
    });

    test.skip("crossProduct", () => {
    });

    test("isOnSameSide", () => {
        const splitter = new Vector(new Position(10, 0), new Position(0, 10));
        const onSameSide = new Position(1, 2);
        const notSameSide = new Position(8, 9);

        expect(pos.isOnSameSide(onSameSide, splitter)).toBe(true);
        expect(pos.isOnSameSide(notSameSide, splitter)).toBe(false);
    });

    test("toJSON", () => {
        pos.set(10, 55);
        const json = pos.toJSON();

        expect(json).toEqual([10, 55]);
    });

    describe("statics", () => {
        test("average", () => {
            const n = 10;
            const points = (new Array(n)).fill().map((p, index) => new Position(index, index * 7));
            const average = Position.average(...points);

            expect(average instanceof Position).toBe(true);
            const avr = (n - 1) / 2;
            expect(average.x).toBeCloseTo(avr);
            expect(average.y).toBeCloseTo(avr * 7);
        });
    });
});
