import Input from "@pencil.js/input";
import Rectangle from "@pencil.js/rectangle";
import MouseEvent from "@pencil.js/mouse-event";
import { constrain } from "@pencil.js/math";

/**
 * @module ProgressBar
 */

const valueKey = Symbol("_value");

// FIXME: admittedly this is not an input, maybe we need a better name for the super class.
/**
 * Slider class
 * <br><img src="./media/examples/progress-bar.png" alt="progress-bar demo"/>
 * @class
 * @extends {module:Input}
 */
export default class ProgressBar extends Input {
    /**
     * Slider constructor
     * @param {PositionDefinition} positionDefinition - Top-left corner
     * @param {ProgressBarOptions} [options] - Specific options
     */
    constructor (positionDefinition, options) {
        super(positionDefinition, Rectangle, options);

        this.removeListener([MouseEvent.events.hover, MouseEvent.events.leave, MouseEvent.events.click]);

        this.progress = new Rectangle([1, 1], 0, ProgressBar.HEIGHT - 2, {
            fill: this.options.foreground,
            origin: this.getOrigin(),
        });
        this.add(this.progress);

        if (this.options.speed < 1) {
            this.progress.on(ProgressBar.events.draw, () => {
                const targetWidth = (this.width - 2) * this.value;
                this.progress.width += (targetWidth - this.progress.width) * (this.options.speed ** 2);
            }, true);
        }

        /**
         * @type {Number}
         */
        this[valueKey] = null;
    }

    /**
     * @inheritDoc
     */
    click () { // eslint-disable-line class-methods-use-this
        // Do nothing
    }

    /**
     * Return this width
     * @return {Number}
     */
    get width () {
        return this.options.width;
    }

    /**
     * Change this size
     * @param {Number} newWidth - A new size in pixels
     */
    set width (newWidth) {
        if (newWidth < ProgressBar.HEIGHT) {
            throw new RangeError(`Progress-bar is too small, minimum is ${ProgressBar.HEIGHT}px.`);
        }

        this.options.width = newWidth;
    }

    /**
     * Return this height
     * @return {Number}
     */
    get height () {
        return ProgressBar.HEIGHT;
    }

    /**
     * Returns this current value
     * @return {Number}
     */
    get value () {
        return this[valueKey];
    }

    /**
     * Change this current value
     * @param {Number} newValue - A new value to be set (between 0 and 1)
     */
    set value (newValue) {
        this[valueKey] = constrain(newValue, 0, 1);

        if (this.options.speed >= 1) {
            this.progress.width = (this.width - 2) * this.value;
        }
    }

    /**
     * @typedef {Object} ProgressBarOptions
     * @extends InputOptions
     * @prop {Number} [value=0] - Initial value
     * @prop {Number} [width=200] - Size of the slider
     * @prop {Number} [speed=0.3] - Transition speed between two value (0 mean no change, 1 mean instant change)
     */
    /**
     * @type {ProgressBarOptions}
     */
    static get defaultOptions () {
        return {
            ...super.defaultOptions,
            cursor: null,
            value: 0,
            width: 200,
            speed: 0.3,
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
