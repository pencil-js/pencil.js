import Circle from "./circle.js";
import Pie from "./pie.js";
import Widget, { type WidgetOptions } from "./widget.js";
import type { PositionDefinition } from "./position.js";
import { constrain } from "./math.js";

/**
 * Progress pie options
 */
export interface ProgressPieOptions extends WidgetOptions {
    /** Initial value (between 0 and 1) */
    value: number;
    /** Size of the pie */
    radius: number;
    /** Transition speed between two value (0 mean no change, 1 mean instant change) */
    speed: number;
}

/**
 * Pie displaying a progression
 */
export class ProgressPie<O extends ProgressPieOptions = ProgressPieOptions> extends Widget<O> {
    static override get className (): string {
        return "ProgressPie";
    }

    /** Filling of the pie */
    progress: Pie;

    #value = 0;

    /**
     * Progress pie constructor
     * @param positionDefinition - Position of the progress-pie center
     * @param options - Specific options
     */
    constructor (positionDefinition?: PositionDefinition, options?: Partial<O>) {
        super(positionDefinition, Circle, options);

        this.progress = new Pie(this.getOrigin(), this.radius - (this.options.strokeWidth / 2), 0, 0, {
            fill: this.options.foreground,
        });
        this.add(this.progress);

        this.progress.on(ProgressPie.events.draw, () => {
            if (this.options.speed >= 1) {
                this.progress.endAngle = this.value;
            }
            else {
                this.progress.endAngle += (this.value - this.progress.endAngle) * (this.options.speed ** 2);
            }
        }, true);

        this.value = this.options.value;
    }

    /**
     * Size of the pie
     */
    get radius (): number {
        return this.options.radius;
    }

    set radius (newRadius: number) {
        this.options.radius = newRadius;
        this.progress.radius = newRadius - (this.options.strokeWidth / 2);
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
            this.progress.endAngle = this.#value;
        }
    }

    static override get defaultOptions (): ProgressPieOptions {
        return {
            ...super.defaultOptions,
            value: 0,
            radius: 100,
            speed: 0.3,
        };
    }
}

export default ProgressPie;
