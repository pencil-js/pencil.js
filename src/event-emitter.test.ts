import { test, expect, beforeEach } from "vitest";


let context: any;
import EventEmitter from "./event-emitter.js";

beforeEach(() => {
    context = new EventEmitter();
});

test("constructor", () => {
    expect(context.eventListeners).toEqual({});
});

test("on and fire", () => {
    context.on("pass", () => expect(true).toBe(true))
        .on("pass", () => expect(true).toBe(true))
        .on("fail", () => expect.fail());

    expect.assertions(3);
    expect(Object.keys(context.eventListeners).length).toBe(2);

    context.fire({
        name: "unknown",
    }).fire({
        name: "pass",
    });
});

test("on with array of event", () => {
    context.on([
        "pass1",
        "pass2",
        "fail",
    ], () => expect(true).toBe(true));

    expect.assertions(3);
    expect(Object.keys(context.eventListeners).length).toBe(3);
    context.fire({
        name: "pass1",
    }).fire({
        name: "pass2",
    });
});

test("on with modifier", () => {
    context
        .on("pass.ok", () => expect(true).toBe(true))
        .on("pass", () => expect(true).toBe(true))
        .on("pass.fail", () => expect.fail());

    expect.assertions(3);

    context.fire({
        name: "pass",
        getModifier () {
            return "ok";
        },
    }).fire({
        name: "pass",
        getModifier () {
            return "other";
        },
    });
});

test("fire targeted", () => {
    context.on("event", () => expect.fail(), true);

    context.fire({
        name: "event",
    });
    expect(true).toBe(true);
});

test("removeListener", () => {
    const callback = () => expect.fail();
    context.on(["one", "two", "three", "four", "five"], callback);
    context.on(["three", "four", "five"], () => {});

    context.fire({
        name: "unknown",
    });
    expect(Object.keys(context.eventListeners).length).toBe(5);

    context.removeListener("one");
    context.fire({
        name: "one",
    });

    context.removeListener("unknown");

    context.removeListener(["two", "unknown"]);
    context.fire({
        name: "two",
    });

    // Wrong callback
    context.removeListener("three", () => {});
    expect(context.eventListeners.three.length).toBe(2);

    // Wrong callback
    context.removeListener(["four"], () => {});
    expect(context.eventListeners.four.length).toBe(2);

    context.removeListener(["three", "four"], callback);
    context.fire({
        name: "three",
    }).fire({
        name: "four",
    });
});

test("removeListener with modifiers", () => {
    const callback = () => {};
    context
        .on("one", callback)
        .on("one.a", callback)
        .on("one.b", callback);
    expect(context.eventListeners.one.length).toBe(3);
    context.removeListener("one");
    expect(context.eventListeners.one).toBe(undefined);

    context
        .on("two", callback)
        .on("two.mod", callback);
    expect(context.eventListeners.two.length).toBe(2);
    context.removeListener("two.mod");
    expect(context.eventListeners.two.length).toBe(1);

    context
        .on("three", callback)
        .on("three.mod", callback)
        .on("three", () => {})
        .on("three.mod", () => {});
    expect(context.eventListeners.three.length).toBe(4);
    context.removeListener("three", callback);
    expect(context.eventListeners.three.length).toBe(2);

    context
        .on("four", callback)
        .on("four.mod", callback)
        .on("four", () => {})
        .on("four.mod", () => {});
    expect(context.eventListeners.four.length).toBe(4);
    context.removeListener("four.mod", callback);
    expect(context.eventListeners.four.length).toBe(3);
});

test("removeAllListener", () => {
    context.on(["one", "two", "three"], () => {});

    expect(Object.keys(context.eventListeners).length).toBe(3);

    context.removeAllListener();
    expect(Object.keys(context.eventListeners).length).toBe(0);
});

test("events", () => {
    expect(Object.keys(EventEmitter.events).length).toBe(0);
});
