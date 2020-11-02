import BaseEvent from "@pencil.js/base-event";
import Component from "@pencil.js/component";
import MouseEvent from "@pencil.js/mouse-event";

/**
 * @module Input
 */

/**
 * Abstract Input class
 * @abstract
 * @class
 * @extends Component
 */
export default class Input extends Component {
    /**
     * Input constructor
     * @param {PositionDefinition} positionDefinition - Any position
     * @param {Component} base - Base shape for the background
     * @param {InputOptions} [options] - Specific options
     */
    constructor (positionDefinition, base, options) {
        super(positionDefinition, options);

        this.base = base;

        let fill;
        this.on(MouseEvent.events.hover, () => {
            fill = fill || this.options.fill;
            this.options.fill = this.options.hover;
        }).on(MouseEvent.events.leave, () => {
            this.options.fill = fill;
            fill = null;
        }).on(MouseEvent.events.click, (event) => {
            this.click(event.position.clone().subtract(this.getAbsolutePosition()));
        });

        this.on(Component.events.attach, () => this.value = this.options.value, true);
    }

    /**
     * @inheritDoc
     */
    trace (path) {
        return this.base.prototype.trace.call(this, path);
    }

    /**
     * @inheritDoc
     */
    getOrigin () {
        return this.base.prototype.getOrigin.call(this);
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
        this.fire(new BaseEvent(Input.events.change, this));
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const json = super.toJSON();
        json.options = json.options || {};
        json.options.value = this.value;
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
     * @extends ComponentOptions
     * @prop {*} [value=null] - Initial value of the input
     * @prop {String} [foreground="#444"] - Color of the filling
     * @prop {String} [fill="#f6f6f6"] - Color of the background
     * @prop {String} [border="#aaa"] - Color of the border
     * @prop {String} [hover="#d0d0d0"] - Color of the background when hovered
     * @prop {String} [cursor=Component.cursors.pointer] - Cursor on hover
     */
    /**
     * @type {InputOptions}
     */
    static get defaultOptions () {
        return {
            ...super.defaultOptions,
            value: null,
            foreground: "#444",
            fill: "#f6f6f6",
            stroke: "#aaa",
            hover: "#dcdcdc",
            cursor: Component.cursors.pointer,
        };
    }

    /**
     * @typedef {Object} InputEvents
     * @enum {String}
     * @prop {String} change - Input value has changed
     */
    /**
     * @type {InputEvents}
     */
    static get events () {
        return {
            ...super.events,
            change: "change",
        };
    }
}
