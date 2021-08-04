import test from "ava";
import Vector from "@pencil.js/vector";
import Position from "./position.js";
import almostEqual from "../../../test/_almost-equal.js";

test.beforeEach((t) => {
    t.context = new Position(-42, 55);
});

test("constructor", (t) => {
    t.is(t.context.x, -42);
    t.is(t.context.y, 55);

    const defaultPosition = new Position();

    t.is(defaultPosition.x, 0);
    t.is(defaultPosition.y, 0);
});

test("set", (t) => {
    t.context.set(99, -1);

    t.is(t.context.x, 99);
    t.is(t.context.y, -1);

    t.context.set(new Position(10, 20));

    t.is(t.context.x, 10);
    t.is(t.context.y, 20);

    t.context.set(42);

    t.is(t.context.x, 42);
    t.is(t.context.y, 42);
});

test("clone and equals", (t) => {
    const clone = t.context.clone();

    t.not(clone, t.context);
    t.is(t.context.x, clone.x);
    t.is(t.context.y, clone.y);
    t.true(t.context.equals([clone.x, clone.y]));
    t.false(t.context.equals([123, 5]));
});

let one;
let two;
const setup = () => {
    one = new Position(80, 90);
    two = new Position(60, 70);
};
const check = (t) => {
    // Original unchanged
    t.is(one.x, 80);
    t.is(one.y, 90);

    t.is(two.x, 60);
    t.is(two.y, 70);
};

const calculation = (t, functionName, operation) => {
    setup();
    const subPos = one.clone()[functionName](two);
    t.true(almostEqual(subPos.x, operation(one.x, two.x)));
    t.true(almostEqual(subPos.y, operation(one.y, two.y)));

    const oneValue = 3.21;
    const subVal = one.clone()[functionName](oneValue);
    t.true(almostEqual(subVal.x, operation(one.x, oneValue)));
    t.true(almostEqual(subVal.y, operation(one.y, oneValue)));

    const twoValues = [
        5.82,
        9.07,
    ];
    const subTwoVal = one.clone()[functionName](...twoValues);
    t.true(almostEqual(subTwoVal.x, operation(one.x, twoValues[0])));
    t.true(almostEqual(subTwoVal.y, operation(one.y, twoValues[1])));
    check(t);
};

test("add", (t) => {
    calculation(t, "add", (a, b) => a + b);
});

test("subtract", (t) => {
    calculation(t, "subtract", (a, b) => a - b);
});

test("multiply", (t) => {
    calculation(t, "multiply", (a, b) => a * b);
});

test("divide", (t) => {
    calculation(t, "divide", (a, b) => a / b);
});

test("modulo", (t) => {
    calculation(t, "modulo", (a, b) => a % b);
});

test("power", (t) => {
    calculation(t, "power", (a, b) => a ** b);
});

test("rotate", (t) => {
    t.context.set(10, 0);

    t.context.rotate();
    t.true(almostEqual(t.context.x, 10));
    t.true(almostEqual(t.context.y, 0));

    t.context.rotate(0.5);
    t.true(almostEqual(t.context.x, -10));
    t.true(almostEqual(t.context.y, 0));

    t.context.rotate(1);
    t.true(almostEqual(t.context.x, -10));
    t.true(almostEqual(t.context.y, 0));

    t.context.rotate(0.5);
    t.true(almostEqual(t.context.x, 10));
    t.true(almostEqual(t.context.y, 0));
});

test("constrain", (t) => {
    t.context.constrain([-100, -100], [100, 100]);
    t.is(t.context.x, -42);
    t.is(t.context.y, 55);

    t.context.constrain([100, -100], [-100, 100]);
    t.is(t.context.x, -42);
    t.is(t.context.y, 55);

    t.context.constrain([10, -10], [-10, 10]);
    t.is(t.context.x, -10);
    t.is(t.context.y, 10);

    t.context.constrain([0, 0], [100, 100]);
    t.is(t.context.x, 0);
    t.is(t.context.y, 10);
});

test("lerp", (t) => {
    const target = new Position(10, 100);

    t.context.lerp(target, 0.5);
    t.true(almostEqual(t.context.x, -16));
    t.true(almostEqual(t.context.y, 77.5));

    t.context.lerp([10, 100], 0.1);
    t.true(almostEqual(t.context.x, -13.4));
    t.true(almostEqual(t.context.y, 79.75));
});

test("distance", (t) => {
    const pos2 = new Position(t.context.x + 30, t.context.y - 40); // 3² + 4² = 5²

    const dist = t.context.distance(pos2);
    t.true(almostEqual(dist, 50));
    t.true(almostEqual(pos2.distance(t.context), dist));
});

test("dotProduct", (t) => {
    t.is(t.context.dotProduct([-8, 3]), 501);
});

test("crossProduct", (t) => {
    t.is(t.context.crossProduct([-8, 3]), 314);
});

test("isOnSameSide", (t) => {
    const splitter = new Vector([-1, -1], [1, 1]);
    const onSameSide = new Position(1, 55);
    const notSameSide = new Position(55, -42);

    t.true(t.context.isOnSameSide(onSameSide, splitter));
    t.false(t.context.isOnSameSide(notSameSide, splitter));
});

test("angle", (t) => {
    t.is(t.context.set(0, -1).angle, 0);
    t.is(t.context.set(0, 1).angle, 0.5);
    t.is(t.context.set(-1, 0).angle, 0.75);
    t.is(t.context.set(1, 1).angle, 0.375);
    t.is(t.context.set(0, 0).angle, 0);
});

test("length", (t) => {
    t.is(t.context.set(0, -1).length, 1);
    t.is(t.context.set(0, 0).length, 0);
    t.is(t.context.set(-3, 4).length, 5);
});

test("toJSON", (t) => {
    t.deepEqual(t.context.toJSON(), [-42, 55]);
    t.deepEqual(t.context.set(1.1, 3.333).toJSON(), [1.1, 3.333]);
});

test("from", (t) => {
    t.is(Position.from(t.context), t.context);

    const fromUndefined = Position.from(undefined);
    t.is(fromUndefined.x, 0);
    t.is(fromUndefined.y, 0);

    const fromEmptyArray = Position.from([]);
    t.is(fromEmptyArray.x, 0);
    t.is(fromEmptyArray.y, 0);

    const fromArray = Position.from([150, 42]);
    t.is(fromArray.x, 150);
    t.is(fromArray.y, 42);

    const fromObject = Position.from({
        x: 42,
        y: 666,
    });
    t.is(fromObject.x, 42);
    t.is(fromObject.y, 666);

    t.throws(() => Position.from(null), {
        instanceOf: TypeError,
    });
});

test("average", (t) => {
    const n = 10;
    const points = [...new Array(n)].map((p, index) => new Position(index, index * 7));
    const average = Position.average(...points);

    t.true(average instanceof Position);
    const avr = (n - 1) / 2;
    t.true(almostEqual(average.x, avr));
    t.true(almostEqual(average.y, avr * 7));
});
