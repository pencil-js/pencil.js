import { test, expect, vi, beforeEach } from "vitest";
import almostEqual from "../test/_almost-equal.js";


let context: any;
import Rectangle from "./rectangle.js";
import Container from "./container.js";

beforeEach(() => {
    context = new Container([10, 20]);
});

/**
 * Add a new child and returns it
 * @param {Container} container - Any container
 * @param {PositionDefinition} position - Position definition for the child
 * @return {Container}
 */
function addHeir (container, position) {
    const child = new Container(position);
    container.add(child);
    return child;
}

test("constructor", () => {
    expect(context.position.x).toBe(10);
    expect(context.position.y).toBe(20);
    expect(context.options).toEqual(Container.defaultOptions);
    expect(context.children.length).toBe(0);
    expect(context.parent).toBe(null);
    expect(context.frameCount).toBe(0);
});

test("setOptions", () => {
    context.setOptions({
        opacity: 0.1,
    });
    expect(context.options.opacity).toBe(0.1);
    expect(context.options.zIndex).toBe(1);

    context.setOptions({
        rotationCenter: [10, 20],
    });
    expect(context.options.rotationCenter.x).toBe(10);
    expect(context.options.rotationCenter.y).toBe(20);

    context.setOptions({
        scale: [2, 3],
    });
    expect(context.options.scale.x).toBe(2);
    expect(context.options.scale.y).toBe(3);
});

test("isHover", () => {
    expect(context.isHover()).toBe(false);
    expect(context.isHover(context.position)).toBe(false);
});

test("add", () => {
    const child = addHeir(context);

    expect(context.children[0]).toBe(child);
    expect(child.parent).toBe(context);

    const grandChild = addHeir(child);

    expect(grandChild.parent).toBe(child);

    context.add(grandChild);

    expect(grandChild.parent).toBe(context);

    expect(() => context.add(context)).toThrow();
    expect(() => {
        const pseudoScene = new Container();
        pseudoScene.isScene = true;
        context.add(pseudoScene);
    }).toThrow();
});

test("remove", () => {
    const child = addHeir(context);
    const grandChild = addHeir(child);

    context.remove(grandChild);
    expect(context.children.length).toBe(1);
    expect(grandChild.parent).toBe(child);
    context.remove(null, child);
    expect(context.children.length).toBe(0);
    expect(child.parent).toBe(null);
});

test("empty", () => {
    const child = addHeir(context);
    context.empty();

    expect(context.children.length).toBe(0);
    expect(child.parent).toBe(null);
});

test("delete", () => {
    const parent = new Container();
    parent.add(context);

    context.delete();
    expect(context.parent).toBe(null);
    context.delete();
});

test("getScene", () => {
    expect(context.getScene() instanceof Promise).toBe(true);
});

test("getRoot", () => {
    expect(context.getRoot()).toBe(context);

    const child = addHeir(context);
    const grandChild = addHeir(child);

    expect(grandChild.getRoot()).toBe(context);
});

test("getAbsolutePosition", () => {
    const child = addHeir(context, [100, 200]);
    child.options.rotation = 0.5;
    const grandChild = addHeir(child, [10, 20]);

    const absolute = grandChild.getAbsolutePosition();
    expect(absolute.x).toBe(100);
    expect(absolute.y).toBe(200);
});

test("fire", () => {
    const child = addHeir(context);
    const grandChild = addHeir(child);

    expect.assertions(3);
    const oldFire = Container.prototype.fire;
    const fired = {
        name: "whatever",
        bubble: true,
    };
    const wrapper = function wrapper (...params) {
        expect(params[0]).toBe(fired);
        oldFire.apply(this, params);
    };
    context.fire = wrapper;
    child.fire = wrapper;
    grandChild.fire = wrapper;

    grandChild.fire(fired);
});

test("fire stopped", () => {
    const child = addHeir(context);
    const event = {
        name: "name",
        bubble: false,
    };
    context.fire = () => {
        expect.fail();
    };
    child.fire(event);
    expect(true).toBe(true);
});

