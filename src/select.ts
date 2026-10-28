import BaseEvent from "./base-event.js";
import Component from "./component.js";
import type { ContainerJSON } from "./container.js";
import Input, { type InputOptions } from "./input.js";
import MouseEvent from "./mouse-event.js";
import Rectangle from "./rectangle.js";
import Text, { type TextOptions } from "./text.js";
import Triangle from "./triangle.js";
import { constrain } from "./math.js";
import type { PositionDefinition } from "./position.js";

/**
 * Select options
 */
export interface SelectOptions extends InputOptions, Pick<TextOptions, "font" | "fontSize" | "align" | "bold" | "italic" | "underscore" | "lineHeight"> {
    /** Selected index */
    value: number;
}

/**
 * Drop-down list input
 */
export class Select<O extends SelectOptions = SelectOptions> extends Input<O> {
    static override get className (): string {
        return "Select";
    }

    /** Text displaying the selected option */
    display: Text;

    /** Texts of all options */
    optionsList: Array<Text>;

    /** Container of the drop-down list */
    optionsContainer: Rectangle;

    /** Drop-down arrow */
    arrow: Triangle;

    #selected = 0;

    /**
     * Select constructor
     * @param positionDefinition - Any position
     * @param optionsList - List of options to display
     * @param options - Drawing options
     */
    constructor (positionDefinition: PositionDefinition | undefined, optionsList: Array<string>, options?: Partial<O>) {
        if (!optionsList?.length) {
            throw new RangeError("Options list should have at least one item.");
        }
        super(positionDefinition, Rectangle, options);

        const textOptions: Partial<TextOptions> = {
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

        this.optionsContainer = new Rectangle(undefined, this.width, 0, {
            fill: this.options.fill,
            stroke: this.options.stroke,
            strokeWidth: this.options.strokeWidth,
            zIndex: 10,
        });
        this.optionsContainer.hide();
        let position = 0;
        this.optionsList.forEach((text, index) => {
            const rect = new Rectangle([1, position + 1], maxWidth + (6 * margin) - 2, text.height + (2 * margin), {
                fill: this.options.fill,
                cursor: Component.cursors.pointer,
            });
            position += rect.height;
            let fill: Rectangle["options"]["fill"] | undefined;
            rect
                .on(MouseEvent.events.hover, () => {
                    fill ??= rect.options.fill;
                    rect.options.fill = this.options.hover;
                })
                .on(MouseEvent.events.leave, () => {
                    if (fill !== undefined) {
                        rect.options.fill = fill;
                        fill = undefined;
                    }
                })
                .on(MouseEvent.events.click, (event: MouseEvent) => {
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

        this.value = this.options.value;
    }

    /**
     * Size of the select
     */
    get size (): { width: number; height: number } {
        const current = this.optionsList[this.value];
        const measures = current.getMeasures();
        const maxWidth = Math.max(...this.optionsList.map(text => text.width));
        const margin = Text.measure("M", current.options).height * Select.MARGIN;
        return {
            width: maxWidth + (margin * 6),
            height: measures.height + (margin * 2),
        };
    }

    /**
     * Width of the select (read-only)
     */
    get width (): number {
        return this.size.width;
    }

    /**
     * Height of the select (read-only)
     */
    get height (): number {
        return this.size.height;
    }

    /**
     * Index of the selected option
     */
    get value (): number {
        return this.#selected;
    }

    set value (value: number) {
        this.#selected = constrain(value, 0, this.optionsList.length - 1);
        this.display.text = this.optionsList[this.value].text;
        const margin = this.optionsList[0].height * Select.MARGIN;
        const origin = this.getOrigin();
        this.display.position.set(origin.clone().add(margin * 2, margin));
        this.optionsContainer.hide();
        if (this.isHovered) {
            this.fire(new MouseEvent(MouseEvent.events.leave, this));
        }
    }

    /**
     * Open the drop-down list
     */
    override click (): void {
        const parent = this.optionsList[this.value].parent;
        this.optionsContainer.position.set(this.getOrigin()).subtract(parent?.position).add(1, 0);
        this.optionsContainer.show();
    }

    override toJSON (): ContainerJSON {
        return {
            ...super.toJSON(),
            values: this.optionsList.map(component => component.text),
        };
    }

    /**
     * Return an instance from a generic object
     * @param definition - Select definition
     */
    static override from (definition: ContainerJSON): Select {
        return new this(definition.position, definition.values, definition.options);
    }

    static override get defaultOptions (): SelectOptions {
        return {
            ...Text.defaultOptions,
            ...super.defaultOptions,
            value: 0,
        };
    }

    /**
     * Margin ratio around the text
     */
    static get MARGIN (): number {
        return 0.2;
    }
}

export default Select;
