/* global test expect */

import Position from "@pencil.js/position";
import Vector from "./vector";

test("Vector creation", () => {
    const start = new Position(-22, 37);
    const end = new Position(41, -9);

    let vector = new Vector(start, end);
    expect(vector.start).toBe(start);
    expect(vector.end).toBe(end);

    vector = new Vector(start.x, start.y, end.x, end.y);
    expect(vector.start.equals(start)).toBe(true);
    expect(vector.end.equals(end)).toBe(true);
});

test("Vector length", () => {
    const vector = new Vector(100, -20, 130, 20);
    expect(vector.length()).toBe(50);
});

test("Vector clone and equal", () => {
    const vector = new Vector(42, -9, 55, 12.3);
    const clone = vector.clone();

    expect(clone).not.toBe(vector);
    expect(clone.start).not.toBe(vector.start);
    expect(clone.end).not.toBe(vector.end);
    expect(clone.equals(vector)).toBe(true);
});

test("Vector getDelta", () => {
    const vector = new Vector(22, -55, 22 + 42, -55 + 31);
    const delta = vector.getDelta();

    expect(delta instanceof Position).toBe(true);
    expect(delta.equals(new Position(42, 31))).toBe(true);
});

test("Vector add", () => {
    const vector = new Vector(10, 20, 100, 150);

    const addValue = vector.clone().add(10);
    expect(addValue.start.equals(vector.start)).toBe(true);
    expect(addValue.end.equals(new Position(vector.end.x + 10, vector.end.y + 10))).toBe(true);

    const addPosition = vector.clone().add(new Position(10, 20));
    expect(addPosition.start.equals(vector.start)).toBe(true);
    expect(addPosition.end.equals(new Position(vector.end.x + 10, vector.end.y + 20))).toBe(true);

    const addVector = vector.clone().add(new Vector(10, 20, 100, 200));
    expect(addVector.start.equals(vector.start)).toBe(true);
    expect(addVector.end.equals(new Position(vector.end.x + (100 - 10), vector.end.y + (200 - 20)))).toBe(true);
});

test("Vector translate", () => {
});

test("Vector intersect", () => {
    const vector1 = new Vector(2, 1, 3, 5);
    const vector2 = new Vector(3, 3, 4, 1);
    const vector3 = new Vector(1, 3, 4, 2);

    expect(vector1.intersect(vector2)).toBe(false);
    expect(vector1.intersect(vector3)).toBe(true);
    expect(vector2.intersect(vector3)).toBe(true);

    expect(vector2.intersect(vector1)).toBe(false);
    expect(vector3.intersect(vector1)).toBe(true);
    expect(vector3.intersect(vector2)).toBe(true);
});
