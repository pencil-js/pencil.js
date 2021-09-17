import Input from "@pencil.js/input";
import Text from "@pencil.js/text";
import Rectangle from "@pencil.js/rectangle";

/**
 * @module Button
 */

/**
 * Button class
 * <br><img src="./media/examples/button.png" alt="button demo"/>
 * @class
 * @extends {module:Input}
 */
export default class Button extends Input {
    /**
     * Button constructor
     * @param {PositionDefinition} positionDefinition - Position of the top-left corner
     * @param {ButtonOptions} [options] - Specific options
     */
    constructor (positionDefinition, options) {
        super(positionDefinition, Rectangle, options);

        this.text = new Text(undefined, this.options.value, {
            fill: this.options.foreground,
            cursor: this.options.cursor,
            font: this.options.font,
            fontSize: this.options.fontSize,
            align: this.options.align,
            bold: this.options.bold,
            italic: this.options.italic,
            underscore: this.options.underscore,
            lineHeight: this.options.lineHeight,
        });
        this.add(this.text);
    }

    /**
     * Computer button size
     * @return {{width: Number, height: Number}}
     */
    get size () {
        const measures = this.text.getMeasures();
        const margin = Text.measure("M", this.text.options).height * Button.MARGIN;
        return {
            width: measures.width + (margin * 4),
            height: measures.height + (margin * 2),
        };
    }

    /**
     * Get this button's width
     * @return {Number}
     */
    get width () {
        return this.size.width;
    }

    /**
     * Get this button's height
     * @return {Number}
     */
    get height () {
        return this.size.height;
    }

    /**
     * @inheritDoc
     */
    click () { // eslint-disable-line class-methods-use-this
        // TODO: need visual feedback
        // do not call super.click on purpose, don't need to fire "change" on a button
    }

    /**
     * Return this button's text
     * @return {String}
     */
    get value () {
        return this.text.text;
    }

    /**
     * Change this button's text
     * @param {String|Array<String>} value - Any text or list of line
     */
    set value (value) {
        this.text.text = value;
        const margin = Text.measure("M", this.text.options).height * Button.MARGIN;
        this.text.position.set(this.getOrigin()).add(margin * 2, margin);
    }

    /**
     * @typedef {Object} ButtonOptions
     * @extends TextOptions
     * @extends InputOptions
     * @prop {String} [value=""] - Text of the button
     */
    /**
     * @type {ButtonOptions}
     */
    static get defaultOptions () {
        return {
            ...Text.defaultOptions,
            ...super.defaultOptions,
            value: "",
        };
    }

    /**
     * Margin around the text
     * @type {Number}
     */
    static get MARGIN () {
        return 0.2;
    }
}
