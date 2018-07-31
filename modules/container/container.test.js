import test from "ava";
import Container from "./container";

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
    // eslint-disable-next-line no-underscore-dangle
    t.true(t.context._scenePromise instanceof Promise);
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

    t.throws(() => t.context.add(t.context), RangeError);
    t.throws(() => {
        const pseudoScene = new Container();
        pseudoScene.isScene = true;
        t.context.add(pseudoScene);
    }, RangeError);
});

test("removeChild", (t) => {
    const child = addHeir(t.context);
    const grandChild = addHeir(child);

    t.context.removeChild(grandChild);
    t.is(t.context.children.length, 1, "Not its child, do nothing");
    t.is(grandChild.parent, child);
    t.context.removeChild(null, child);
    t.is(t.context.children.length, 0);
    t.is(child.parent, null);
});

test("empty", (t) => {
    const child = addHeir(t.context);
    t.context.empty();

    t.is(t.context.children.length, 0);
    t.is(child.parent, null);
});

test("remove", (t) => {
    const parent = new Container();
    parent.add(t.context);

    t.context.remove();
    t.is(t.context.parent, null);
    t.context.remove();
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

test("getTarget", (t) => {
    t.is(t.context.getTarget(t.context.position), null);

    const child = addHeir(t.context);
    child.isHover = () => true;
    const grandChild = addHeir(child);
    grandChild.isHover = () => true;
    grandChild.options.zIndex = -1;
    addHeir(t.context);

    t.is(t.context.getTarget(t.context.position), child);
});

test("render", (t) => {
    const child = addHeir(t.context);
    child.options.zIndex = -1;
    const otherChild = addHeir(t.context);

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
    t.context.options.rotation = 0.2;

    const ctx = {
        save: () => {},
        translate: () => {},
        rotate: () => t.pass(),
        restore: () => {},
    };
    t.plan(2);
    t.context.render(ctx);

    t.is(ctx.globalAlpha, t.context.options.opacity);
});

test("render with clip", (t) => {
    t.context.options.clip = Container.ITSELF;
    t.context.trace = () => t.pass();

    const ctx = {
        save: () => {},
        translate: () => {},
        clip: () => t.pass(),
        restore: () => {},
    };
    t.plan(2);
    t.context.render(ctx);
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

test.todo("getTaintedCanvas");

test.todo("toImg");

test("toJSON", (t) => {
    const json = t.context.toJSON();

    t.is(json.children, undefined);
    t.deepEqual(json.position, [10, 20]);
    t.is(json.options, undefined);

    const specific = new Container([0, 0], {
        opacity: 0.5,
        rotationAnchor: [10, 20],
    });
    addHeir(specific);
    const reJson = specific.toJSON();
    t.deepEqual(reJson.options, {
        opacity: 0.5,
        rotationAnchor: [10, 20],
    });
    t.is(reJson.children.length, 1);
});

test.todo("from");

test("defaultOptions", (t) => {
    const options = Container.defaultOptions;
    t.is(options.shown, true);
    t.is(options.opacity, null);
    t.is(options.rotation, 0);
    t.is(options.rotationAnchor.x, 0);
    t.is(options.rotationAnchor.y, 0);
    t.is(options.zIndex, 1);
    t.is(options.clip, null);
});

test("events", (t) => {
    t.is(Container.events.attach, "attach");
    t.is(Container.events.detach, "detach");
    t.is(Container.events.draw, "draw");
});

test("ITSELF", (t) => {
    t.is(Container.ITSELF, "itself");
});
