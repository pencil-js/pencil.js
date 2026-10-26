/**
 * Behaviors fixed or added in v4
 */
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import pointer, { drag } from "./_pointer.js";
import {
    Button,
    Checkbox,
    Circle,
    Color,
    Container,
    EventEmitter,
    Knob,
    LinearGradient,
    Math as PencilMath,
    Navigation,
    Path,
    Pie,
    Position,
    Rectangle,
    Scene,
    Select,
    Slider,
    Square,
    Star,
    Text,
    from,
} from "../src/index.js";
import BaseEvent from "../src/base-event.js";

describe("math", () => {
    test("modulo with negative multiple", () => {
        expect(PencilMath.modulo(-6, 3)).toBe(0);
        expect(PencilMath.modulo(-1, 3)).toBe(2);
        expect(PencilMath.modulo(5, -3)).toBe(-1);
    });

    test("truncate large numbers", () => {
        expect(PencilMath.truncate(2 ** 40 + 0.5)).toBe(2 ** 40);
    });
});

describe("color", () => {
    test("hex number with leading zeros", () => {
        expect(new Color(0x00ff00).hex).toBe("#00ff00");
        expect(new Color(0x000012).hex).toBe("#000012");
    });

    test("keep alpha from CSS strings", () => {
        expect(new Color("rgba(0, 0, 0, 0.5)").alpha).toBe(0.5);
        expect(new Color("rgba(0, 0, 0, 0.5)", 0.2).alpha).toBe(0.2);
    });

    test("round-trip through JSON", () => {
        const color = new Color(0.2, 0.4, 0.6, 0.8);
        const copy = Color.from(color.toJSON());
        expect(copy.hex).toBe(color.hex);
        expect(copy.alpha).toBe(0.8);
    });
});

describe("event emitter", () => {
    test("once", () => {
        const emitter = new EventEmitter();
        const listener = vi.fn();
        emitter.once("test", listener);
        emitter.fire(new BaseEvent("test", emitter));
        emitter.fire(new BaseEvent("test", emitter));
        expect(listener).toHaveBeenCalledTimes(1);
    });

    test("remove unknown listener", () => {
        const emitter = new EventEmitter();
        expect(() => emitter.removeListener("nothing", () => {})).not.toThrow();
    });
});

describe("container", () => {
    test("climbAncestry stops", () => {
        const root = new Container();
        const child = new Container();
        const grandChild = new Container();
        root.add(child);
        child.add(grandChild);
        const visited: Array<Container> = [];
        grandChild.climbAncestry(one => visited.push(one), root);
        expect(visited).toEqual([grandChild, child]);
    });

    test("can't contain an ancestor", () => {
        const root = new Container();
        const child = new Container();
        root.add(child);
        expect(() => child.add(root)).toThrow(RangeError);
    });

    test("clone keeps children", () => {
        const root = new Container([1, 2], {
            rotation: 0.1,
        });
        root.add(new Circle([3, 4], 5, {
            fill: "red",
        }));
        const copy = root.clone();
        expect(copy).not.toBe(root);
        expect(copy.options.rotation).toBe(0.1);
        expect(copy.children.length).toBe(1);
        expect(copy.children[0]).toBeInstanceOf(Circle);
        expect((copy.children[0] as Circle).radius).toBe(5);
        expect(copy.children[0]).not.toBe(root.children[0]);
    });

    test("getScene resolves once an ancestor is attached", async () => {
        const scene = new Scene();
        const parent = new Container();
        const child = new Container();
        parent.add(child);
        const promise = child.getScene();
        scene.add(parent);
        expect(await promise).toBe(scene);
        // Already attached
        expect(await child.getScene()).toBe(scene);
        expect(await new Container().getScene().constructor).toBe(Promise);
        scene.destroy();
    });
});

describe("hit-testing", () => {
    let scene: Scene;
    beforeEach(() => {
        scene = new Scene();
        scene.width = 200;
        scene.height = 200;
    });
    afterEach(() => {
        scene.destroy();
    });

    test("clipped area can't be targeted", () => {
        const container = new Container([0, 0], {
            clip: new Rectangle([10, 10], 50, 50),
        });
        const big = new Rectangle([0, 0], 200, 200);
        container.add(big);
        scene.add(container);

        expect(scene.getTarget(new Position(20, 20), scene.ctx)).toBe(big);
        expect(scene.getTarget(new Position(100, 100), scene.ctx)).toBe(scene);
    });

    test("rotated and scaled shapes", () => {
        const square = new Square([100, 100], 20, {
            rotation: 0.125,
            scale: 2,
        });
        scene.add(square);
        expect(scene.getTarget(square.position.clone().add(0, 50), scene.ctx)).toBe(square);
        expect(scene.getTarget(square.position.clone().add(30, 5), scene.ctx)).toBe(scene);
    });
});

describe("serialization", () => {
    test("whole scene round-trip", () => {
        const scene = new Scene(undefined, {
            fill: "#123456",
        });
        const group = new Container([10, 10]);
        group.add(
            new Circle([0, 0], 10, {
                fill: new LinearGradient([0, 0], [10, 0], {
                    0: "red",
                    1: new Color("blue"),
                }),
            }),
            new Pie([5, 5], 20, 0.1, 0.6),
            new Star([1, 1], 6, 10, 0.3),
            new Path([0, 0], [Path.lineTo([10, 10]), Path.halfTo([20, 0])]),
            new Text([0, 0], "Hello", {
                bold: true,
            }),
        );
        scene.add(group);

        const json = JSON.parse(JSON.stringify(scene));
        const copy = from<Scene>(json);

        expect(copy).toBeInstanceOf(Scene);
        expect(copy.options.fill).toBe("#123456");
        const [circle, pie, star, path, text] = copy.children[0].children as [Circle, Pie, Star, Path, Text];
        expect(circle.options.fill).toBeInstanceOf(LinearGradient);
        expect(pie).toBeInstanceOf(Pie);
        expect(pie.radius).toBe(20);
        expect(pie.endAngle).toBe(0.6);
        expect(star.nbBranches).toBe(6);
        expect(star.bevelRatio).toBe(0.3);
        expect(path.instructions.length).toBe(2);
        expect(text.text).toBe("Hello");
        expect(text.options.bold).toBe(true);
        expect(JSON.parse(JSON.stringify(copy))).toEqual(json);

        scene.destroy();
        copy.destroy();
    });

    test("unknown class", () => {
        expect(() => from({
            constructor: "Unknown",
        })).toThrow(ReferenceError);
    });
});

