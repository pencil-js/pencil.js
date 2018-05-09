import Component from "@pencil.js/component";
import Input from "@pencil.js/input";
import Position from "@pencil.js/position";
import Square from "@pencil.js/square";

/**
 * Checkbox class
 * @class
 * @extends Container
 */
export default class Checkbox extends Input {
    /**
     * Checkbox constructor
     * @param {PositionDefinition} position - Any position
     * @param {CheckboxOptions} options -
     */
    constructor (position, options) {
        super(position, options);

        this.background.width = this.options.size;
        this.background.height = this.options.size;

        const margin = this.options.size * Checkbox.MARGIN;
        this.fill = new Square(new Position(margin, margin), this.options.size - (2 * margin), {
            fill: this.options.fill,
            shown: this.options.value,
            cursor: Component.cursors.pointer,
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
     * @param {Boolean} [force] - If defined, will force the value
     * @return {Boolean}
     */
    toggle (force) {
        const value = force === undefined ? !this.value : force;
        this.value = value;
        return value;
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
     * @prop {Number} [size=20]
     */
    /**
     * @return {CheckboxOptions}
     */
    static get defaultOptions () {
        return Object.assign(super.defaultOptions, {
            size: 20,
        });
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
