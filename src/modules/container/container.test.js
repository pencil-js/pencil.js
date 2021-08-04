import test from "ava";
import Rectangle from "@pencil.js/rectangle";
import Container from "./container.js";

test.beforeEach((t) => {
    t.context = new Container([10, 20]);
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

test("constructor", (t) => {
    t.is(t.context.position.x, 10);
    t.is(t.context.position.y, 20);
    t.deepEqual(t.context.options, Container.defaultOptions);
    t.is(t.context.children.length, 0);
    t.is(t.context.parent, null);
    t.is(t.context.frameCount, 0);
});

test("setOptions", (t) => {
    t.context.setOptions({
        opacity: 0.1,
    });
    t.is(t.context.options.opacity, 0.1);
    t.is(t.context.options.zIndex, 1);

    t.context.setOptions({
        rotationCenter: [10, 20],
    });
    t.is(t.context.options.rotationCenter.x, 10);
    t.is(t.context.options.rotationCenter.y, 20);

    t.context.setOptions({
        scale: [2, 3],
    });
    t.is(t.context.options.scale.x, 2);
    t.is(t.context.options.scale.y, 3);
});

test("isHover", (t) => {
    t.false(t.context.isHover());
    t.false(t.context.isHover(t.context.position));
});

test("add", (t) => {
    const child = addHeir(t.context);

    t.is(t.context.children[0], child);
    t.is(child.parent, t.context);

    const grandChild = addHeir(child);

    t.is(grandChild.parent, child);

    t.context.add(grandChild);

    t.is(grandChild.parent, t.context);

    t.throws(() => t.context.add(t.context), {
        instanceOf: RangeError,
    });
    t.throws(() => {
        const pseudoScene = new Container();
        pseudoScene.isScene = true;
        t.context.add(pseudoScene);
    }, {
        instanceOf: RangeError,
    });
});

test("remove", (t) => {
    const child = addHeir(t.context);
    const grandChild = addHeir(child);

    t.context.remove(grandChild);
    t.is(t.context.children.length, 1);
    t.is(grandChild.parent, child);
    t.context.remove(null, child);
    t.is(t.context.children.length, 0);
    t.is(child.parent, null);
});

test("empty", (t) => {
    const child = addHeir(t.context);
    t.context.empty();

    t.is(t.context.children.length, 0);
    t.is(child.parent, null);
});

test("delete", (t) => {
    const parent = new Container();
    parent.add(t.context);

    t.context.delete();
    t.is(t.context.parent, null);
    t.context.delete();
});

test("getScene", (t) => {
    t.true(t.context.getScene() instanceof Promise);
});

test("getRoot", (t) => {
    t.is(t.context.getRoot(), t.context);

    const child = addHeir(t.context);
    const grandChild = addHeir(child);

    t.is(grandChild.getRoot(), t.context);
});

test("getAbsolutePosition", (t) => {
    const child = addHeir(t.context, [100, 200]);
    child.options.rotation = 0.5;
    const grandChild = addHeir(child, [10, 20]);

    const absolute = grandChild.getAbsolutePosition();
    t.is(absolute.x, 100);
    t.is(absolute.y, 200);
});

test("fire", (t) => {
    const child = addHeir(t.context);
    const grandChild = addHeir(child);

    t.plan(3);
    const oldFire = Container.prototype.fire;
    const fired = {
        name: "whatever",
        bubble: true,
    };
    const wrapper = function wrapper (...params) {
        t.is(params[0], fired);
        oldFire.apply(this, params);
    };
    t.context.fire = wrapper;
    child.fire = wrapper;
    grandChild.fire = wrapper;

    grandChild.fire(fired);
});

test("fire stopped", (t) => {
    const child = addHeir(t.context);
    const event = {
        name: "name",
        bubble: false,
    };
    t.context.fire = () => {
        t.fail();
    };
    child.fire(event);
    t.pass();
});

test("getTarget", (t) => {
    const ctx = new window.CanvasRenderingContext2D();
    t.is(t.context.getTarget(t.context.position, ctx), null);

    const child = addHeir(t.context);
    child.isHover = () => true;
    const grandChild = addHeir(child);
    grandChild.isHover = () => true;
    grandChild.options.zIndex = -1;
    addHeir(t.context);

    t.is(t.context.getTarget(t.context.position, ctx), child);

    t.context.options.shown = false;
    t.is(t.context.getTarget(t.context.position, ctx), null);
});

test("setContext", (t) => {
    t.context.options.clip = new Rectangle();
    t.context.options.rotation = 0.5;
    t.context.options.scale = 2;
    const ctx = {
        translate: () => {},
        clip: (...args) => t.is(args.length, 1),
        rotate: (...args) => t.deepEqual(args, [Math.PI]),
        scale: (...args) => t.deepEqual(args, [2, 2]),
    };
    t.plan(6);
    t.context.setContext(ctx);

    ctx.scale = (...args) => t.deepEqual(args, [3, 4]);
    t.context.options.scale = [3, 4];
    t.context.setContext(ctx);
});

test("render", (t) => {
    const child = addHeir(t.context);
    child.options.zIndex = -1;
    const otherChild = addHeir(t.context);
    otherChild.options.zIndex = -2;

    const ctx = {
        save: () => t.pass(),
        translate: () => t.pass(),
        restore: () => t.pass(),
    };
    child.render = param => t.is(param, ctx);
    otherChild.render = param => t.is(param, ctx);
    t.plan(5);
    t.context.render(ctx);
});

test("render with option", (t) => {
    t.context.options.opacity = 0.5;

    const ctx = {
        save: () => {},
        translate: () => {},
        restore: () => {},
    };
    t.context.render(ctx);

    t.is(ctx.globalAlpha, t.context.options.opacity);
});

test("render if not shown", (t) => {
    t.context.options.shown = false;
    const ctx = {
        save: () => t.fail(),
    };
    t.context.render(ctx);
    t.pass();
});

test("makePath", (t) => {
    t.is(t.context.makePath(), t.context);
});

test("show and hide", (t) => {
    t.true(t.context.options.shown);
    t.context.hide();
    t.false(t.context.options.shown);
    t.context.show();
    t.true(t.context.options.shown);
});

test("isAncestorOf", (t) => {
    const child = addHeir(t.context);
    const grandChild = addHeir(child);

    t.true(t.context.isAncestorOf(grandChild));
    t.true(t.context.isAncestorOf(child));
    t.false(t.context.isAncestorOf(null));
});

test("climbAncestry", (t) => {
    const child = addHeir(t.context);
    const grandChild = addHeir(child);

    const expected = [grandChild, child, t.context];
    let pointer = 0;
    t.plan(3);
    grandChild.climbAncestry(ancestor => t.is(ancestor, expected[pointer++]));
});

test("setOpacity", (t) => {
    const ctx = {
        globalAlpha: 1,
    };

    Container.setOpacity(ctx, null);
    t.is(ctx.globalAlpha, 1);

    Container.setOpacity(ctx, 0.5);
    t.is(ctx.globalAlpha, 0.5);
});

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.is(json.children, undefined);
    t.deepEqual(json.position, t.context.position);
    t.is(json.options, undefined);
    t.is(json.constructor, "Container");

    const specific = new Container([0, 0], {
        opacity: 0.5,
        rotationCenter: [10, 20],
    });
    addHeir(specific);
    const reJson = specific.toJSON();
    t.deepEqual(reJson.options, {
        opacity: 0.5,
        rotationCenter: specific.options.rotationCenter,
    });
    t.is(reJson.children.length, 1);
});

test("clone", (t) => {
    const clone = t.context.clone();
    t.true(clone instanceof Container);

    t.false(t.context === clone);
    t.deepEqual(t.context.options, clone.options);
    t.deepEqual(t.context.position, clone.position);
});

test("from", (t) => {
    const definition = {
        position: [10, 20],
    };
    const container = Container.from(definition);

    t.is(container.position.x, 10);
    t.is(container.position.y, 20);
});

test("defaultOptions", (t) => {
    const options = Container.defaultOptions;
    t.is(options.shown, true);
    t.is(options.opacity, null);
    t.is(options.rotation, 0);
    t.is(options.rotationCenter.x, 0);
    t.is(options.rotationCenter.y, 0);
    t.is(options.scale, 1);
    t.is(options.zIndex, 1);
    t.is(options.clip, null);
});

test("events", (t) => {
    t.is(Container.events.attach, "attach");
    t.is(Container.events.detach, "detach");
    t.is(Container.events.draw, "draw");
    t.is(Container.events.show, "show");
    t.is(Container.events.hide, "hide");
});
