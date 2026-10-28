import Input, { type InputOptions } from "./input.js";
import Square from "./square.js";
import type { PositionDefinition } from "./position.js";

/**
 * Checkbox options
 */
export interface CheckboxOptions extends InputOptions {
    /** Width and height of the checkbox */
    size: number;
    /** Whether it's check ot not */
    value: boolean;
}

/**
 * Checkbox input
 */
export class Checkbox<O extends CheckboxOptions = CheckboxOptions> extends Input<O> {
    static override get className (): string {
        return "Checkbox";
    }

    /** Inner check mark */
    fill: Square;

    /**
     * Checkbox constructor
     * @param positionDefinition - Top-left corner
     * @param options - Specific options
     */
    constructor (positionDefinition?: PositionDefinition, options?: Partial<O>) {
        super(positionDefinition, Square, options);

        const margin = this.options.size * Checkbox.MARGIN;
        this.fill = new Square([margin, margin], this.options.size - (2 * margin), {
            fill: this.options.foreground,
            shown: Boolean(this.options.value),
            cursor: this.options.cursor,
            origin: this.getOrigin(),
        });
        this.add(this.fill);
    }

    /**
     * Width of the checkbox
     */
    get width (): number {
        return this.options.size;
    }

    set width (value: number) {
        this.options.size = value;
    }

    /**
     * Height of the checkbox
     */
    get height (): number {
        return this.options.size;
    }

    set height (value: number) {
        this.options.size = value;
    }

    /**
     * Same as width and height
     */
    get size (): number {
        return this.options.size;
    }

    set size (value: number) {
        this.options.size = value;
        const margin = value * Checkbox.MARGIN;
        this.fill.position.set(margin);
        this.fill.size = value - (2 * margin);
    }

    override click (): void {
        this.toggle();
        super.click();
    }

    /**
     * Invert the checkbox value
     * @param newValue - If defined, will force the value
     * @returns The new value
     */
    toggle (newValue = !this.value): boolean {
        this.value = newValue;
        return newValue;
    }

    /**
     * Is checked
     */
    get value (): boolean {
        return this.fill.options.shown;
    }

    set value (value: boolean) {
        if (value) {
            this.fill.show();
        }
        else {
            this.fill.hide();
        }
    }

    static override get defaultOptions (): CheckboxOptions {
        return {
            ...super.defaultOptions,
            size: 20,
            value: false,
        };
    }

    /**
     * Margin ratio around the check mark
     */
    static get MARGIN (): number {
        return 0.2;
    }
}

export default Checkbox;
