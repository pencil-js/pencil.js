import test from "ava";
import Vector from ".";
import Position from "../position";

test.beforeEach((t) => {
    t.context = new Vector([10, 100], [40, 140]);
});

test("constructor", (t) => {
    t.is(t.context.start.x, 10);
    t.is(t.context.start.y, 100);
    t.is(t.context.end.x, 40);
    t.is(t.context.end.y, 140);
});

test("get width and height", (t) => {
    t.is(t.context.width, 30);
    t.is(t.context.height, 40);
});

test("length", (t) => {
    t.is(t.context.length, 50);
});

test("clone and equal", (t) => {
    const clone = t.context.clone();

    t.not(t.context, clone);
    t.not(t.context.start, clone.start);
    t.not(t.context.end, clone.end);

    t.true(t.context.equals(clone));
    t.true(t.context.equals([[10, 100], [40, 140]]));
});

test("getDelta", (t) => {
    const delta = t.context.getDelta();

    t.is(delta.x, 30);
    t.is(delta.y, 40);
});

test("add", (t) => {
    const addValue = t.context.clone().add(20);
    t.is(addValue.start.x, 10);
    t.is(addValue.start.y, 100);
    t.is(addValue.end.x, 60);
    t.is(addValue.end.y, 160);

    const addPositionD = t.context.clone().add([20, 30]);
    t.is(addPositionD.start.x, 10);
    t.is(addPositionD.start.y, 100);
    t.is(addPositionD.end.x, 60);
    t.is(addPositionD.end.y, 170);

    const addPosition = t.context.clone().add(new Position(20, 30));
    t.is(addPosition.start.x, 10);
    t.is(addPosition.start.y, 100);
    t.is(addPosition.end.x, 60);
    t.is(addPosition.end.y, 170);

    const addVectorDefinition = t.context.clone().add([[20, 30], [40, 60]]);
    t.is(addVectorDefinition.start.x, 10);
    t.is(addVectorDefinition.start.y, 100);
    t.is(addVectorDefinition.end.x, 60);
    t.is(addVectorDefinition.end.y, 170);

    const addVector = t.context.clone().add(new Vector([120, 130], [150, 170]));
    t.is(addVector.start.x, 10);
    t.is(addVector.start.y, 100);
    t.is(addVector.end.x, 70);
    t.is(addVector.end.y, 180);
});

test("translate", (t) => {
    const translateValue = t.context.clone().translate(20);
    t.is(translateValue.start.x, 30);
    t.is(translateValue.start.y, 120);
    t.is(translateValue.end.x, 60);
    t.is(translateValue.end.y, 160);

    const translatePosition = t.context.clone().translate([20, 30]);
    t.is(translatePosition.start.x, 30);
    t.is(translatePosition.start.y, 130);
    t.is(translatePosition.end.x, 60);
    t.is(translatePosition.end.y, 170);

    const translateVector = t.context.clone().translate([[20, 30], [40, 60]]);
    t.is(translateVector.start.x, 30);
    t.is(translateVector.start.y, 130);
    t.is(translateVector.end.x, 60);
    t.is(translateVector.end.y, 170);
});

test("multiply", (t) => {
    const multiplyValue = t.context.clone().multiply(3);
    t.is(multiplyValue.start.x, 10);
    t.is(multiplyValue.start.y, 100);
    t.is(multiplyValue.end.x, 100);
    t.is(multiplyValue.end.y, 220);

    const multiplyPosition = t.context.clone().multiply([2, 3]);
    t.is(multiplyPosition.start.x, 10);
    t.is(multiplyPosition.start.y, 100);
    t.is(multiplyPosition.end.x, 80);
    t.is(multiplyPosition.end.y, 420);

    const multiplyVector = t.context.clone().multiply([[2, 3], [4, 6]]);
    t.is(multiplyVector.start.x, 10);
    t.is(multiplyVector.start.y, 100);
    t.is(multiplyVector.end.x, 80);
    t.is(multiplyVector.end.y, 420);
});

test("intersect", (t) => {
    const intersect = new Vector([0, 120], [30, 120]);
    const donnot = new Vector([10, 90], [20, 110]);

    t.true(t.context.intersect(t.context));
    t.true(t.context.intersect([[0, 120], [30, 120]]));
    t.true(t.context.intersect(intersect));
    t.false(t.context.intersect(donnot));
});

test("getClosestToPoint", (t) => {
    const onAB = t.context.getClosestToPoint([25, 120]);
    const above = t.context.getClosestToPoint([0, 120]);
    const outOfA = t.context.getClosestToPoint([-20, 0]);
    const outOfB = t.context.getClosestToPoint([30, 200]);

    t.deepEqual(above, new Position(16, 108));
    t.deepEqual(onAB, new Position(25, 120));
    t.deepEqual(outOfA, t.context.start);
    t.deepEqual(outOfB, t.context.end);
});

test("toJSON", (t) => {
    t.deepEqual(t.context.toJSON(), [t.context.start, t.context.end]);
});

test("from", (t) => {
    t.is(t.context, Vector.from(t.context));

    const fromUndefined = Vector.from();
    t.is(fromUndefined.start.x, 0);
    t.is(fromUndefined.start.y, 0);
    t.is(fromUndefined.end.x, 0);
    t.is(fromUndefined.end.y, 0);

    const fromArray = Vector.from([
        [10, 20],
        [30, 40],
    ]);
    t.is(fromArray.start.x, 10);
    t.is(fromArray.start.y, 20);
    t.is(fromArray.end.x, 30);
    t.is(fromArray.end.y, 40);

    const formArrayPosition = Vector.from([
        new Position(11, 22),
        new Position(33, 44),
    ]);
    t.is(formArrayPosition.start.x, 11);
    t.is(formArrayPosition.start.y, 22);
    t.is(formArrayPosition.end.x, 33);
    t.is(formArrayPosition.end.y, 44);

    const fromObject = Vector.from({
        start: [1, 2],
        end: [3, 4],
    });
    t.is(fromObject.start.x, 1);
    t.is(fromObject.start.y, 2);
    t.is(fromObject.end.x, 3);
    t.is(fromObject.end.y, 4);

    t.throws(() => Vector.from(null));
});
