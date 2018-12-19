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
     * @param {InputOptions} options - Drawing options
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
        this.display = new Text([0, 0], "", textOptions);
        this.background.add(this.display);

        this.optionsContainer = new Rectangle([0, 0], 0, 0, this.background.options);
        this.optionsContainer.hide();
        this.add(this.optionsContainer);
        let maxWidth = 0;
        this.optionsList = optionsList.map((option) => {
            const text = new Text([0, 0], option || "", textOptions);
            const margin = text.height * Select.MARGIN;
            text.position.set(margin * 2, margin);
            if (text.width > maxWidth) {
                maxWidth = text.width;
            }
            return text;
        });
        let pos = 0;
        this.optionsList.forEach((text, index) => {
            const margin = text.height * Select.MARGIN;
            const rect = new Rectangle([0, pos], maxWidth + (6 * margin), text.height + (2 * margin), {
                fill: null,
                cursor: Component.cursors.pointer,
            });
            pos += text.height + (2 * margin);
            rect.on(MouseEvent.events.hover, () => rect.options.fill = this.options.hover)
                .on(MouseEvent.events.leave, () => rect.options.fill = null)
                .on(MouseEvent.events.click, () => {
                    this.value = index;
                    this.fire(new BaseEvent(Select.events.change, this));
                });
            rect.add(text);
            this.optionsContainer.add(rect);
        });
        const margin = this.optionsList[0].height * Select.MARGIN;

        this.display.position.set(margin * 2, margin);

        this.background.width = maxWidth + (6 * margin);
        this.background.height = this.optionsList[0].height + (2 * margin);
        this.optionsContainer.width = this.background.width;
        this.optionsContainer.height = (this.optionsList[0].height + (2 * margin)) * this.optionsList.length;

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
