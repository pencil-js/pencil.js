import { test, expect, beforeEach } from "vitest";


let context: any;
import Star from "./star.js";
import almostEqual from "../test/_almost-equal.js";

beforeEach(() => {
    context = new Star([10, 20], 6, 11, 0.2);
});

test("constructor", () => {
    expect(context.nbBranches).toBe(6);
    expect(context.points.length).toBe(12);
    expect(context.radius).toBe(11);
    expect(context.bevelRatio).toBe(0.2);

    const defaultStar = new Star();
    expect(defaultStar.points.length).toBe(10);
    expect(defaultStar.bevelRatio).toBe(0.5);
});

const checkPointsDistance = () => {
    context.points.forEach((point, index) => {
        const distance = point.distance();
        const expected = context.radius * (index % 2 ? context.bevelRatio : 1);
        expect(almostEqual(distance, expected)).toBe(true);
    });
};

test("set nbBranches", () => {
    context.nbBranches = 4;
    expect(context.nbBranches).toBe(4);
    expect(context.points.length).toBe(8);
    checkPointsDistance();
});

test("set radius", () => {
    context.radius = 23;
    expect(context.radius).toBe(23);
    checkPointsDistance();
});

test("set bevel ratio", () => {
    context.bevelRatio = 0.5;
    expect(context.bevelRatio).toBe(0.5);
    checkPointsDistance();
});

test("toJSON", () => {
    const json = context.toJSON();

    expect(json.nbBranches).toBe(6);
    expect(json.bevelRatio).toBe(0.2);
    expect(json.nbSides).toBe(undefined);
    expect(json.constructor).toBe("Star");
});

test("from", () => {
    const definition = {
        nbBranches: 7,
        bevelRatio: 0.3,
    };
    const star = Star.from(definition);

    expect(star.points.length).toBe(14);
    expect(star.bevelRatio).toBe(0.3);
});
