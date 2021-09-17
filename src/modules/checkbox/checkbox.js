import Input from "@pencil.js/input";
import Square from "@pencil.js/square";

/**
 * @module Checkbox
 */

/**
 * Checkbox class
 * <br><img src="./media/examples/checkbox.png" alt="checkbox demo"/>
 * @class
 * @extends {module:Input}
 */
export default class Checkbox extends Input {
    /**
     * Checkbox constructor
     * @param {PositionDefinition} positionDefinition - Top-left corner
     * @param {CheckboxOptions} [options] - Specific options
     */
    constructor (positionDefinition, options) {
        super(positionDefinition, Square, options);

        const margin = this.options.size * Checkbox.MARGIN;
        this.fill = new Square([margin, margin], this.options.size - (2 * margin), {
            fill: this.options.foreground,
            shown: this.options.value,
            cursor: this.options.cursor,
            origin: this.getOrigin(),
        });
        this.add(this.fill);
    }

    /**
     * Get it's width
     * @return {Number}
     */
    get width () {
        return this.options.size;
    }

    /**
     * Set it's width
     * @param {Number} value - Width of the checkbox
     */
    set width (value) {
        this.options.size = value;
    }

    /**
     * Get it's height
     * @return {Number}
     */
    get height () {
        return this.options.size;
    }

    /**
     * Set it's height
     * @param {Number} value - Height of the checkbox
     */
    set height (value) {
        this.options.size = value;
    }

    /**
     * @inheritDoc
     */
    click () {
        this.toggle();
        super.click();
    }

    /**
     * Inverse whether it's checked
     * @param {Boolean} [newValue] - If defined, will force the value
     * @return {Boolean}
     */
    toggle (newValue = !this.value) {
        this.value = newValue;
        return newValue;
    }

    /**
     * Return whether it's checked
     * @return {Boolean}
     */
    get value () {
        return this.fill.options.shown;
    }

    /**
     * Change whether it's checked
     * @param {Boolean} value - New value
     */
    set value (value) {
        if (value) {
            this.fill.show();
        }
        else {
            this.fill.hide();
        }
    }

    /**
     * @typedef {Object} CheckboxOptions
     * @extends InputOptions
     * @prop {Number} [size=20] - Width and height of the checkbox
     * @prop {Boolean} [value=false] - Whether it's check ot not
     */
    /**
     * @type {CheckboxOptions}
     */
    static get defaultOptions () {
        return {
            ...super.defaultOptions,
            size: 20,
            value: false,
        };
    }

    /**
     * Margin around the filling square in ratio
     * @type {Number}
     */
    static get MARGIN () {
        return 0.2;
    }
}
