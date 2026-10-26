import { test, expect, beforeEach } from "vitest";


let context: any;
import Position from "./position.js";
import Vector from "./vector.js";

beforeEach(() => {
    context = new Vector([10, 100], [40, 140]);
});

test("constructor", () => {
    expect(context.start.x).toBe(10);
    expect(context.start.y).toBe(100);
    expect(context.end.x).toBe(40);
    expect(context.end.y).toBe(140);
});

test("get width and height", () => {
    expect(context.width).toBe(30);
    expect(context.height).toBe(40);
});

test("length", () => {
    expect(context.length).toBe(50);
});

test("clone and equal", () => {
    const clone = context.clone();

    expect(context).not.toBe(clone);
    expect(context.start).not.toBe(clone.start);
    expect(context.end).not.toBe(clone.end);

    expect(context.equals(clone)).toBe(true);
    expect(context.equals([[10, 100], [40, 140]])).toBe(true);
});

test("getDelta", () => {
    const delta = context.getDelta();

    expect(delta.x).toBe(30);
    expect(delta.y).toBe(40);
});

test("add", () => {
    const addValue = context.clone().add(20);
    expect(addValue.start.x).toBe(10);
    expect(addValue.start.y).toBe(100);
    expect(addValue.end.x).toBe(60);
    expect(addValue.end.y).toBe(160);

    const addPositionD = context.clone().add([20, 30]);
    expect(addPositionD.start.x).toBe(10);
    expect(addPositionD.start.y).toBe(100);
    expect(addPositionD.end.x).toBe(60);
    expect(addPositionD.end.y).toBe(170);

    const addPosition = context.clone().add(new Position(20, 30));
    expect(addPosition.start.x).toBe(10);
    expect(addPosition.start.y).toBe(100);
    expect(addPosition.end.x).toBe(60);
    expect(addPosition.end.y).toBe(170);

    const addVectorDefinition = context.clone().add([[20, 30], [40, 60]]);
    expect(addVectorDefinition.start.x).toBe(10);
    expect(addVectorDefinition.start.y).toBe(100);
    expect(addVectorDefinition.end.x).toBe(60);
    expect(addVectorDefinition.end.y).toBe(170);

    const addVector = context.clone().add(new Vector([120, 130], [150, 170]));
    expect(addVector.start.x).toBe(10);
    expect(addVector.start.y).toBe(100);
    expect(addVector.end.x).toBe(70);
    expect(addVector.end.y).toBe(180);
});

test("translate", () => {
    const translateValue = context.clone().translate(20);
    expect(translateValue.start.x).toBe(30);
    expect(translateValue.start.y).toBe(120);
    expect(translateValue.end.x).toBe(60);
    expect(translateValue.end.y).toBe(160);

    const translatePosition = context.clone().translate([20, 30]);
    expect(translatePosition.start.x).toBe(30);
    expect(translatePosition.start.y).toBe(130);
    expect(translatePosition.end.x).toBe(60);
    expect(translatePosition.end.y).toBe(170);

    const translateVector = context.clone().translate([[20, 30], [40, 60]]);
    expect(translateVector.start.x).toBe(30);
    expect(translateVector.start.y).toBe(130);
    expect(translateVector.end.x).toBe(60);
    expect(translateVector.end.y).toBe(170);
});

test("multiply", () => {
    const multiplyValue = context.clone().multiply(3);
    expect(multiplyValue.start.x).toBe(10);
    expect(multiplyValue.start.y).toBe(100);
    expect(multiplyValue.end.x).toBe(100);
    expect(multiplyValue.end.y).toBe(220);

    // v4: multiplying by a position scale the vector's delta (start stays in place)
    const multiplyPosition = context.clone().multiply([2, 3]);
    expect(multiplyPosition.start.x).toBe(10);
    expect(multiplyPosition.start.y).toBe(100);
    expect(multiplyPosition.end.x).toBe(70);
    expect(multiplyPosition.end.y).toBe(220);

    const multiplyVector = context.clone().multiply([[2, 3], [4, 6]]);
    expect(multiplyVector.start.x).toBe(10);
    expect(multiplyVector.start.y).toBe(100);
    expect(multiplyVector.end.x).toBe(70);
    expect(multiplyVector.end.y).toBe(220);
});

test("intersect", () => {
    const intersect = new Vector([0, 120], [30, 120]);
    const donnot = new Vector([10, 90], [20, 110]);

    expect(context.intersect(context)).toBe(true);
    expect(context.intersect([[0, 120], [30, 120]])).toBe(true);
    expect(context.intersect(intersect)).toBe(true);
    expect(context.intersect(donnot)).toBe(false);
});

test("getIntersectionPoint", () => {
    const intersect = new Vector([0, 120], [30, 120]);
    const donnot = new Vector([10, 90], [20, 110]);

    expect(context.getIntersectionPoint(context)).toEqual(new Position(25, 120));
    expect(context.getIntersectionPoint([[0, 120], [30, 120]])).toEqual(new Position(25, 120));
    expect(context.getIntersectionPoint(intersect)).toEqual(new Position(25, 120));
    expect(context.getIntersectionPoint(donnot)).toBe(null);
});

test("getClosestToPoint", () => {
    const onAB = context.getClosestToPoint([25, 120]);
    const above = context.getClosestToPoint([0, 120]);
    const outOfA = context.getClosestToPoint([-20, 0]);
    const outOfB = context.getClosestToPoint([30, 200]);

    expect(above).toEqual(new Position(16, 108));
    expect(onAB).toEqual(new Position(25, 120));
    expect(outOfA).toEqual(context.start);
    expect(outOfB).toEqual(context.end);
});

test("toJSON", () => {
    expect(context.toJSON()).toEqual([[10, 100], [40, 140]]);
});

test("from", () => {
    expect(context).toBe(Vector.from(context));

    const fromUndefined = Vector.from();
    expect(fromUndefined.start.x).toBe(0);
    expect(fromUndefined.start.y).toBe(0);
    expect(fromUndefined.end.x).toBe(0);
    expect(fromUndefined.end.y).toBe(0);

    const fromArray = Vector.from([
        [10, 20],
        [30, 40],
    ]);
    expect(fromArray.start.x).toBe(10);
    expect(fromArray.start.y).toBe(20);
    expect(fromArray.end.x).toBe(30);
    expect(fromArray.end.y).toBe(40);

    const formArrayPosition = Vector.from([
        new Position(11, 22),
        new Position(33, 44),
    ]);
    expect(formArrayPosition.start.x).toBe(11);
    expect(formArrayPosition.start.y).toBe(22);
    expect(formArrayPosition.end.x).toBe(33);
    expect(formArrayPosition.end.y).toBe(44);

    const fromObject = Vector.from({
        start: [1, 2],
        end: [3, 4],
    });
    expect(fromObject.start.x).toBe(1);
    expect(fromObject.start.y).toBe(2);
    expect(fromObject.end.x).toBe(3);
    expect(fromObject.end.y).toBe(4);

    expect(() => Vector.from(null)).toThrow();
});
