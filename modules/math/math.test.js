import test from "ava";
import * as M from ".";
import almostEqual from "../../test/_almost-equal";

test("constrain", (t) => {
    t.is(M.constrain(7.77, 0, 10), 7.77);
    t.is(M.constrain(99, 0, 1), 1);
    t.is(M.constrain(-20, -5, 5), -5);
});

test("equals", (t) => {
    t.true(M.equals(0, 0));
    t.false(M.equals(1, 9));
    t.true(M.equals(0.1 + 0.2, 0.3));
    t.true(M.equals(0.6 / 6, 0.1));
    t.false(M.equals(Math.PI, 3.14159));
});

test("random", (t) => {
    for (let i = 0; i < 100; ++i) {
        const pick = M.random();
        t.true(pick > 0);
        t.true(pick < 1);
    }
    for (let i = 0; i < 100; ++i) {
        const pick = M.random(15);
        t.true(pick > 0);
        t.true(pick < 15);
    }
    for (let i = 0; i < 100; ++i) {
        const pick = M.random(10, 15);
        t.true(pick > 10);
        t.true(pick < 15);
    }
});

test("truncate", (t) => {
    t.is(M.truncate(1), 1);
    t.is(M.truncate(1.99), 1);
    t.is(M.truncate(-11.99), -11);
});

test("constants", (t) => {
    t.true(almostEqual(M.radianCircle, Math.PI * 2));
    t.is(M.degreeCircle, 360);
    t.true(almostEqual(M.phi, 1.61803398875));
});

test("modulo", (t) => {
    t.is(M.modulo(10, 1), 0);
    t.is(M.modulo(10, 3), 1);
    t.is(M.modulo(-10, 3), 2);
    t.is(M.modulo(10, -3), -2);
    t.is(M.modulo(-10, -3), -1);
    t.is(M.modulo(42, Infinity), 42);
    t.is(M.modulo(Infinity, 99), NaN);
});

test("distribute", (t) => {
    const distribution = M.distribute(100, 50, 60);
    t.true(Math.min(...distribution) > 50);
    t.true(Math.max(...distribution) < 60);
    const count = distribution.reduce((acc, val) => {
        const index = Math.floor(val - 50);
        if (!acc[index]) {
            acc[index] = 0;
        }
        acc[index]++;
        return acc;
    }, []);
    t.true(count.every(val => Math.abs(val - 10) < 3));
});

test("sum", (t) => {
    t.is(M.sum(), 0);
    t.is(M.sum(5), 5);
    t.is(M.sum(1, 2, 3, 4), 10);
    t.is(M.sum(-99, 99), 0);
});

test("average", (t) => {
    t.is(M.average(), NaN);
    t.is(M.average(1), 1);
    t.is(M.average(1, 2, 3), 2);
    const n = 100;
    t.is(M.average(...[...new Array(n)].map((_, index) => index)), (n - 1) / 2);
});

test("map", (t) => {
    t.is(M.map(3, 0, 10), 0.3);
    t.is(M.map(150, 100, 200), 0.5);
    t.is(M.map(11, 10, 20, 30, 40), 31);
    t.is(M.map(2, 0, 10, 100, 200), 120);
    t.is(M.map(9, 0, 10, 10, 0), 1);
    t.is(M.map(15, 10, 20, -10, -20), -15);
});

test("lerp", (t) => {
    t.is(M.lerp(0, 10, 0.5), 5);
    t.is(M.lerp(0, 1000, 0), 0);
    t.is(M.lerp(-123456, 3, 1), 3);
    t.is(M.lerp(0, 10, 2), 20);
    t.is(M.lerp(0, 10, -3), -30);
});
