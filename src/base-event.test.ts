import { test, expect, beforeEach } from "vitest";


let context: any;
import BaseEvent from "./base-event.js";

beforeEach(() => {
    context = new BaseEvent("name", null);
});

test("constructor", () => {
    expect(context.target).toBe(null);
    expect(context.name).toBe("name");
    expect(context.bubble).toBe(true);
});

test("stop", () => {
    context.stop();
    expect(context.bubble).toBe(false);
});

test("getModifier", () => {
    expect(context.getModifier()).toBe(null);
});

test("prevent", () => {
    context.event = {
        preventDefault () {
            expect(true).toBe(true);
        },
    };

    expect.assertions(2);
    expect(context.prevent()).toBe(context);
});
