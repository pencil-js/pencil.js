import Input from "@pencil.js/input";
import Component from "@pencil.js/component";
import Circle from "@pencil.js/circle";
import Line from "@pencil.js/line";
import MouseEvent from "@pencil.js/mouse-event";
import BaseEvent from "@pencil.js/base-event";
import { map, modulo } from "@pencil.js/math";
import "@pencil.js/rotatable";

/**
 * @class
 */
export default class Knob extends Input {
    /**
     * knob constructor
     * @param {PositionDefinition} positionDefinition -
     * @param {KnobOptions} options -
     */
    constructor (positionDefinition, options) {
        super(positionDefinition, options);

        this.background.delete();
        this.background = new Circle(undefined, this.options.radius, {
            fill: this.options.background,
            stroke: this.options.border,
            strokeWidth: 2,
        });

        this.add(this.background);

        const strokeWidth = this.options.radius * Knob.NOTCH_SIZE;
        const margin = this.options.radius / 3;
        const notch = new Line([0, -margin], [[0, -this.options.radius + margin + strokeWidth]], {
            stroke: this.options.fill,
            strokeWidth,
            cursor: Component.cursors.grab,
        });
        this.background
            .add(notch)
            .on(MouseEvent.events.rotate, () => this.fire(new BaseEvent(Knob.events.change, this)), true)
            .rotatable();
    }

    /**
     * @inheritDoc
     */
    click () { // eslint-disable-line class-methods-use-this
        // Do nothing
    }

    /**
     * Returns this current value
     * @return {Number}
     */
    get value () {
        return map(modulo(this.background.options.rotation, 1), 0, 1, this.options.min, this.options.max);
    }

    /**
     * Change this current value
     * @param {Number} newValue - A new value to set
     */
    set value (newValue) {
        this.background.options.rotation = modulo(map(newValue, this.options.min, this.options.max, 0, 1), 1);
    }

    /**
     * @typedef {Object} KnobOptions
     * @prop {Number} [min=0] - Minimum value when the knob is at lowest
     * @prop {Number} [max=10] - Maximum value when the knob is at highest
     * @prop {Number} [value=0] - Initial value
     * @prop {Number} [radius=100] - Radius of the knob
     */
    /**
     * @return {KnobOptions}
     */
    static get defaultOptions () {
        return {
            ...super.defaultOptions,
            min: 0,
            max: 10,
            value: 0,
            radius: 100,
        };
    }

    /**
     * Width of the rotation marker
     * @return {Number}
     */
    static get NOTCH_SIZE () {
        return 0.09;
    }
}