test("getTarget", () => {
    const ctx = window.document.createElement("canvas").getContext("2d")!;
    expect(context.getTarget(context.position, ctx)).toBe(null);

    const child = addHeir(context);
    child.isHover = () => true;
    const grandChild = addHeir(child);
    grandChild.isHover = () => true;
    grandChild.options.zIndex = -1;
    addHeir(context);

    expect(context.getTarget(context.position, ctx)).toBe(child);

    context.options.shown = false;
    expect(context.getTarget(context.position, ctx)).toBe(null);
});

test("applyTransform", () => {
    context.options.clip = new Rectangle();
    context.options.rotation = 0.5;
    context.options.scale = 2;
    const ctx = {
        translate: () => {},
        clip: (...args: Array<unknown>) => expect(args.length).toBe(1),
        rotate: (...args: Array<unknown>) => expect(args).toEqual([Math.PI]),
        scale: (...args: Array<unknown>) => expect(args).toEqual([2, 2]),
    };
    expect.assertions(6);
    context.applyTransform(ctx);

    ctx.scale = (...args: Array<unknown>) => expect(args).toEqual([3, 4]);
    context.options.scale = [3, 4];
    context.applyTransform(ctx);
});

test("getMatrix and getAbsolutePosition", () => {
    context.position.set(10, 20);
    const child = addHeir(context);
    child.position.set(5, 0);
    expect(child.getAbsolutePosition().equals([15, 20])).toBe(true);

    context.options.scale = 2;
    expect(child.getAbsolutePosition().equals([20, 20])).toBe(true);

    context.options.scale = 1;
    context.options.rotation = 0.25;
    const rotated = child.getAbsolutePosition();
    expect(almostEqual(rotated.x, 10)).toBe(true);
    expect(almostEqual(rotated.y, 25)).toBe(true);

    const local = child.toLocal(rotated);
    expect(almostEqual(local.x, 0)).toBe(true);
    expect(almostEqual(local.y, 0)).toBe(true);
    const global = child.toGlobal([0, 0]);
    expect(almostEqual(global.x, 10)).toBe(true);
    expect(almostEqual(global.y, 25)).toBe(true);
});

test("render", () => {
    const child = addHeir(context);
    child.options.zIndex = -1;
    const otherChild = addHeir(context);
    otherChild.options.zIndex = 2;

    const ctx = window.document.createElement("canvas").getContext("2d")!;
    const order: Array<string> = [];
    child.makePath = () => {
        order.push("behind");
        return child;
    };
    context.makePath = () => {
        order.push("parent");
        return context;
    };
    otherChild.makePath = () => {
        order.push("front");
        return otherChild;
    };
    context.render(ctx);
    expect(order).toEqual(["behind", "parent", "front"]);
});

test("render set absolute transformations", () => {
    context.position.set(10, 20);
    context.options.rotation = 0.25;
    context.options.scale = 2;
    const child = addHeir(context);
    child.position.set(5, 0);

    const ctx = window.document.createElement("canvas").getContext("2d")!;
    ctx.translate(100, 0);
    let matrix: DOMMatrix | null = null;
    child.makePath = (param: CanvasRenderingContext2D) => {
        matrix = param.getTransform();
        return child;
    };
    context.render(ctx);

    // Same as the matrix computed with DOMMatrix, plus the context starting transformation
    const expected = new DOMMatrix().translateSelf(100, 0).multiplySelf(child.getAbsoluteMatrix());
    for (const key of ["a", "b", "c", "d", "e", "f"] as const) {
        expect(matrix![key]).toBeCloseTo(expected[key]);
    }
    expect(Array.from(child.worldMatrix).map(value => Math.round(value * 1000) / 1000)).toEqual([0, 2, -2, 0, 110, 30]);
    // Context is left untouched
    const after = ctx.getTransform();
    expect([after.a, after.e]).toEqual([1, 100]);
});

test("render only fire draw event when listened", () => {
    const child = addHeir(context);
    const spy = vi.spyOn(child, "fire");
    const ctx = window.document.createElement("canvas").getContext("2d")!;
    context.render(ctx);
    expect(spy).not.toHaveBeenCalled();

    let count = 0;
    context.on(Container.events.draw, () => count++);
    context.render(ctx);
    // Fired by both the context and the child (bubbling)
    expect(count).toBe(2);
});

