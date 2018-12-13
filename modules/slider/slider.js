import BaseEvent from "@pencil.js/base-event";
import Circle from "@pencil.js/circle";
import Component from "@pencil.js/component";
import Container from "@pencil.js/container";
import Input from "@pencil.js/input";
import MouseEvent from "@pencil.js/mouse-event";
import Position from "@pencil.js/position";
import Vector from "@pencil.js/vector";
import { constrain } from "@pencil.js/math";
import "@pencil.js/draggable";

const moveHandleKey = Symbol("_moveHandle");

/**
 * Slider class
 * @class
 * @extends Container
 */
export default class Slider extends Input {
    /**
     * Slider constructor
     * @param {PositionDefinition} positionDefinition - Top-left corner
     * @param {SliderOptions} options -
     */
    constructor (positionDefinition, options) {
        super(positionDefinition, options);

        this.background.width = this.width;
        this.background.height = Slider.HEIGHT;

        const container = new Container(new Position(Slider.HEIGHT / 2, Slider.HEIGHT / 2));
        this.background.add(container);
        this.handle = new Circle(new Position(0, 0), (Slider.HEIGHT - 2) / 2, {
            fill: this.options.fill,
            cursor: Component.cursors.ewResize,
        });
        container.add(this.handle);
        this.constrainer = new Vector(new Position(0, 0), new Position(this.width - Slider.HEIGHT, 0));
        this.handle.draggable({
            constrain: this.constrainer,
        });
        this.handle.on(MouseEvent.events.drag, () => this.fire(new BaseEvent(Slider.events.change, this)), true);
    }

    /**
     * @inheritDoc
     */
    click (position) {
        this.handle.position.set(position.x - (Slider.HEIGHT / 2), 0)
            .constrain(this.constrainer.start, this.constrainer.end);
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
        this.background.width = newWidth;
        this.constrainer.end = new Position(this.width - Slider.HEIGHT, 0);

        this[moveHandleKey](this.value);
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

/**
 * Move the handle to a specified value
 * @param {Number} value - New value to use
 * @memberOf Slider#
 */
Slider.prototype[moveHandleKey] = function moveHandle (value) {
    const range = this.options.max - this.options.min;
    this.handle.position.x = (this.width - Slider.HEIGHT) * ((value - this.options.min) / range);
};
