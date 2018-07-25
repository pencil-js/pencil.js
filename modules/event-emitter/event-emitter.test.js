import test from "ava";
import EventEmitter from "./event-emitter";

test.beforeEach((t) => {
    t.context = new EventEmitter();
});

test.todo("constructor");

test.todo("on");

test.todo("fire");

test.todo("clone");

test.todo("toJSON");
