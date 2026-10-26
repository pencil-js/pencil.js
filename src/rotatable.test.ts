import { test, expect, beforeEach, afterEach, describe } from "vitest";
import { drag } from "../test/_pointer.js";
import Circle from "./circle.js";
import Container from "./container.js";
import Scene from "./scene.js";
import Component from "./component.js";
import Rectangle from "./rectangle.js";
import "./draggable.js";
import "./rotatable.js";

test("rotatable", () => {
    expect(typeof Component.prototype.rotatable).toBe("function");
    expect(Component.prototype.rotatable.name).toBe("rotatable");

    const rectangle = new Rectangle();
    const api = rectangle.rotatable();
    api.stop();

    expect(() => {
        const element = new Rectangle();
        element.draggable();
        element.rotatable();
    }).toThrow();
});

describe("interactions", () => {
    let scene: Scene;
    beforeEach(() => {
        scene = new Scene();
        scene.width = 400;
        scene.height = 400;
    });
    afterEach(() => {
        scene.destroy();
    });

    test("rotate", async () => {
        const circle = new Circle([100, 100], 50);
        scene.add(circle);
        circle.rotatable();
        await circle.getScene();

        const events: Array<string> = [];
        circle.on(["grab", "rotate", "drop"], event => events.push(event.name));

        // From up to right is a quarter turn
        drag(scene, [100, 60], [140, 100]);
        expect(circle.options.rotation).toBeCloseTo(0.25);
        expect(events).toEqual(["grab", "rotate", "drop"]);
    });

    test("rotate around its rotation center inside a moved parent", async () => {
        const parent = new Container([100, 0]);
        const rectangle = new Rectangle([0, 100], 100, 100, {
            rotationCenter: [50, 50],
        });
        parent.add(rectangle);
        scene.add(parent);
        rectangle.rotatable();
        await rectangle.getScene();

        // Pivot is at [150, 150] on screen
        drag(scene, [150, 110], [110, 150]);
        // Counter-clockwise quarter turn
        expect(((rectangle.options.rotation % 1) + 1) % 1).toBeCloseTo(0.75);
    });
});
