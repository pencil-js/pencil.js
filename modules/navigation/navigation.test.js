import test from "ava";
import Scene from "../scene";
import BaseEvent from "../base-event";
import * as Navigation from ".";

test("Navigation", (t) => {
    Navigation.prepareScenes({
        home: (container) => {
            t.is(container.constructor.name, "HTMLCanvasElement");
            return new Scene(container);
        },
        other: (container) => {
            t.is(container.constructor.name, "HTMLCanvasElement");
            return new Scene(container);
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
