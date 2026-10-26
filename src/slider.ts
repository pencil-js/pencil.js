import BaseEvent from "./base-event.js";
import Circle from "./circle.js";
import Rectangle from "./rectangle.js";
import Input, { type InputOptions } from "./input.js";
import MouseEvent from "./mouse-event.js";
import Vector from "./vector.js";
import type Position from "./position.js";
import type { PositionDefinition } from "./position.js";
import type { DraggableAPI } from "./draggable.js";
import { constrain, map } from "./math.js";
import "./draggable.js";

/**
 * Slider options
 */
export interface SliderOptions extends InputOptions {
    /** Minimum value when the slider is at lowest */
    min: number;
    /** Maximum value when the slider is at highest */
    max: number;
    /** Initial value */
    value: number;
    /** Size of the slider */
    width: number;
}

/**
 * Slider input to choose a value in a range
 * @module Slider
 */
export default class Slider<O extends SliderOptions = SliderOptions> extends Input<O> {
    static override get className (): string {
        return "Slider";
    }

    /** Draggable handle */
    handle: Circle;

    #constrainer: Vector;

    #draggable: DraggableAPI;

    /**
     * Slider constructor
     * @param positionDefinition - Top-left corner
     * @param options - Specific options
     */
    constructor (positionDefinition?: PositionDefinition, options?: Partial<O>) {
        super(positionDefinition, Rectangle, options);

        if (this.width < Slider.HEIGHT) {
            throw new RangeError(`Slider is too small, minimum is ${Slider.HEIGHT}px.`);
        }

        const radius = (this.height - 2) / 2;
        this.handle = new Circle([0, this.height / 2], radius, {
            fill: this.options.foreground,
            cursor: Rectangle.cursors.ewResize,
            origin: this.getOrigin(),
        });
        this.add(this.handle);
        this.#constrainer = this.#getConstrainer();
        this.#draggable = this.handle.draggable({
            y: false,
            constrain: this.#constrainer,
        });
        this.handle.on(MouseEvent.events.drag, () => this.fire(new BaseEvent(Slider.events.change, this)), true);

        this.value = this.options.value;
    }

    /**
     * Compute the range of movement of the handle
     */
    #getConstrainer (): Vector {
        const radius = this.handle.radius;
        const middle = this.height / 2;
        return new Vector([radius + 1, middle], [this.width - radius - 1, middle]);
    }

    /**
     * Move the handle where the slider was clicked
     * @param position - Click position relative to the slider
     */
    override click (position: Position): void {
        const origin = this.getOrigin();
        this.handle.position.set(position.x - origin.x, this.height / 2)
            .constrain(this.#constrainer.start, this.#constrainer.end);
        super.click(position);
    }

    /**
     * Size of the slider
     */
    get width (): number {
        return this.options.width;
    }

    set width (newWidth: number) {
        if (newWidth < Slider.HEIGHT) {
            throw new RangeError(`Slider is too small, minimum is ${Slider.HEIGHT}px.`);
        }

        const { value } = this;
        this.options.width = newWidth;
        this.#constrainer = this.#getConstrainer();
        this.#draggable.constrain = this.#constrainer;
        this.value = value;
    }

    /**
     * Height of the slider (read-only)
     */
    get height (): number {
        return Slider.HEIGHT;
    }

    /**
     * Current value
     */
    get value (): number {
        const { min, max } = this.options;
        const { start, end } = this.#constrainer;
        return map(this.handle.position.x, start.x, end.x, min, max);
    }

    set value (newValue: number) {
        const { min, max } = this.options;
        const { start, end } = this.#constrainer;
        this.handle.position.x = map(constrain(newValue, Math.min(min, max), Math.max(min, max)), min, max, start.x, end.x);
    }

    static override get defaultOptions (): SliderOptions {
        return {
            ...super.defaultOptions,
            min: 0,
            max: 1,
            value: 0,
            width: 200,
        };
    }

    /**
     * Height of all sliders
     */
    static get HEIGHT (): number {
        return 20;
    }
}
