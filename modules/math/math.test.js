/* global describe test expect */

import * as M from "./math";

describe("Math", () => {
    test("constrain", () => {
        expect(M.constrain(7.77, 0, 10)).toBe(7.77);
        expect(M.constrain(99, 0, 1)).toBe(1);
        expect(M.constrain(-20, -5, 5)).toBe(-5);
    });

    test("equals", () => {
        expect(M.equals(0, 0)).toBe(true);
        expect(M.equals(1, 9)).toBe(false);
        expect(M.equals(0.1 + 0.2, 0.3)).toBe(true);
        expect(M.equals(0.6 / 6, 0.1)).toBe(true);
        expect(M.equals(Math.PI, 3.14159)).toBe(false);
    });

    test("random", () => {
        for (let i = 0; i < 100; ++i) {
            const pick = M.random();
            expect(pick).toBeGreaterThan(0);
            expect(pick).toBeLessThan(1);
        }
        for (let i = 0; i < 100; ++i) {
            const pick = M.random(15);
            expect(pick).toBeGreaterThan(0);
            expect(pick).toBeLessThan(15);
        }
        for (let i = 0; i < 100; ++i) {
            const pick = M.random(10, 15);
            expect(pick).toBeGreaterThan(10);
            expect(pick).toBeLessThan(15);
        }
    });

    test("truncate", () => {
        expect(M.truncate(1)).toBe(1);
        expect(M.truncate(1.99)).toBe(1);
        expect(M.truncate(-11.99)).toBe(-11);
    });

    test("trigonometry", () => {
        expect(M.radianCircle).toBeCloseTo(Math.PI * 2);
        expect(M.degreeCircle).toBe(360);
    });

    test("modulo", () => {
        expect(M.modulo(10, 1)).toBe(0);
        expect(M.modulo(10, 3)).toBe(1);
        expect(M.modulo(-10, 3)).toBe(1);
        expect(M.modulo(10, -3)).toBe(-1);
        expect(M.modulo(-10, -3)).toBe(-1);
    });
});

