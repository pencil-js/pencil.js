import { test, expect, beforeEach, afterEach, vi } from "vitest";
import Component from "./component.js";
import Container from "./container.js";
import MouseEvent from "./mouse-event.js";
import KeyboardEvent from "./keyboard-event.js";
import Position from "./position.js";
import Rectangle from "./rectangle.js";
import Scene from "./scene.js";

let context: Scene;

const pointer = (type: string, x: number, y: number, init: Record<string, unknown> = {}) => {
    const EventClass = window.PointerEvent ?? window.MouseEvent;
    context.ctx.canvas.dispatchEvent(new EventClass(type, {
        clientX: x,
        clientY: y,
        bubbles: true,
        ...init,
    }));
};

beforeEach(() => {
    context = new Scene();
    context.ctx.canvas.width = 800;
    context.ctx.canvas.height = 600;
});

afterEach(() => {
    context.destroy();
});

test("constructor", () => {
    expect(context.ctx).toBeTruthy();
    expect(context.cursorPosition).toBeInstanceOf(Position);
    expect(context.isScene).toBe(true);
    expect(context.isLooped).toBe(false);
    expect(context.fps).toBe(0);
    expect(context.lastTick).toBe(null);
    expect(context.ctx.canvas.isConnected).toBe(true);
    expect(context.ctx.canvas.style.touchAction).toBe("none");
});

test("constructor with container", () => {
    const container = window.document.createElement("canvas");
    const scene = new Scene(container);
    expect(scene.ctx.canvas).toBe(container);
    scene.destroy();
});

test("constructor with any element", () => {
    const container = window.document.createElement("div");
    const scene = new Scene(container);
    expect(scene.ctx.canvas.parentElement).toBe(container);
    scene.destroy();
    expect(container.children.length).toBe(0);
});

test("setCursor", () => {
    context.setCursor("pointer");
    expect(context.ctx.canvas.style.cursor).toBe("pointer");
    context.setCursor();
    expect(context.ctx.canvas.style.cursor).toBe("default");
});

test("isHover", () => {
    expect(context.isHover()).toBe(true);
});

test("clear", () => {
    context.width = 2;
    context.height = 2;
    context.options.fill = "red";
    context.clear();

    const { data } = context.ctx.getImageData(0, 0, 1, 1);
    expect([...data]).toEqual([255, 0, 0, 255]);
});

test("render", () => {
    context.width = 10;
    context.height = 10;
    context.add(new Rectangle([0, 0], 5, 5, {
        fill: "#00f",
    }));
    context.render();
    const { data } = context.ctx.getImageData(2, 2, 1, 1);
    expect([...data]).toEqual([0, 0, 255, 255]);
});

test("startLoop and stopLoop", async () => {
    expect(context.isLooped).toBe(false);
    context.startLoop();
    expect(context.isLooped).toBe(true);
    await new Promise(resolve => setTimeout(resolve, 40));
    expect(context.fps > 0).toBe(true);
    const frames = context.frameCount;
    context.stopLoop();
    expect(context.isLooped).toBe(false);
    expect(context.fps === 0).toBe(true);
    await new Promise(resolve => setTimeout(resolve, 40));
    expect(context.frameCount).toBe(frames);
});

test("startLoop render fail", () => {
    const parent = new Container();
    const broken = new Rectangle();
    broken.trace = () => {
        throw new Error("Broken");
    };
    parent.add(broken);
    context.add(parent);
    expect(() => context.startLoop()).toThrow();
    expect(context.isLooped).toBe(false);
});

test("hide and show", () => {
    expect(context.options.shown).toBe(true);
    context.hide();
    expect(context.options.shown).toBe(false);
    expect(context.ctx.canvas.style.visibility).toBe("hidden");
    context.show();
    expect(context.options.shown).toBe(true);
    expect(context.ctx.canvas.style.visibility).toBe("");
});

test("from", () => {
    const scene = Scene.from({
        constructor: "Scene",
        position: [0, 0],
        options: {
            fill: "red",
        },
    });
    expect(scene instanceof Scene).toBe(true);
    expect(scene.options.fill).toBe("red");
    scene.destroy();
});

test("getDrawingContext", () => {
    const ctx = Scene.getDrawingContext({
        scrollWidth: 10,
        scrollHeight: 20,
    } as HTMLElement);
    expect(ctx.canvas.width).toBe(10);
    expect(ctx.canvas.height).toBe(20);
    expect(ctx.canvas.style.display).toBe("block");
});

test("defaultOptions", () => {
    expect(Scene.defaultOptions.cursor).toBe("default");
});