describe("text", () => {
    test("ready event can be listened after construction", async () => {
        const text = new Text([0, 0], "Hi");
        const listener = vi.fn();
        text.on("ready", listener);
        await Promise.resolve();
        expect(listener).toHaveBeenCalledTimes(1);
    });
});

describe("navigation", () => {
    test("back with empty history", () => {
        expect(Navigation.back()).toBe(null);
    });

    test("prepare, change and go back", () => {
        const canvas = window.document.createElement("canvas");
        const scenes = Navigation.prepareScenes({
            first: () => {},
            second: () => {},
        }, canvas);
        expect(Navigation.getCurrentScene()).toBe(scenes.first);
        expect(scenes.first.isLooped).toBe(true);

        scenes.first.fire(new BaseEvent(Scene.events.change, "second"));
        expect(Navigation.getCurrentScene()).toBe(scenes.second);
        expect(scenes.first.isLooped).toBe(false);
        expect(scenes.first.options.shown).toBe(false);

        expect(Navigation.back()).toBe(scenes.first);
        expect(Navigation.getCurrentScene()).toBe(scenes.first);
        scenes.first.destroy();
        scenes.second.destroy();
    });
});

describe("inputs", () => {
    let scene: Scene;
    beforeEach(() => {
        scene = new Scene();
        scene.width = 400;
        scene.height = 400;
    });
    afterEach(() => {
        scene.destroy();
    });

    test("checkbox toggles on click", () => {
        const checkbox = new Checkbox([10, 10]);
        scene.add(checkbox);
        const change = vi.fn();
        checkbox.on("change", change);
        pointer(scene, "pointerdown", 15, 15);
        pointer(scene, "pointerup", 15, 15);
        expect(checkbox.value).toBe(true);
        expect(change).toHaveBeenCalledTimes(1);

        checkbox.size = 40;
        expect(checkbox.width).toBe(40);
        expect(checkbox.fill.size).toBe(24);
    });

    test("button shows feedback when pressed", () => {
        const button = new Button([10, 10], {
            value: "Click",
        });
        scene.add(button);
        const { fill, active } = button.options;
        pointer(scene, "pointerdown", 15, 15);
        expect(button.options.fill).toBe(active);
        pointer(scene, "pointerup", 15, 15);
        expect(button.options.fill).not.toBe(active);
        expect([fill, Button.defaultOptions.hover]).toContain(button.options.fill);
    });

    test("slider click and drag", async () => {
        const slider = new Slider([0, 0], {
            min: 0,
            max: 100,
            width: 220,
        });
        scene.add(slider);
        await slider.getScene();

        pointer(scene, "pointerdown", 110, 10);
        pointer(scene, "pointerup", 110, 10);
        expect(slider.value).toBeCloseTo(50);
        // Handle stay vertically centered
        expect(slider.handle.position.y).toBe(10);

        drag(scene, [110, 10], [400, 300]);
        expect(slider.value).toBeCloseTo(100);
        expect(slider.handle.position.y).toBe(10);

        slider.width = 420;
        expect(slider.value).toBeCloseTo(100);
        expect(slider.handle.position.x).toBeCloseTo(420 - 10);
    });

    test("select pick an option", async () => {
        const select = new Select([0, 0], ["one", "two", "three"]);
        scene.add(select);
        const change = vi.fn();
        select.on("change", change);
        scene.render();

        pointer(scene, "pointerdown", 5, 5);
        pointer(scene, "pointerup", 5, 5);
        expect(select.optionsContainer.options.shown).toBe(true);

        // Click on the third option
        const third = select.optionsContainer.children[2];
        const target = third.getAbsolutePosition().add(5, 5);
        pointer(scene, "pointerdown", target.x, target.y);
        pointer(scene, "pointerup", target.x, target.y);
        expect(select.value).toBe(2);
        expect(select.display.text).toBe("three");
        expect(change).toHaveBeenCalledTimes(1);
        expect(select.optionsContainer.options.shown).toBe(false);
    });

    test("knob value", () => {
        const knob = new Knob([100, 100], {
            min: 0,
            max: 10,
            value: 2.5,
        });
        expect(knob.options.rotation).toBeCloseTo(0.25);
        expect(knob.value).toBeCloseTo(2.5);
    });

    test("resizable rectangle", async () => {
        const rectangle = new Rectangle([10, 10], 100, 50);
        scene.add(rectangle);
        rectangle.resizable();
        await rectangle.getScene();
        const resize = vi.fn();
        rectangle.on("resize", resize);

        drag(scene, [107, 57], [157, 87]);
        expect(rectangle.width).toBeCloseTo(150);
        expect(rectangle.height).toBeCloseTo(80);
        expect(resize).toHaveBeenCalled();

        // Handle follow external changes
        rectangle.width = 20;
        scene.render();
        expect(rectangle.children[0].position.x).toBe(20);
    });
});
