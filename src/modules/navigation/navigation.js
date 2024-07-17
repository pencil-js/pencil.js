import Scene from "@pencil.js/scene";

/**
 * @module Navigation
 */

let currentScene = null;
const history = [];

/**
 * Return the current scene
 * @return {Scene}
 */
const getCurrentScene = () => currentScene;

/**
 * Hide the current scene and display a new scene
 * @param {Scene} scene - Any scene to show
 * @param {Boolean} [save=true] - Should it be saved in history
 * @return {Scene} Shown scene
 */
const displayScene = (scene, save = true) => {
    if (currentScene) {
        currentScene.hide().stopLoop();
    }

    if (save) {
        history.push(currentScene);
    }

    scene.show().startLoop();
    currentScene = scene;
    return scene;
};

/**
 * Go back in history
 * @return {Scene}
 */
const back = () => displayScene(history.pop(), false);

/**
 * Build all scene and display the first one
 * @param {Object<Function>} builders - Set of function building the scenes
 * @param {HTMLElement} [container] - Container for all the scenes
 * @return {Object<Scene>} Prepared scenes
 */
const prepareScenes = (builders, container = window.document.body) => {
    let canvas = container;
    if (!(canvas instanceof window.HTMLCanvasElement)) {
        ({ canvas } = Scene.getDrawingContext(container));
        container.appendChild(canvas);
    }

    const scenesNames = Object.keys(builders);
    const scenes = {};
    scenesNames.forEach((sceneName) => {
        const scene = new Scene(canvas);
        builders[sceneName](scene);
        scenes[sceneName] = scene;
        scene.hide();

        scene.on(Scene.events.change, event => displayScene(scenes[event.target]));
    });

    displayScene(scenes[scenesNames[0]]);

    return scenes;
};

export {
    prepareScenes,
    displayScene,
    back,
    getCurrentScene,
};