test("getEventPosition", () => {
    expect(context.getEventPosition({
        clientX: 12,
        clientY: 34,
    }).equals([12, 34])).toBe(true);

    // Canvas displayed at half its size
    vi.spyOn(context.ctx.canvas, "getBoundingClientRect").mockReturnValue({
        left: 10,
        top: 20,
        width: 400,
        height: 300,
    } as DOMRect);
    expect(context.getEventPosition({
        clientX: 110,
        clientY: 70,
    }).equals([200, 100])).toBe(true);
});

test("pointer interactions", () => {
    const rectangle = new Rectangle([10, 10], 50, 50, {
        cursor: Component.cursors.pointer,
    });
    context.add(rectangle);
    context.render();

    const events: Array<string> = [];
    const names = [
        MouseEvent.events.down,
        MouseEvent.events.up,
        MouseEvent.events.click,
        MouseEvent.events.move,
        MouseEvent.events.hover,
        MouseEvent.events.leave,
    ];
    rectangle.on(names, event => events.push(event.name), true);

    pointer("pointermove", 20, 20);
    expect(events).toEqual(["mousemove", "hover"]);
    expect(context.ctx.canvas.style.cursor).toBe("pointer");
    expect(context.cursorPosition.equals([20, 20])).toBe(true);

    events.length = 0;
    pointer("pointerdown", 20, 20, {
        button: 0,
    });
    pointer("pointerup", 20, 20, {
        button: 0,
    });
    expect(events).toEqual(["mousedown", "mouseup", "click"]);

    events.length = 0;
    pointer("pointermove", 200, 200);
    expect(events).toEqual(["leave"]);
    expect(context.ctx.canvas.style.cursor).toBe("default");
});

test("no click when moving too much", () => {
    const rectangle = new Rectangle([0, 0], 100, 100);
    context.add(rectangle);
    const click = vi.fn();
    rectangle.on(MouseEvent.events.click, click);

    pointer("pointerdown", 10, 10);
    pointer("pointermove", 50, 50);
    pointer("pointerup", 50, 50);
    expect(click).not.toHaveBeenCalled();
});

test("button modifiers", () => {
    const right = vi.fn();
    const left = vi.fn();
    context.on(`${MouseEvent.events.down}.${MouseEvent.buttons.right}`, right);
    context.on(`${MouseEvent.events.down}.${MouseEvent.buttons.left}`, left);

    pointer("pointerdown", 10, 10, {
        button: 2,
    });
    expect(right).toHaveBeenCalledTimes(1);
    expect(left).not.toHaveBeenCalled();
});

test("wheel", () => {
    const events: Array<string> = [];
    context.on([MouseEvent.events.scrollDown, MouseEvent.events.zoomOut, MouseEvent.events.scrollUp], event => events.push(event.name));
    context.ctx.canvas.dispatchEvent(new window.WheelEvent("wheel", {
        deltaY: 10,
    }));
    expect(events).toEqual(["scrolldown", "zoomout"]);
});

test("pointer leave canvas", () => {
    const rectangle = new Rectangle([0, 0], 100, 100);
    context.add(rectangle);
    const leave = vi.fn();
    rectangle.on(MouseEvent.events.leave, leave);
    pointer("pointermove", 10, 10);
    context.ctx.canvas.dispatchEvent(new window.MouseEvent("pointerleave", {
        clientX: -1,
        clientY: -1,
    }));
    expect(leave).toHaveBeenCalledTimes(1);
});

test("keyboard", () => {
    const listener = vi.fn();
    context.on(`${KeyboardEvent.events.down}.${KeyboardEvent.keys.enter}`, listener);
    window.document.dispatchEvent(new window.KeyboardEvent("keydown", {
        key: "Enter",
    }));
    window.document.dispatchEvent(new window.KeyboardEvent("keydown", {
        key: "a",
    }));
    expect(listener).toHaveBeenCalledTimes(1);
});

test("destroy", () => {
    const listener = vi.fn();
    context.on(KeyboardEvent.events.down, listener);
    const { canvas } = context.ctx;
    context.destroy();
    window.document.dispatchEvent(new window.KeyboardEvent("keydown", {
        key: "Enter",
    }));
    expect(listener).not.toHaveBeenCalled();
    expect(canvas.isConnected).toBe(false);
});

test("hidden scene ignore events", () => {
    const listener = vi.fn();
    context.on(MouseEvent.events.down, listener);
    context.hide();
    pointer("pointerdown", 10, 10);
    expect(listener).not.toHaveBeenCalled();
});
