import Scene from "./scene.js";
import type BaseEvent from "./base-event.js";

/**
 * Helpers to handle multiple scenes sharing one canvas
 * @module Navigation
 */

let currentScene: Scene | null = null;
const history: Array<Scene> = [];

/**
 * Return the current scene
 */
export const getCurrentScene = (): Scene | null => currentScene;

/**
 * Hide the current scene and display a new scene
 * @param scene - Any scene to show
 * @param save - Should the current scene be saved in history
 * @returns Shown scene
 */
export const displayScene = (scene: Scene, save = true): Scene => {
    if (currentScene && currentScene !== scene) {
        currentScene.hide().stopLoop();
        if (save) {
            history.push(currentScene);
        }
    }

    scene.show().startLoop();
    currentScene = scene;
    return scene;
};

/**
 * Go back to the previous scene in history
 * @returns The displayed scene (or null if history is empty)
 */
export const back = (): Scene | null => {
    const previous = history.pop();
    return previous ? displayScene(previous, false) : null;
};

/**
 * Build all scenes and display the first one
 * @param builders - Set of function building the scenes
 * @param container - Container for all the scenes (or the canvas to use)
 * @returns Prepared scenes
 * @example
 * const scenes = prepareScenes({
 *     menu: (scene) => {
 *         button.on("click", () => scene.fire(new BaseEvent(Scene.events.change, "game")));
 *     },
 *     game: (scene) => { … },
 * });
 */
export const prepareScenes = <K extends string>(
    builders: Record<K, (scene: Scene) => void>,
    container: HTMLElement = window.document.body,
): Record<K, Scene> => {
    let canvas: HTMLCanvasElement;
    if (container instanceof window.HTMLCanvasElement) {
        canvas = container;
    }
    else {
        ({ canvas } = Scene.getDrawingContext(container));
        container.appendChild(canvas);
    }

    const scenesNames = Object.keys(builders) as Array<K>;
    const scenes = {} as Record<K, Scene>;
    for (const sceneName of scenesNames) {
        const scene = new Scene(canvas);
        builders[sceneName](scene);
        scenes[sceneName] = scene;
        scene.hide();

        scene.on(Scene.events.change, (event: BaseEvent<K>) => displayScene(scenes[event.target]));
    }

    displayScene(scenes[scenesNames[0]]);

    return scenes;
};
