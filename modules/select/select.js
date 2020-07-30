import Component from "@pencil.js/component";
import Input from "@pencil.js/input";
import MouseEvent from "@pencil.js/mouse-event";
import BaseEvent from "@pencil.js/base-event";
import Rectangle from "@pencil.js/rectangle";
import Text from "@pencil.js/text";
import { constrain } from "@pencil.js/math";
import Triangle from "@pencil.js/triangle";

const selectedKey = Symbol("_selected");

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
        super(positionDefinition, Rectangle, options);
        this[selectedKey] = 0;

        const textOptions = {
            cursor: Component.cursors.pointer,
            fill: this.options.foreground,
            font: this.options.font,
            fontSize: this.options.fontSize,
            align: this.options.align,
            bold: this.options.bold,
            italic: this.options.italic,
            underscore: this.options.underscore,
            lineHeight: this.options.lineHeight,
        };
        const margin = Text.measure("M", textOptions).height * Select.MARGIN;
        this.display = new Text(undefined, "", textOptions);

        this.optionsList = optionsList.map(option => new Text([(margin * 2) - 1, margin], option || "", textOptions));
        const maxWidth = Math.max(...this.optionsList.map(text => text.width));

        textOptions.origin = [maxWidth * this.display.getAlignOffset(), 0];

        this.optionsContainer = new Rectangle(undefined, this.width, 0, {
            fill: this.options.fill,
            stroke: this.options.stroke,
            strokeWidth: this.options.strokeWidth,
        });
        this.optionsContainer.hide();
        let position = 0;
        this.optionsList.forEach((text, index) => {
            const rect = new Rectangle([1, position + 1], maxWidth + (6 * margin) - 2, text.height + (2 * margin), {
                fill: this.options.fill,
                cursor: Component.cursors.pointer,
            });
            position += rect.height;
            let fill;
            rect
                .on(MouseEvent.events.hover, () => {
                    fill = fill || rect.options.fill;
                    rect.options.fill = this.options.hover;
                })
                .on(MouseEvent.events.leave, () => {
                    rect.options.fill = fill;
                    fill = null;
                })
                .on(MouseEvent.events.click, (event) => {
                    event.stop();
                    this.value = index;
                    this.fire(new BaseEvent(Select.events.change, this));
                });
            rect.add(text);

            this.optionsContainer.add(rect);
        });

        this.optionsContainer.height = position + 2;

        this.arrow = new Triangle([maxWidth + (4 * margin), this.height / 2], margin, {
            fill: this.options.foreground,
            rotation: 0.5,
            cursor: Component.cursors.pointer,
        });
        this.add(this.display, this.optionsContainer, this.arrow);
    }

    /**
     * Computer button size
     * @return {{width: Number, height: Number}}
     */
    get size () {
        const measures = this.optionsList[this.value].getMeasures();
        const maxWidth = Math.max(...this.optionsList.map(text => text.width));
        const margin = Text.measure("M", this.optionsList[this.value].options).height * Select.MARGIN;
        return {
            width: maxWidth + (margin * 6),
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
     * @return {Number}
     */
    get value () {
        return this[selectedKey];
    }

    /**
     * @param {Number} value - Index of the selected option
     */
    set value (value) {
        this[selectedKey] = constrain(value, 0, this.optionsList.length - 1);
        this.display.text = this.optionsList[this.value].text;
        const margin = this.optionsList[0].height * Select.MARGIN;
        const origin = this.getOrigin();
        this.display.options.origin.set(origin.clone().add(margin * 2, margin));
        this.arrow.options.origin.set(origin.clone().multiply(-1));
        this.optionsContainer.hide();
        if (this.isHovered) {
            this.fire(new MouseEvent(MouseEvent.events.leave, this));
        }
    }

    /**
     * @override
     */
    click () {
        const { position } = this.optionsList[this.value].parent;
        this.optionsContainer.position.set(this.getOrigin()).subtract(position).add(1, 0);
        this.optionsContainer.show();
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const json = super.toJSON();
        json.values = this.optionsList.map(component => component.text);
        return json;
    }

    /**
     * @inheritDoc
     * @param {Object} definition - Select definition
     * @return {Select}
     */
    static from (definition) {
        return new Select(definition.position, definition.values, definition.options);
    }

    /**
     * @typedef {Object} SelectOptions
     * @extends TextOptions
     * @extends InputOptions
     * @prop {String} [value=0] - Selected index of the select
     */
    /**
     * @return {SelectOptions}
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