test("render with option", () => {
    context.options.opacity = 0.5;
    const child = addHeir(context);
    child.options.opacity = 0.5;
    const grandChild = addHeir(child);

    const ctx = window.document.createElement("canvas").getContext("2d")!;
    let alpha = 0;
    grandChild.makePath = (param: CanvasRenderingContext2D) => {
        alpha = param.globalAlpha;
        return grandChild;
    };
    context.render(ctx);

    // Opacity is multiplied with ancestors opacity
    expect(alpha).toBe(0.25);
    expect(ctx.globalAlpha).toBe(1);
});

test("render if not shown", () => {
    context.options.shown = false;
    const ctx = {
        save: () => expect.fail(),
    };
    context.render(ctx);
    expect(true).toBe(true);
});

test("makePath", () => {
    expect(context.makePath()).toBe(context);
});

test("show and hide", () => {
    expect(context.options.shown).toBe(true);
    context.hide();
    expect(context.options.shown).toBe(false);
    context.show();
    expect(context.options.shown).toBe(true);
});

test("isAncestorOf", () => {
    const child = addHeir(context);
    const grandChild = addHeir(child);

    expect(context.isAncestorOf(grandChild)).toBe(true);
    expect(context.isAncestorOf(child)).toBe(true);
    expect(context.isAncestorOf(null)).toBe(false);
});

test("climbAncestry", () => {
    const child = addHeir(context);
    const grandChild = addHeir(child);

    const expected = [grandChild, child, context];
    let pointer = 0;
    expect.assertions(3);
    grandChild.climbAncestry(ancestor => expect(ancestor).toBe(expected[pointer++]));
});

test("setOpacity", () => {
    const ctx = {
        globalAlpha: 1,
    };

    Container.setOpacity(ctx, null);
    expect(ctx.globalAlpha).toBe(1);

    Container.setOpacity(ctx, 0.5);
    expect(ctx.globalAlpha).toBe(0.5);
});

test("toJSON", () => {
    const json = context.toJSON();

    expect(json.children).toBe(undefined);
    expect(json.position).toEqual([context.position.x, context.position.y]);
    expect(json.options).toBe(undefined);
    expect(json.constructor).toBe("Container");

    const specific = new Container([0, 0], {
        opacity: 0.5,
        rotationCenter: [10, 20],
    });
    addHeir(specific);
    const reJson = specific.toJSON();
    expect(reJson.options).toEqual({
        opacity: 0.5,
        rotationCenter: [10, 20],
    });
    expect(reJson.children.length).toBe(1);
});

test("clone", () => {
    const clone = context.clone();
    expect(clone instanceof Container).toBe(true);

    expect(context === clone).toBe(false);
    expect(context.options).toEqual(clone.options);
    expect(context.position).toEqual(clone.position);
});

test("from", () => {
    const definition = {
        position: [10, 20],
    };
    const container = Container.from(definition);

    expect(container.position.x).toBe(10);
    expect(container.position.y).toBe(20);
});

test("defaultOptions", () => {
    const options = Container.defaultOptions;
    expect(options.shown).toBe(true);
    expect(options.opacity).toBe(null);
    expect(options.rotation).toBe(0);
    expect(options.rotationCenter.x).toBe(0);
    expect(options.rotationCenter.y).toBe(0);
    expect(options.scale).toBe(1);
    expect(options.zIndex).toBe(1);
    expect(options.clip).toBe(null);
});

test("events", () => {
    expect(Container.events.attach).toBe("attach");
    expect(Container.events.detach).toBe("detach");
    expect(Container.events.draw).toBe("draw");
    expect(Container.events.show).toBe("show");
    expect(Container.events.hide).toBe("hide");
});

test("render ignore targeted listeners of ancestors", () => {
    const child = addHeir(context);
    const spy = vi.spyOn(child, "fire");
    const ctx = window.document.createElement("canvas").getContext("2d")!;
    let count = 0;
    context.on(Container.events.draw, () => count++, true);
    context.render(ctx);
    expect(count).toBe(1);
    expect(spy).not.toHaveBeenCalled();
});
