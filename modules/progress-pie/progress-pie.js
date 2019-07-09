import Input from "@pencil.js/input";
import Circle from "@pencil.js/circle";
import { constrain } from "@pencil.js/math";
import Pie from "./pie";

const valueKey = Symbol("_value");

// FIXME: admittedly this is not an input, maybe we need a better name for the super class.
/**
 * ProgressPie class
 * @class
 * @extends Input
 */
export default class ProgressPie extends Input {
    /**
     * ProgressPie constructor
     * @param {PositionDefinition} positionDefinition -
     * @param {ProgressOptions} options -
     */
    constructor (positionDefinition, options) {
        super(positionDefinition, options);

        this.background.delete();
        this.background = new Circle(undefined, this.options.radius, {
            fill: this.options.background,
            stroke: this.options.border,
            strokeWidth: 2,
            cursor: null,
        });
        this.add(this.background);

        this.progress = new Pie(undefined, this.background.radius - 1, 0, 0, {
            fill: this.options.fill,
            stroke: null,
        });
        this.background.add(this.progress);

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
        this.background.radius = newRadius;
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
     * @return {ProgressOptions}
     */
    static get defaultOptions () {
        return {
            ...super.defaultOptions,
            value: 0,
            radius: 100,
            speed: 0.3,
        };
    }
}
