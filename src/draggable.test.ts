import { test, expect, beforeEach, afterEach, describe } from "vitest";
import { drag } from "../test/_pointer.js";
import Container from "./container.js";
import Scene from "./scene.js";
import Component from "./component.js";
import Rectangle from "./rectangle.js";
import "./rotatable.js";
import "./draggable.js";

test("draggable", () => {
    expect(typeof Component.prototype.draggable).toBe("function");
    expect(Component.prototype.draggable.name).toBe("draggable");

    const rectangle = new Rectangle();
    const api = rectangle.draggable({
        constrain: [
            [0, 0],
            [10, 20],
        ],
    });
    api.x = true;
    api.y = true;
    api.constrain = [[1, 2], [10, 20]];
    api.stop();

    expect(() => {
        const element = new Rectangle();
        element.rotatable();
        element.draggable();
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

    test("drag and drop", async () => {
        const rectangle = new Rectangle([10, 10], 50, 50);
        scene.add(rectangle);
        rectangle.draggable();
        await rectangle.getScene();

        const events: Array<string> = [];
        rectangle.on(["grab", "drag", "drop"], event => events.push(event.name));
        expect(rectangle.options.cursor).toBe("grab");

        drag(scene, [20, 20], [70, 40]);
        expect(rectangle.position.equals([60, 30])).toBe(true);
        expect(events).toEqual(["grab", "drag", "drop"]);
        expect(rectangle.isDragged).toBe(false);
    });

    test("axis and constrain", async () => {
        const rectangle = new Rectangle([10, 10], 50, 50);
        scene.add(rectangle);
        const api = rectangle.draggable({
            y: false,
            constrain: [[0, 0], [30, 30]],
        });
        await rectangle.getScene();

        drag(scene, [20, 20], [120, 120]);
        expect(rectangle.position.equals([30, 10])).toBe(true);

        api.y = true;
        api.constrain = null;
        drag(scene, [40, 20], [50, 50]);
        expect(rectangle.position.equals([40, 40])).toBe(true);

        api.stop();
        drag(scene, [50, 50], [100, 100]);
        expect(rectangle.position.equals([40, 40])).toBe(true);
    });

    test("inside a rotated and scaled parent", async () => {
        const parent = new Container([200, 200], {
            rotation: 0.25,
            scale: 2,
        });
        const rectangle = new Rectangle([0, 0], 20, 20);
        parent.add(rectangle);
        scene.add(parent);
        rectangle.draggable();
        await rectangle.getScene();

        // Rectangle is drawn at [160, 200] to [200, 240] on screen
        drag(scene, [180, 220], [180, 260]);
        // Moving 40px down on screen is moving 20px right in the parent space
        expect(rectangle.position.x).toBeCloseTo(20);
        expect(rectangle.position.y).toBeCloseTo(0);
    });
});
