import Container from "@pencil.js/container";

/**
 * @class
 * @extends Container
 */
export default class Input extends Container {
    /**
     * Return the value of the input
     */
    get value () {
        throw new ReferenceError(`Unimplemented get value function in ${this.constructor.name}`);
    }

    /**
     * Set the value of the input
     * @param {*} value -
     */
    set value (value) {
        throw new ReferenceError(`Unimplemented set value function in ${this.constructor.name}`);
    }

    /**
     * @typedef {Object} InputOptions
     * @extends ContainerOptions
     * @prop {String} [fill="#444"] - Color of the filling
     * @prop {String} [background="#f6f6f6"] - Color of the background
     * @prop {String} [border="#aaa"] - Color of the border
     */
    /**
     * @return {InputOptions}
     */
    static get defaultOptions () {
        return Object.assign(super.defaultOptions, {
            value: null,
            fill: "#444",
            background: "#f6f6f6",
            border: "#aaa",
        });
    }
}
