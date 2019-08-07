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
 * @param {Object} builders - Set of function returning a scene
 * @return {Scene} First shown scene
 */
const prepareScenes = (builders) => {
    const { canvas } = Scene.buildCanvas(window.document.body);

    const scenesNames = Object.keys(builders);
    const scenes = {};
    scenesNames.forEach((sceneName) => {
        const scene = builders[sceneName](canvas);
        scenes[sceneName] = scene;
        scene.hide();

        scene.on("change", event => displayScene(scenes[event.target]));
    });

    return displayScene(scenes[scenesNames[0]]);
};

export {
    prepareScenes,
    displayScene,
    getCurrentScene,
};
