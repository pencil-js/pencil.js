import { afterEach, describe, expect, test, vi } from "vitest";
import Button from "../src/button.js";
import Circle from "../src/circle.js";
import Color from "../src/color.js";
import Image from "../src/image.js";
import MouseEvent from "../src/mouse-event.js";
import NetworkEvent from "../src/network-event.js";
import Particles from "../src/particles.js";
import Position from "../src/position.js";
import Rectangle from "../src/rectangle.js";
import Scene from "../src/scene.js";
import Select from "../src/select.js";
import { from } from "../src/index.js";
import { toStyle } from "../src/internal/canvas.js";
import { getSandbox } from "../src/internal/canvas.js";
import pointer from "./_pointer.js";

// Bugs found during the v4 review

describe("serialization", () => {
    test("Color fill survives a JSON round trip", () => {
        const rectangle = new Rectangle([1, 2], 10, 10, {
            fill: new Color("#ff0000"),
        });
        const copy = from<Rectangle>(JSON.parse(JSON.stringify(rectangle)));
        const ctx = getSandbox();
        ctx.fillStyle = toStyle(copy.options.fill!, ctx);
        expect(ctx.fillStyle).toBe("#ff0000");
    });

    test("color arrays with alpha", () => {
        expect(toStyle([1, 0.5, 0, 0.25], getSandbox())).toBe("rgba(255, 127.5, 0, 0.25)");
    });

    test("default shadow is not serialized", () => {
        expect(new Rectangle().toJSON().options).toBe(undefined);
    });

    test("Select.from respect subclasses", () => {
        class MySelect extends Select {}
        expect(MySelect.from(new MySelect([0, 0], ["a", "b"]).toJSON())).toBeInstanceOf(MySelect);
    });
});

test("clone doesn't share positions", () => {
    const circle = new Circle([0, 0], 10, {
        rotationCenter: [5, 5],
        origin: [1, 1],
        shadow: {
            position: [2, 2],
        },
    });
    const copy = circle.clone();
    const { rotationCenter, origin, shadow } = copy.options;
    expect(rotationCenter).not.toBe(circle.options.rotationCenter);
    expect(origin).not.toBe(circle.options.origin);
    expect(shadow.position).not.toBe(circle.options.shadow.position);
    expect((shadow.position as Position).toJSON()).toEqual([2, 2]);
});

test("Position.from(null) has a clear error", () => {
    expect(() => Position.from(null as unknown as undefined)).toThrow("Unexpected type for position: null.");
});

describe("scene", () => {
    let scene: Scene;
    afterEach(() => scene.destroy());

    test("rendering out of the loop doesn't start another loop", () => {
        const request = vi.spyOn(window, "requestAnimationFrame");
        const cancel = vi.spyOn(window, "cancelAnimationFrame");
        scene = new Scene();
        scene.startLoop();
        scene.render();
        scene.getImageData();
        // Each extra request cancelled the previous one
        expect(request.mock.calls.length - cancel.mock.calls.length).toBe(1);
        request.mockRestore();
        cancel.mockRestore();
    });

    test("no click after pressing an element and releasing on another", () => {
        scene = new Scene();
        scene.ctx.canvas.width = 200;
        scene.ctx.canvas.height = 100;
        const first = new Rectangle([0, 0], 50, 50);
        const second = new Rectangle([100, 0], 50, 50);
        scene.add(first, second);
        const click = vi.fn();
        first.on(MouseEvent.events.click, click);

        pointer(scene, "pointerdown", 10, 10);
        pointer(scene, "pointermove", 110, 10);
        pointer(scene, "pointerup", 110, 10);
        expect(first.isClicked).toBe(false);

        pointer(scene, "pointerup", 10, 10);
        expect(click).not.toHaveBeenCalled();
    });
});

test("Button goes back to its normal fill when left while pressed", () => {
    const button = new Button([0, 0], {
        value: "Ok",
    });
    const normal = button.options.fill;
    button.fire(new MouseEvent(MouseEvent.events.hover, button));
    button.fire(new MouseEvent(MouseEvent.events.down, button));
    expect(button.options.fill).toBe(button.options.active);
    button.fire(new MouseEvent(MouseEvent.events.leave, button));
    expect(button.options.fill).toBe(normal);

    // Released while still hovered
    button.fire(new MouseEvent(MouseEvent.events.hover, button));
    button.fire(new MouseEvent(MouseEvent.events.down, button));
    button.fire(new MouseEvent(MouseEvent.events.up, button));
    expect(button.options.fill).toBe(button.options.hover);
});

test("Particles updater receives the arguments", () => {
    const updater = vi.fn();
    const particles = new Particles([0, 0], new Circle(undefined, 1), undefined, updater, {
        args: ["a", 1],
    });
    particles.generate(1);
    particles.update();
    expect(updater).toHaveBeenCalledWith(particles.data[0], 0, "a", 1);
});

test("Image ignores an outdated image element", () => {
    const element = window.document.createElement("img");
    const image = new Image([0, 0], element);
    const ready = vi.fn();
    image.on(NetworkEvent.events.ready, ready);
    image.url = null;
    element.dispatchEvent(new window.Event("load"));
    expect(image.isLoaded).toBe(false);
    expect(ready).not.toHaveBeenCalled();
});
