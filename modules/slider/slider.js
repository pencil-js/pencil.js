import BaseEvent from "@pencil.js/base-event";
import Circle from "@pencil.js/circle";
import Component from "@pencil.js/component";
import Container from "@pencil.js/container";
import Input from "@pencil.js/input";
import { constrain } from "@pencil.js/math";
import Position from "@pencil.js/position";
import Rectangle from "@pencil.js/rectangle";
import Vector from "@pencil.js/vector";

/**
 * Slider class
 * @class
 * @extends Container
 */
export default class Slider extends Input {
    /**
     * Slider constructor
     * @param {PositionDefinition} position -
     * @param {SliderOptions} options -
     */
    constructor (position, options) {
        super(position, options);

        const sliderHeight = Slider.HEIGHT;
        this.constrainer = new Vector(new Position(0, 0), new Position(this.width - sliderHeight, 0));

        this.background = new Rectangle(undefined, this.width, sliderHeight, {
            fill: this.options.background,
            stroke: this.options.border,
            strokeWidth: 2,
        });
        this.background.on("click", (event) => {
            this.handle.position.set(event.position.x - this.position.x - (sliderHeight / 2), 0)
                .constrain(this.constrainer);
            this.fire(new BaseEvent(this, "change"));
        });
        this.add(this.background);

        const container = new Container(new Position(sliderHeight / 2, sliderHeight / 2));
        this.add(container);
        this.handle = new Circle(new Position(0, 0), (sliderHeight - 2) / 2, {
            fill: this.options.fill,
            cursor: Component.cursors.ewResize,
        });
        container.add(this.handle);
        this.handle.draggable({
            constrain: this.constrainer,
        });
        this.handle.on("drag", () => this.fire(new BaseEvent(this, "change")), true);

        if (this.options.value !== null) {
            this._moveHandle(this.options.value);
        }
    }

    /**
     * Move the handle to a specified value
     * @param {Number} value - New value to use
     */
    _moveHandle (value) {
        const range = this.options.max - this.options.min;
        this.handle.position.x = (this.width - Slider.HEIGHT) * ((value - this.options.min) / range);
    }

    /**
     * Change this slider's size
     * @param {Number} newWidth - A new size in pixels
     */
    set width (newWidth) {
        if (newWidth < Slider.HEIGHT) {
            throw new RangeError(`Slider is too small, minimum is ${Slider.HEIGHT}`);
        }

        this.options.width = newWidth;
        this.background.width = newWidth;
        this.constrainer.end = new Position(this.width - Slider.HEIGHT, 0);

        this._moveHandle(this.value);
    }

    /**
     * Return this slider's size
     * @return {Number}
     */
    get width () {
        return this.options.width;
    }

    /**
     * Returns this current value
     * @return {Number}
     */
    get value () {
        const range = this.options.max - this.options.min;
        const relativePosition = this.handle.position.x / (this.width - Slider.HEIGHT);
        return this.options.min + (range * relativePosition);
    }

    /**
     * Change this current value
     * @param {Number} newValue - A new value to set
     * @return {Number} Real value used (between min and max)
     */
    set value (newValue) {
        const constrainedValue = constrain(newValue, this.options.min, this.options.max);
        this._moveHandle(constrainedValue);
        return constrainedValue;
    }

    /**
     * @typedef {Object} SliderOptions
     * @extends InputOptions
     * @prop {Number} [min=0] - Minimum value when the slider is at lowest
     * @prop {Number} [max=10] - Maximum value when the slider is at highest
     * @prop {Number} [value=0] - Initial value
     * @prop {Number [width=200] - Size of the slider
     */
    /**
     * @return {SliderOptions}
     */
    static get defaultOptions () {
        return Object.assign(super.defaultOptions, {
            min: 0,
            max: 10,
            width: 200,
        });
    }

    /**
     * Height of sliders
     * @return {Number}
     * @constant
     */
    static get HEIGHT () {
        return 20;
    }
}
