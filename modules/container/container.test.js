import test from "ava";
import Container from "./container";

test.beforeEach((t) => {
    t.context = new Container([0, 0]);
});

test.todo("constructor");

test.todo("isHover");

test.todo("add");

test.todo("removeChild");

test.todo("empty");

test.todo("remove");

test.todo("getScene");

test.todo("getRoot");

test.todo("getAbsolutePosition");

test.todo("fire");

test.todo("getTarget");

test.todo("render");

test.todo("makePath");

test.todo("show");

test.todo("hide");

test.todo("isAncestorOf");

test.todo("climbAncestry");

test.todo("getTaintedCanvas");

test.todo("toImg");

test.todo("toJSON");

test.todo("from");

test("defaultOptions", (t) => {
    const options = Container.defaultOptions;
    t.is(options.shown, true);
    t.is(options.opacity, null);
    t.is(options.rotation, 0);
    t.deepEqual(options.rotationAnchor, [0, 0]);
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
