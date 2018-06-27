import Component from "@pencil.js/component";
import Input from "@pencil.js/input";
import Text from "@pencil.js/text";

/**
 * Button class
 * @class
 * @extends Input
 */
export default class Button extends Input {
    /**
     * Button constructor
     * @param {PositionDefinition} positionDefinition - Top-left corner
     * @param {ButtonOptions} options -
     */
    constructor (positionDefinition, options) {
        super(positionDefinition, options);

        this.text = new Text(undefined, this.options.value, {
            fill: this.options.fill,
            cursor: Component.cursors.pointer,
            font: this.options.font,
            fontSize: this.options.fontSize,
            bold: this.options.bold,
            italic: this.options.italic,
        });
        this.background.add(this.text);
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
     * @param {String} value - Any text
     */
    set value (value) {
        this.text.text = value;
        const measures = this.text.getMeasures();
        const margin = measures.height * Button.MARGIN;
        this.background.width = measures.width + (margin * 4);
        this.background.height = measures.height + margin;
        this.text.position.set(margin * 2, margin);
    }

    /**
     * @typedef {Object} ButtonOptions
     * @extends InputOptions
     */
    /**
     * @return {ButtonOptions}
     */
    static get defaultOptions () {
        const TextOptions = Text.defaultOptions;
        return Object.assign(super.defaultOptions, {
            font: TextOptions.font,
            fontSize: TextOptions.fontSize,
            bold: TextOptions.bold,
            italic: TextOptions.italic,
            value: "",
        });
    }

    /**
     * Margin around the text
     * @return {Number}
     */
    static get MARGIN () {
        return 0.2;
    }
}
