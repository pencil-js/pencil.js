import Pencil from "./pencil";

const installed = [];

/**
 * @typedef {Object} Plugin
 * @prop {String} name - Name of the plugin
 * @prop {Function} install - Function called at use
 */
/**
 * Install a plugin in Pencil.js
 * @param {Plugin} plugin - Plugin to install
 * @param {Object} [options] - Option passed down to the plugin
 * @return {Object} The Pencil.js package
 */
function use ({ name, install }, options) {
    if (!name) {
        throw new Error("You're trying to install a nameless plugin.");
    }
    if (installed.includes(name)) {
        throw new Error(`The plugin "${name}" is already installed.`);
    }

    install(Pencil, options);
    installed.push(name);

    return Pencil;
}
Pencil.use = use;

export default Pencil;
export * from "./pencil";
export {
    use,
};
