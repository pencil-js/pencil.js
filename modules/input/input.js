import Container from "@pencil.js/container";
import Rectangle from "@pencil.js/rectangle";
import Component from "@pencil.js/component";
import BaseEvent from "@pencil.js/base-event";

/**
 * Abstract Input class
 * @abstract
 * @class
 * @extends Container
 */
export default class Input extends Container {
    /**
     * Input constructor
     * @param {PositionDefinition} position - Any position
     * @param {InputOptions} options -
     */
    constructor (position, options) {
        super(position, options);

        this.background = new Rectangle(undefined, 0, 0, {
            fill: this.options.background,
            stroke: this.options.border,
            strokeWidth: 2,
            cursor: Component.cursors.pointer,
        });
        this.add(this.background);

        this.background.on("hover", () => {
            this.background.options.fill = this.options.hover;
        }).on("leave", () => {
            this.background.options.fill = this.options.background;
        }).on("click", (event) => {
            this.click(event.position.clone().subtract(this.position));
        });

        this.on("attach", () => this.value = this.options.value, true);
    }
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
     * Action to execute on click
     * @param {Position} position - Relative position of the click
     */
    click (position) {
        this.fire(new BaseEvent(this, "change"));
    }

    /**
     * @inheritDoc
     */
    isHover (position, ctx) {
        if (!this.options.shown) {
            return false;
        }

        return this.background.isHover(position.clone().add(this.position), ctx);
    }

    /**
     * @typedef {Object} InputOptions
     * @extends ContainerOptions
     * @prop {String} [fill="#444"] - Color of the filling
     * @prop {String} [background="#f6f6f6"] - Color of the background
     * @prop {String} [border="#aaa"] - Color of the border
     * @prop {String} [hover="#d0d0d0"] - Color of the background when hovered
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
            hover: "#dcdcdc",
        });
    }
}
