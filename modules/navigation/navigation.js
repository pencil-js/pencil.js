import Scene from "@pencil.js/scene";

let currentScene = null;

/**
 * Return the current scene
 * @return {Scene}
 */
const getCurrentScene = () => currentScene;

/**
 * Hide the current scene and display a new scene
 * @param {Scene} scene - Any scene to show
 * @return {Scene} Shown scene
 */
const displayScene = (scene) => {
    if (currentScene) {
        currentScene.hide().stopLoop();
    }

    scene.show().startLoop();
    currentScene = scene;
    return scene;
};

/**
 * Build all scene and display the first one
 * @param {Object} builders - Set of function building the scenes
 * @param {HTMLElement} container - Container for all the scenes
 * @return {Scene} First shown scene
 */
const prepareScenes = (builders, container = window.document.body) => {
    let canvas;
    if (container instanceof window.HTMLCanvasElement) {
        canvas = container;
    }
    else {
        ({ canvas } = Scene.buildCanvas(container));
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

    return displayScene(scenes[scenesNames[0]]);
};

export {
    prepareScenes,
    displayScene,
    getCurrentScene,
};
