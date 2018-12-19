import Input from "@pencil.js/input";
import Square from "@pencil.js/square";

/**
 * Checkbox class
 * @class
 * @extends Container
 */
export default class Checkbox extends Input {
    /**
     * Checkbox constructor
     * @param {PositionDefinition} positionDefinition - Top-left corner
     * @param {CheckboxOptions} options -
     */
    constructor (positionDefinition, options) {
        super(positionDefinition, options);

        this.background.width = this.options.size;
        this.background.height = this.options.size;

        const margin = this.options.size * Checkbox.MARGIN;
        this.fill = new Square([margin, margin], this.options.size - (2 * margin), {
            fill: this.options.fill,
            shown: this.options.value,
            cursor: this.background.options.cursor,
        });
        this.background.add(this.fill);
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
     * @return {CheckboxOptions}
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
     * @return {Number}
     * @constant
     */
    static get MARGIN () {
        return 0.2;
    }
}
