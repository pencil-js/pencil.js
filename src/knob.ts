import BaseEvent from "./base-event.js";
import Circle from "./circle.js";
import Component from "./component.js";
import Input, { type InputOptions } from "./input.js";
import Line from "./line.js";
import MouseEvent from "./mouse-event.js";
import type { PositionDefinition } from "./position.js";
import { map, modulo } from "./math.js";
import "./rotatable.js";

/**
 * Knob options
 */
export interface KnobOptions extends InputOptions {
    /** Minimum value when the knob is at lowest */
    min: number;
    /** Maximum value when the knob is at highest */
    max: number;
    /** Initial value */
    value: number;
    /** Radius of the knob */
    radius: number;
}

/**
 * Rotating knob input
 */
export class Knob<O extends KnobOptions = KnobOptions> extends Input<O> {
    static override get className (): string {
        return "Knob";
    }

    /** Notch showing the current value */
    notch: Line;

    /**
     * Knob constructor
     * @param positionDefinition - Position of the center
     * @param options - Specific options
     */
    constructor (positionDefinition?: PositionDefinition, options?: Partial<O>) {
        super(positionDefinition, Circle, options);

        const origin = this.getOrigin();
        this.options.rotationCenter = origin;
        const strokeWidth = this.radius * Knob.NOTCH_SIZE;
        const margin = this.radius / 3;
        this.notch = new Line([0, -margin], [[0, -this.radius + margin + strokeWidth]], {
            stroke: this.options.foreground,
            strokeWidth,
            cursor: Component.cursors.grab,
            origin,
        });
        this
            .add(this.notch)
            .on(MouseEvent.events.rotate, () => this.fire(new BaseEvent(Knob.events.change, this)), true)
            .rotatable();

        this.value = this.options.value;
    }

    /**
     * Radius of the knob
     */
    get radius (): number {
        return this.options.radius;
    }

    set radius (value: number) {
        this.options.radius = value;
    }

    /**
     * Knob don't react to click
     */
    override click (): void {
        // Do nothing
    }

    /**
     * Current value
     */
    get value (): number {
        return map(modulo(this.options.rotation, 1), 0, 1, this.options.min, this.options.max);
    }

    set value (newValue: number) {
        this.options.rotation = modulo(map(newValue, this.options.min, this.options.max, 0, 1), 1);
    }

    static override get defaultOptions (): KnobOptions {
        return {
            ...super.defaultOptions,
            cursor: Component.cursors.default,
            min: 0,
            max: 1,
            value: 0,
            radius: 100,
        };
    }

    /**
     * Ratio of the notch size relative to the radius
     */
    static get NOTCH_SIZE (): number {
        return 0.09;
    }
}

export default Knob;
