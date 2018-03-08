/* global test expect */

import Position from "./position";

test("Position creation", () => {
    const pos = new Position();

    expect(pos.x).toBe(0);
    expect(pos.y).toBe(0);

    const pos2 = new Position(42, 55.55);

    expect(pos2.x).toBe(42);
    expect(pos2.y).toBe(55);
});

test("Position set values", () => {
    const pos = new Position();
    pos.set(42, 55.55);

    expect(pos.x).toBe(42);
    expect(pos.y).toBe(55);

    pos.set(new Position(99.99, 1));

    expect(pos.x).toBe(99);
    expect(pos.y).toBe(1);
});

test("Position clone and equal", () => {
    const pos = new Position(42, 55.55);
    const clone = pos.clone();

    expect(clone).not.toBe(pos);
    expect(pos.equal(clone)).toBe(true);
});

test("Position Calculations", () => {
    const one = new Position(80, 90);
    const two = new Position(60, 70);
    // eslint-disable-next-line no-bitwise
    const floor = x => x << 0;

    // Subtract
    const subPos = one.subtract(two);
    expect(subPos.x).toBe(floor(one.x - two.x));
    expect(subPos.y).toBe(floor(one.y - two.y));

    const subVal = one.subtract(33);
    expect(subVal.x).toBe(floor(one.x - 33));
    expect(subVal.y).toBe(floor(one.y - 33));

    const subTwoVal = one.subtract(100.5, 0.8);
    expect(subTwoVal.x).toBe(floor(one.x - 100.5));
    expect(subTwoVal.y).toBe(floor(one.y - 0.8));

    // Add
    const addPos = one.add(two);
    expect(addPos.x).toBe(floor(one.x + two.x));
    expect(addPos.y).toBe(floor(one.y + two.y));

    const addVal = one.add(5);
    expect(addVal.x).toBe(floor(one.x + 5));
    expect(addVal.y).toBe(floor(one.y + 5));

    const addTwoVal = one.add(10, 0.9);
    expect(addTwoVal.x).toBe(floor(one.x + 10));
    expect(addTwoVal.y).toBe(floor(one.y + 0.9));

    // Divide
    const divPos = one.divide(two);
    expect(divPos.x).toBe(floor(one.x / two.x));
    expect(divPos.y).toBe(floor(one.y / two.y));

    const divVal = one.divide(0.2);
    expect(divVal.x).toBe(floor(one.x / 0.2));
    expect(divVal.y).toBe(floor(one.y / 0.2));

    const divTwoVal = one.divide(3, 20);
    expect(divTwoVal.x).toBe(floor(one.x / 3));
    expect(divTwoVal.y).toBe(floor(one.y / 20));

    // Multiply
    const multPos = one.multiply(two);
    expect(multPos.x).toBe(floor(one.x * two.x));
    expect(multPos.y).toBe(floor(one.y * two.y));

    const multVal = one.multiply(10);
    expect(multVal.x).toBe(floor(one.x * 10));
    expect(multVal.y).toBe(floor(one.y * 10));

    const multTwoVal = one.multiply(0.5, 20);
    expect(multTwoVal.x).toBe(floor(one.x * 0.5));
    expect(multTwoVal.y).toBe(floor(one.y * 20));

    // Original unchanged
    expect(one.x).toBe(80);
    expect(one.y).toBe(90);

    expect(two.x).toBe(60);
    expect(two.y).toBe(70);
});

test("Position distance", () => {
    const pos = new Position(20, -10);
    const pos2 = new Position(pos.x + 30, pos.y + 40); // 3² + 4² = 5²

    const dist = pos.distance(pos2);
    expect(dist).toBe(50);
    expect(pos2.distance(pos)).toBe(dist);
});

test("Position average", () => {
    const points = (new Array(10)).fill().map((p, index) => new Position(index, index * 7));
    const average = Position.average(points);

    expect(average instanceof Position).toBe(true);
    const avr = 4.5;
    expect(average.x).toBe(Math.floor(avr));
    expect(average.y).toBe(Math.floor(avr * 7));
});
