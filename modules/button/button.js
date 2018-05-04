import Component from "@pencil.js/component";
import Input from "@pencil.js/input";
import Rectangle from "@pencil.js/rectangle";
import Text from "@pencil.js/text";

/**
 * Button class
 * @class
 * @extends Input
 */
export default class Button extends Input {
    /**
     * Button constructor
     * @param {PositionDefinition} position - Any position
     * @param {ButtonOptions} options -
     */
    constructor (position, options) {
        super(position, options);

        this.background = new Rectangle(undefined, 0, 0, {
            fill: this.options.background,
            stroke: this.options.border,
            strokeWidth: 2,
            cursor: Component.cursors.pointer,
        });
        this.background.on("hover", () => {
            this.background.options.fill = this.options.hover;
        }).on("leave", () => {
            this.background.options.fill = this.options.background;
        });
        this.add(this.background);

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
