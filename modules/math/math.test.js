/* global test expect */

import * as M from "./math";

test("Math constrain", () => {
    expect(M.constain(7.77, 0, 10)).toBe(7.77);
    expect(M.constain(99, 0, 1)).toBe(1);
    expect(M.constain(-20, -5, 5)).toBe(-5);
});

test("Math equal", () => {
    expect(M.equal(0, 0)).toBe(true);
    expect(M.equal(1, 9)).toBe(false);
    expect(M.equal(0.1 + 0.2, 0.3)).toBe(true);
    expect(M.equal(0.6 / 6, 0.1)).toBe(true);
    expect(M.equal(Math.PI, 3.14159)).toBe(false);
});

test("Math truncate", () => {
    expect(M.truncate(1)).toBe(1);
    expect(M.truncate(1.99)).toBe(1);
    expect(M.truncate(-11.99)).toBe(-11);
});

test("Math trigo", () => {
    expect(M.radianCircle).toBeCloseTo(Math.PI * 2);
    expect(M.degreeCircle).toBe(360);
});
