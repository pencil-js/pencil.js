import BaseEvent from "@pencil.js/base-event";
import Circle from "@pencil.js/circle";
import Rectangle from "@pencil.js/rectangle";
import Input from "@pencil.js/input";
import MouseEvent from "@pencil.js/mouse-event";
import Position from "@pencil.js/position";
import Vector from "@pencil.js/vector";
import { constrain, map } from "@pencil.js/math";
import "@pencil.js/draggable";

/**
 * @module Slider
 */

const constrainerKey = Symbol("_constrainer");
const moveHandleKey = Symbol("_moveHandle");

/**
 * Slider class
 * <br><img src="./media/examples/slider.png" alt="slider demo"/>
 * @class
 * @extends Input
 */
export default class Slider extends Input {
    /**
     * Slider constructor
     * @param {PositionDefinition} positionDefinition - Top-left corner
     * @param {SliderOptions} [options] - Specific options
     */
    constructor (positionDefinition, options) {
        super(positionDefinition, Rectangle, options);

        const radius = (this.height - 2) / 2;
        this.handle = new Circle([0, this.height / 2], radius, {
            fill: this.options.foreground,
            cursor: Rectangle.cursors.ewResize,
            origin: this.getOrigin(),
        });
        this.add(this.handle);
        this[constrainerKey] = new Vector([radius + 1, this.height / 2], [this.width - radius - 1, this.height / 2]);
        this.handle.draggable({
            constrain: this[constrainerKey],
        });
        this.handle.on(MouseEvent.events.drag, () => this.fire(new BaseEvent(Slider.events.change, this)), true);
    }

    /**
     * @inheritDoc
     */
    click (position) {
        const origin = this.getOrigin();
        this.handle.position.set(position.x - origin.x, 0)
            .constrain(this[constrainerKey].start, this[constrainerKey].end);
        super.click();
    }

    /**
     * Change this slider's size
     * @param {Number} newWidth - A new size in pixels
     */
    set width (newWidth) {
        if (newWidth < Slider.HEIGHT) {
            throw new RangeError(`Slider is too small, minimum is ${Slider.HEIGHT}px.`);
        }

        this.options.width = newWidth;
        this[constrainerKey].end = new Position(this.width - Slider.HEIGHT, 0);

        this[moveHandleKey](this.value);
    }

    /**
     * Return this slider's width
     * @return {Number}
     */
    get width () {
        return this.options.width;
    }

    /**
     * Return this slider's height
     * @return {Number}
     */
    get height () { // eslint-disable-line class-methods-use-this
        return Slider.HEIGHT;
    }

    /**
     * Returns this current value
     * @return {Number}
     */
    get value () {
        const { min, max } = this.options;
        const { start, end } = this[constrainerKey];
        return map(this.handle.position.x, start.x, end.x, min, max);
    }

    /**
     * Change this current value
     * @param {Number} newValue - A new value to set
     */
    set value (newValue) {
        this[moveHandleKey](constrain(newValue, this.options.min, this.options.max));
    }

    /**
     * @typedef {Object} SliderOptions
     * @extends InputOptions
     * @prop {Number} [min=0] - Minimum value when the slider is at lowest
     * @prop {Number} [max=10] - Maximum value when the slider is at highest
     * @prop {Number} [value=0] - Initial value
     * @prop {Number} [width=200] - Size of the slider
     */
    /**
     * @type {SliderOptions}
     */
    static get defaultOptions () {
        return {
            ...super.defaultOptions,
            min: 0,
            max: 1,
            value: 0,
            width: 200,
        };
    }

    /**
     * Height of sliders
     * @type {Number}
     */
    static get HEIGHT () {
        return 20;
    }
}

/**
 * Move the handle to a specified value
 * @param {Number} value - New value to use
 * @memberOf Slider#
 */
Slider.prototype[moveHandleKey] = function moveHandle (value) {
    const { min, max } = this.options;
    const { start, end } = this[constrainerKey];
    this.handle.position.x = map(value, min, max, start.x, end.x);
};
