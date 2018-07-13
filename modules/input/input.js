import BaseEvent from "@pencil.js/base-event";
import Component from "@pencil.js/component";
import Container from "@pencil.js/container";
import MouseEvent from "@pencil.js/mouse-event";
import Rectangle from "@pencil.js/rectangle";

/**
 * Abstract Input class
 * @abstract
 * @class
 * @extends Container
 */
export default class Input extends Container {
    /**
     * Input constructor
     * @param {PositionDefinition} positionDefinition - Any position
     * @param {InputOptions} options -
     */
    constructor (positionDefinition, options) {
        super(positionDefinition, options);

        this.background = new Rectangle(undefined, 0, 0, {
            fill: this.options.background,
            stroke: this.options.border,
            strokeWidth: 2,
            cursor: Component.cursors.pointer,
        });
        this.add(this.background);

        this.background.on(MouseEvent.events.hover, () => {
            this.background.options.fill = this.options.hover;
        }).on(MouseEvent.events.leave, () => {
            this.background.options.fill = this.options.background;
        }).on(MouseEvent.events.click, (event) => {
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
     * @param {*} value - Any value
     */
    set value (value) {
        throw new ReferenceError(`Unimplemented set value function in ${this.constructor.name}`);
    }

    /**
     * Action to execute on click
     */
    click () {
        this.fire(new BaseEvent(this, "change"));
    }

    /**
     * @inheritDoc
     */
    isHover (positionDefinition, ctx) {
        return this.options.shown && this.background.isHover(this.position.add(positionDefinition), ctx);
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const json = super.toJSON();
        json.options.value = this.value;
        json.children = json.children.slice(1);
        return json;
    }

    /**
     * @inheritDoc
     * @param {Object} definition - Input definition
     * @return {Input}
     */
    static from (definition) {
        return new this(definition.position, definition.options);
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

    /**
     * @typedef {Object} InputEvents
     * @enum {String}
     * @prop {String} change - Input value has changed
     */
    /**
     * @return {InputEvents}
     */
    static get events () {
        return {
            change: "change",
        };
    }
}
