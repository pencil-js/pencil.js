import Input from "@pencil.js/input";
import Component from "@pencil.js/component";
import Circle from "@pencil.js/circle";
import Line from "@pencil.js/line";
import MouseEvent from "@pencil.js/mouse-event";
import BaseEvent from "@pencil.js/base-event";
import { map, modulo } from "@pencil.js/math";
import "@pencil.js/rotatable";

/**
 * @module Knob
 */

/**
 * @class
 */
export default class Knob extends Input {
    /**
     * knob constructor
     * @param {PositionDefinition} positionDefinition - Position of the center
     * @param {KnobOptions} options - Specific options
     */
    constructor (positionDefinition, options) {
        super(positionDefinition, Circle, options);

        const origin = this.getOrigin();
        this.options.rotationCenter = origin;
        const strokeWidth = this.options.radius * Knob.NOTCH_SIZE;
        const margin = this.options.radius / 3;
        const notch = new Line([0, -margin], [[0, -this.options.radius + margin + strokeWidth]], {
            stroke: this.options.foreground,
            strokeWidth,
            cursor: Component.cursors.grab,
            origin,
        });
        this
            .add(notch)
            .on(MouseEvent.events.rotate, () => this.fire(new BaseEvent(Knob.events.change, this)), true)
            .rotatable();
    }

    /**
     * Get this knob's radius
     * @return {Number}
     */
    get radius () {
        return this.options.radius;
    }

    /**
     * Set this knob's radius
     * @param {Number} value - Radius of the knob
     */
    set radius (value) {
        this.options.radius = value;
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
        return map(modulo(this.options.rotation, 1), 0, 1, this.options.min, this.options.max);
    }

    /**
     * Change this current value
     * @param {Number} newValue - A new value to set
     */
    set value (newValue) {
        this.options.rotation = modulo(map(newValue, this.options.min, this.options.max, 0, 1), 1);
    }

    /**
     * @typedef {Object} KnobOptions
     * @prop {Number} [min=0] - Minimum value when the knob is at lowest
     * @prop {Number} [max=10] - Maximum value when the knob is at highest
     * @prop {Number} [value=0] - Initial value
     * @prop {Number} [radius=100] - Radius of the knob
     */
    /**
     * @type {KnobOptions}
     */
    static get defaultOptions () {
        return {
            ...super.defaultOptions,
            cursor: Component.cursors.default,
            min: 0,
            max: 1,
            value: 0,
            radius: 100,
        };
    }

    /**
     * Width of the rotation marker
     * @type {Number}
     */
    static get NOTCH_SIZE () {
        return 0.09;
    }
}
