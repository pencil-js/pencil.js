import Component from "@pencil.js/component";
import Input from "@pencil.js/input";
import MouseEvent from "@pencil.js/mouse-event";
import BaseEvent from "@pencil.js/base-event";
import Rectangle from "@pencil.js/rectangle";
import Text from "@pencil.js/text";
import { constrain } from "@pencil.js/math";
import Triangle from "@pencil.js/triangle";

/**
 * Select class
 * @class
 * @extends Input
 */
export default class Select extends Input {
    /**
     * Select constructor
     * @param {PositionDefinition} positionDefinition - Any position
     * @param {Array<String>} optionsList - List of options to display
     * @param {InputOptions} [options] - Drawing options
     */
    constructor (positionDefinition, optionsList, options) {
        if (!optionsList.length) {
            throw new RangeError("Options list should have at least one item.");
        }
        super(positionDefinition, options);
        this.selected = 0;

        const textOptions = {
            fill: this.options.fill,
            font: this.options.font,
            fontSize: this.options.fontSize,
            bold: this.options.bold,
            italic: this.options.italic,
            cursor: Component.cursors.pointer,
        };
        const margin = Text.measure("M", textOptions).height * Select.MARGIN;
        this.display = new Text([margin * 2, margin], "", textOptions);
        this.background.add(this.display);

        this.optionsList = optionsList.map(option => new Text([margin * 2, margin], option || "", textOptions));
        const maxWidth = Math.max(...this.optionsList.map(text => text.width));

        this.background.width = maxWidth + (6 * margin);
        this.background.height = this.optionsList[0].height + (2 * margin);

        this.optionsContainer = new Rectangle(undefined, this.background.width, 0, this.background.options);
        this.optionsContainer.hide();
        this.add(this.optionsContainer);
        let position = 0;
        this.optionsList.forEach((text, index) => {
            const rect = new Rectangle([1, position + 1], maxWidth + (6 * margin) - 2, text.height + (2 * margin), {
                fill: this.options.background,
                cursor: Component.cursors.pointer,
            });
            position += rect.height;
            rect.on(MouseEvent.events.hover, () => rect.options.fill = this.options.hover)
                .on(MouseEvent.events.leave, () => rect.options.fill = this.options.background)
                .on(MouseEvent.events.click, () => {
                    this.value = index;
                    this.fire(new BaseEvent(Select.events.change, this));
                });
            rect.add(text);

            this.optionsContainer.add(rect);
        });

        this.optionsContainer.height = position + 2;

        const arrow = new Triangle([maxWidth + (3.5 * margin), this.background.height / 2], margin, {
            fill: this.options.fill,
            rotation: 0.5,
            cursor: Component.cursors.pointer,
        });
        this.background.add(arrow);
    }

    /**
     * @return {Number}
     */
    get value () {
        return this.selected;
    }

    /**
     * @param {Number} value - Index of the selected option
     */
    set value (value) {
        this.selected = constrain(value, 0, this.optionsList.length - 1);
        this.display.text = this.optionsList[this.selected].text;
        this.optionsContainer.hide();
        const margin = this.optionsList[0].height * Select.MARGIN;
        this.optionsContainer.position.set(0, -this.selected * (this.optionsList[0].height + (2 * margin)));
    }

    /**
     * @override
     */
    click () {
        this.optionsContainer.show();
    }

    /**
     * @typedef {Object} ButtonOptions
     * @extends InputOptions
     * @extends TextOptions
     * @prop {String} value - Value of the button
     */
    /**
     * @return {ButtonOptions}
     */
    static get defaultOptions () {
        return {
            ...Text.defaultOptions,
            ...super.defaultOptions,
            value: 0,
        };
    }

    /**
     * Margin around the text
     * @return {Number}
     */
    static get MARGIN () {
        return 0.2;
    }
}
