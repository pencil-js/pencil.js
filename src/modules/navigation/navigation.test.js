import test from "ava";
import Scene from "@pencil.js/scene";
import BaseEvent from "@pencil.js/base-event";
import * as Navigation from "./navigation.js";

test("Navigation", (t) => {
    Navigation.prepareScenes({
        home: (scene) => {
            t.is(scene.constructor, Scene);
        },
        other: (scene) => {
            t.is(scene.constructor, Scene);
        },
    });
    const outsider = new Scene();

    const home = Navigation.getCurrentScene();
    t.true(home.options.shown);

    Navigation.displayScene(outsider);
    t.is(Navigation.getCurrentScene(), outsider);

    outsider.fire(new BaseEvent(Scene.events.change, "other"));
    t.false(home.options.shown);
    t.true(Navigation.getCurrentScene().options.shown);
});
