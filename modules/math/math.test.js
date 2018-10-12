import test from "ava";
import * as M from "./math";
import almostEqual from "../../test/helpers/almost-equal";

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

test("trigonometry", (t) => {
    t.true(almostEqual(M.radianCircle, Math.PI * 2));
    t.is(M.degreeCircle, 360);
});

test("modulo", (t) => {
    t.is(M.modulo(10, 1), 0);
    t.is(M.modulo(10, 3), 1);
    t.is(M.modulo(-10, 3), 1);
    t.is(M.modulo(10, -3), -1);
    t.is(M.modulo(-10, -3), -1);
});

test("average", (t) => {
    t.is(M.average(1), 1);
    t.is(M.average(1, 2, 3), 2);
    const n = 100;
    t.is(M.average(...(new Array(n)).fill().map((v, index) => index)), (n - 1) / 2);
});
