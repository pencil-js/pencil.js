import Pie from "@pencil.js/pie";
import Input from "@pencil.js/input";
import Circle from "@pencil.js/circle";
import MouseEvent from "@pencil.js/mouse-event";
import { constrain } from "@pencil.js/math";

/**
 * @module ProgressPie
 */

const valueKey = Symbol("_value");

// FIXME: admittedly this is not an input, maybe we need a better name for the super class.
/**
 * ProgressPie class
 * <br><img src="./media/examples/progress-pie.png" alt="progress-pie demo"/>
 * @class
 * @extends {module:Input}
 */
export default class ProgressPie extends Input {
    /**
     * ProgressPie constructor
     * @param {PositionDefinition} positionDefinition - Position of the progress-pie center
     * @param {ProgressPieOptions} [options] - Specific options
     */
    constructor (positionDefinition, options) {
        super(positionDefinition, Circle, options);

        this.removeListener([MouseEvent.events.hover, MouseEvent.events.leave, MouseEvent.events.click]);

        this.progress = new Pie(this.getOrigin(), this.radius - (this.options.strokeWidth / 2), 0, 0, {
            fill: this.options.foreground,
        });
        this.add(this.progress);

        if (this.options.speed < 1) {
            this.progress.on(ProgressPie.events.draw, () => {
                this.progress.endAngle += (this.value - this.progress.endAngle) * (this.options.speed ** 2);
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
     * Return this size
     * @return {Number}
     */
    get radius () {
        return this.options.radius;
    }

    /**
     * Change this size
     * @param {Number} newRadius - A new size in pixels
     */
    set radius (newRadius) {
        this.options.radius = newRadius;
        this.progress.radius = newRadius - 1;
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
            this.progress.endAngle = this.value;
        }
    }

    /**
     * @typedef {Object} ProgressPieOptions
     * @extends InputOptions
     * @prop {Number} [value=0] - Initial value
     * @prop {Number} [radius=100] - Size of the progress-pie
     * @prop {Number} [speed=0.3] - Transition speed between two value (0 mean no change, 1 mean instant change)
     */
    /**
     * @type {ProgressPieOptions}
     */
    static get defaultOptions () {
        return {
            ...super.defaultOptions,
            cursor: null,
            value: 0,
            radius: 100,
            speed: 0.3,
        };
    }
}
