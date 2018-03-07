/* global test expect */

import Position from "./position";

test("creation", () => {
    const pos = new Position();

    expect(pos.x).toBe(0);
    expect(pos.y).toBe(0);

    const pos2 = new Position(42, 55.55);

    expect(pos2.x).toBe(42);
    expect(pos2.y).toBe(55);
});

test("set values", () => {
    const pos = new Position();
    pos.set(42, 55.55);

    expect(pos.x).toBe(42);
    expect(pos.y).toBe(55);

    pos.set(new Position(99.99, 1));

    expect(pos.x).toBe(99);
    expect(pos.y).toBe(1);
});

test("clone", () => {
    const pos = new Position(42, 55.55);
    const clone = pos.clone();

    expect(clone).not.toBe(pos);
    expect(clone.x).toBe(pos.x);
    expect(clone.y).toBe(pos.y);
});

test("Calculations", () => {
    const one = new Position(90, 90);
    const two = new Position(60, 60);

    const subPos = one.subtract(two);
    const subVal = one.subtract(10);
    const addPos = one.add(two);
    const addVal = one.add(10);

    expect(subPos.x).toBe(30);
    expect(subPos.y).toBe(30);

    expect(subVal.x).toBe(80);
    expect(subVal.y).toBe(80);

    expect(addPos.x).toBe(150);
    expect(addPos.y).toBe(150);

    expect(addVal.x).toBe(100);
    expect(addVal.y).toBe(100);

    // Original unchanged
    expect(one.x).toBe(90);
    expect(one.y).toBe(90);

    expect(two.x).toBe(60);
    expect(two.y).toBe(60);
});

test("distance", () => {
    const pos = new Position(20, -10);
    const pos2 = new Position(pos.x + 30, pos.y + 40); // 3² + 4² = 5²

    const dist = pos.distance(pos2);
    expect(dist).toBe(50);
    expect(pos2.distance(pos)).toBe(dist);
});

test("average", () => {
    const points = (new Array(10)).fill().map((p, index) => new Position(index, index * 7));
    const average = Position.average(points);

    expect(average instanceof Position).toBe(true);
    const avr = 4.5;
    expect(average.x).toBe(Math.floor(avr));
    expect(average.y).toBe(Math.floor(avr * 7));
});
