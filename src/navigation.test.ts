import { test, expect } from "vitest";
import Scene from "./scene.js";
import BaseEvent from "./base-event.js";
import * as Navigation from "./navigation.js";

test("Navigation", () => {
    const { home, other } = Navigation.prepareScenes({
        home: (scene) => {
            expect(scene.constructor).toBe(Scene);
        },
        other: (scene) => {
            expect(scene.constructor).toBe(Scene);
        },
    });
    const outsider = new Scene();

    expect(home).toBe(Navigation.getCurrentScene());
    expect(home.options.shown).toBe(true);

    Navigation.displayScene(other);
    expect(Navigation.getCurrentScene()).toBe(other);

    Navigation.back();
    expect(Navigation.getCurrentScene()).toBe(home);

    Navigation.displayScene(outsider);
    expect(Navigation.getCurrentScene()).toBe(outsider);

    outsider.fire(new BaseEvent(Scene.events.change, "other"));
    expect(home.options.shown).toBe(false);
    expect(Navigation.getCurrentScene()).toBe(outsider);
});
