import Input from "@pencil.js/input";
import Rectangle from "@pencil.js/rectangle";
import Text from "@pencil.js/text";
import Component from "@pencil.js/component";

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

        this.bakground = new Rectangle(undefined, 0, 0, {
            fill: this.options.background,
            stroke: this.options.border,
            strokeWidth: 2,
            cursor: Component.cursors.pointer,
        });
        this.add(this.bakground);

        this.text = new Text(undefined, this.options.value, {
            fill: this.options.fill,
            cursor: Component.cursors.pointer,
            font: this.options.font,
            fontSize: this.options.fontSize,
            bold: this.options.bold,
            italic: this.options.italic,
        });
        this.add(this.text);

        this.isPressed = false;
        this.on("mousedown", () => {
            if (!this.isPressed) {
                this.text.position.add(0, 1);
                this.isPressed = true;
            }
        });
        this.getScene().then((scene) => {
            scene.on("mouseup", () => {
                if (this.isPressed) {
                    this.text.position.subtract(0, 1);
                    this.isPressed = false;
                }
            });
        });
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
        this.bakground.height = measures.height + margin;
        this.bakground.width = measures.width + (margin * 4);
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
