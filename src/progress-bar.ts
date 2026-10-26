import Rectangle from "./rectangle.js";
import Widget, { type WidgetOptions } from "./widget.js";
import type { PositionDefinition } from "./position.js";
import { constrain } from "./math.js";

/**
 * Progress bar options
 */
export interface ProgressBarOptions extends WidgetOptions {
    /** Initial value (between 0 and 1) */
    value: number;
    /** Size of the bar */
    width: number;
    /** Transition speed between two value (0 mean no change, 1 mean instant change) */
    speed: number;
}

/**
 * Horizontal bar displaying a progression
 * @module ProgressBar
 */
export default class ProgressBar<O extends ProgressBarOptions = ProgressBarOptions> extends Widget<O> {
    static override get className (): string {
        return "ProgressBar";
    }

    /** Filling of the bar */
    progress: Rectangle;

    #value = 0;

    /**
     * Progress bar constructor
     * @param positionDefinition - Top-left corner
     * @param options - Specific options
     */
    constructor (positionDefinition?: PositionDefinition, options?: Partial<O>) {
        super(positionDefinition, Rectangle, options);

        if (this.width < ProgressBar.HEIGHT) {
            throw new RangeError(`Progress-bar is too small, minimum is ${ProgressBar.HEIGHT}px.`);
        }

        this.progress = new Rectangle([1, 1], 0, ProgressBar.HEIGHT - 2, {
            fill: this.options.foreground,
            origin: this.getOrigin(),
        });
        this.add(this.progress);

        this.progress.on(ProgressBar.events.draw, () => {
            const targetWidth = (this.width - 2) * this.value;
            if (this.options.speed >= 1) {
                this.progress.width = targetWidth;
            }
            else {
                this.progress.width += (targetWidth - this.progress.width) * (this.options.speed ** 2);
            }
        }, true);

        this.value = this.options.value;
    }

    /**
     * Size of the bar
     */
    get width (): number {
        return this.options.width;
    }

    set width (newWidth: number) {
        if (newWidth < ProgressBar.HEIGHT) {
            throw new RangeError(`Progress-bar is too small, minimum is ${ProgressBar.HEIGHT}px.`);
        }

        this.options.width = newWidth;
    }

    /**
     * Height of the bar (read-only)
     */
    get height (): number {
        return ProgressBar.HEIGHT;
    }

    /**
     * Current value (between 0 and 1)
     */
    get value (): number {
        return this.#value;
    }

    set value (newValue: number) {
        this.#value = constrain(newValue, 0, 1);

        if (this.options.speed >= 1) {
            this.progress.width = (this.width - 2) * this.#value;
        }
    }

    static override get defaultOptions (): ProgressBarOptions {
        return {
            ...super.defaultOptions,
            value: 0,
            width: 200,
            speed: 0.3,
        };
    }

    /**
     * Height of all progress bars
     */
    static get HEIGHT (): number {
        return 20;
    }
}
