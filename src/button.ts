import Input, { type InputOptions } from "./input.js";
import MouseEvent from "./mouse-event.js";
import Rectangle from "./rectangle.js";
import Text, { type TextOptions } from "./text.js";
import type { Style } from "./component.js";
import type { PositionDefinition } from "./position.js";

/**
 * Button options
 */
export interface ButtonOptions extends InputOptions, Pick<TextOptions, "font" | "fontSize" | "align" | "bold" | "italic" | "underscore" | "lineHeight" | "rounded"> {
    /** Text of the button */
    value: string | Array<string>;
    /** Color of the background when pressed */
    active: Style;
}

/**
 * Clickable button with a text
 * @module Button
 */
export default class Button<O extends ButtonOptions = ButtonOptions> extends Input<O> {
    static override get className (): string {
        return "Button";
    }

    /** Displayed text */
    text: Text;

    /**
     * Button constructor
     * @param positionDefinition - Position of the top-left corner
     * @param options - Specific options
     */
    constructor (positionDefinition?: PositionDefinition, options?: Partial<O>) {
        super(positionDefinition, Rectangle, options);

        const { options: settings } = this;
        this.text = new Text(undefined, settings.value, {
            fill: settings.foreground,
            cursor: settings.cursor,
            font: settings.font,
            fontSize: settings.fontSize,
            align: settings.align,
            bold: settings.bold,
            italic: settings.italic,
            underscore: settings.underscore,
            lineHeight: settings.lineHeight,
        });
        this.add(this.text);

        // Visual feedback when pressed
        let fill: Button["options"]["fill"] | undefined;
        const release = () => {
            if (fill !== undefined) {
                this.options.fill = fill;
                fill = undefined;
            }
        };
        this.on(MouseEvent.events.down, () => {
            fill = this.options.fill;
            this.options.fill = this.options.active;
        }).on([MouseEvent.events.up, MouseEvent.events.leave], release);

        this.value = settings.value;
    }

    /**
     * Size of the button
     */
    get size (): { width: number; height: number } {
        const measures = this.text.getMeasures();
        const margin = Text.measure("M", this.text.options).height * Button.MARGIN;
        return {
            width: measures.width + (margin * 4),
            height: measures.height + (margin * 2),
        };
    }

    /**
     * Width of the button (read-only)
     */
    get width (): number {
        return this.size.width;
    }

    /**
     * Height of the button (read-only)
     */
    get height (): number {
        return this.size.height;
    }

    /**
     * Button don't fire "change" on click
     */
    override click (): void {
        // Don't need to fire "change" on a button
    }

    /**
     * Text of the button
     */
    get value (): string {
        return this.text.text;
    }

    set value (value: string | Array<string>) {
        this.text.text = value;
        const margin = Text.measure("M", this.text.options).height * Button.MARGIN;
        this.text.position.set(this.getOrigin()).add(margin * 2, margin);
    }

    static override get defaultOptions (): ButtonOptions {
        return {
            ...Text.defaultOptions,
            ...super.defaultOptions,
            value: "",
            active: "#c8c8c8",
        };
    }

    /**
     * Margin ratio around the text
     */
    static get MARGIN (): number {
        return 0.2;
    }
}
