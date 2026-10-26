import { test, expect } from "vitest";
import * as M from "./math.js";
import almostEqual from "../test/_almost-equal.js";

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
        expect(pick > 0).toBe(true);
        expect(pick < 1).toBe(true);
    }
    for (let i = 0; i < 100; ++i) {
        const pick = M.random(15);
        expect(pick > 0).toBe(true);
        expect(pick < 15).toBe(true);
    }
    for (let i = 0; i < 100; ++i) {
        const pick = M.random(10, 15);
        expect(pick > 10).toBe(true);
        expect(pick < 15).toBe(true);
    }
});

test("truncate", () => {
    expect(M.truncate(1)).toBe(1);
    expect(M.truncate(1.99)).toBe(1);
    expect(M.truncate(-11.99)).toBe(-11);
});

test("constants", () => {
    expect(almostEqual(M.radianCircle, Math.PI * 2)).toBe(true);
    expect(M.degreeCircle).toBe(360);
    expect(almostEqual(M.phi, 1.61803398875)).toBe(true);
});

test("modulo", () => {
    expect(M.modulo(10, 1)).toBe(0);
    expect(M.modulo(10, 3)).toBe(1);
    expect(M.modulo(-10, 3)).toBe(2);
    expect(M.modulo(10, -3)).toBe(-2);
    expect(M.modulo(-10, -3)).toBe(-1);
    expect(M.modulo(42, Infinity)).toBe(42);
    expect(M.modulo(Infinity, 99)).toBe(NaN);
    expect(M.modulo(0, 6)).toBe(0);
    expect(M.modulo(0, -6)).toBe(0);
    expect(M.modulo(6, 6)).toBe(0);
});

test("distribute", () => {
    const distribution = M.distribute(100, 50, 60);
    expect(Math.min(...distribution) > 50).toBe(true);
    expect(Math.max(...distribution) < 60).toBe(true);
    const count = distribution.reduce((acc, val) => {
        const index = Math.floor(val - 50);
        if (!acc[index]) {
            acc[index] = 0;
        }
        acc[index]++;
        return acc;
    }, []);
    expect(count.every(val => Math.abs(val - 10) < 3)).toBe(true);
});

test("sum", () => {
    expect(M.sum()).toBe(0);
    expect(M.sum(5)).toBe(5);
    expect(M.sum(1, 2, 3, 4)).toBe(10);
    expect(M.sum(-99, 99)).toBe(0);
});

test("average", () => {
    expect(M.average()).toBe(NaN);
    expect(M.average(1)).toBe(1);
    expect(M.average(1, 2, 3)).toBe(2);
    const n = 100;
    expect(M.average(...[...new Array(n)].map((_, index) => index))).toBe((n - 1) / 2);
});

test("map", () => {
    expect(M.map(3, 0, 10)).toBe(0.3);
    expect(M.map(150, 100, 200)).toBe(0.5);
    expect(M.map(11, 10, 20, 30, 40)).toBe(31);
    expect(M.map(2, 0, 10, 100, 200)).toBe(120);
    expect(M.map(9, 0, 10, 10, 0)).toBe(1);
    expect(M.map(15, 10, 20, -10, -20)).toBe(-15);
});

test("lerp", () => {
    expect(M.lerp(0, 10, 0.5)).toBe(5);
    expect(M.lerp(0, 1000, 0)).toBe(0);
    expect(M.lerp(-123456, 3, 1)).toBe(3);
    expect(M.lerp(0, 10, 2)).toBe(20);
    expect(M.lerp(0, 10, -3)).toBe(-30);
});
