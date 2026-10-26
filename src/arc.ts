import Component, { type ComponentOptions } from "./component.js";
import type { ContainerJSON } from "./container.js";
import Line from "./line.js";
import type { PositionDefinition } from "./position.js";
import { radianCircle } from "./math.js";

/**
 * Portion of an ellipse outline
 */
export class Arc<O extends ComponentOptions = ComponentOptions> extends Component<O> {
    static override get className (): string {
        return "Arc";
    }

    /** Horizontal radius */
    width: number;

    /** Vertical radius */
    height: number;

    /** Starting angle (in ratio of full circle, 0 is up) */
    startAngle: number;

    /** Ending angle (in ratio of full circle, 0 is up) */
    endAngle: number;

    /**
     * Arc constructor
     * @param positionDefinition - Center of the arc
     * @param width - Horizontal radius
     * @param height - Vertical radius
     * @param startAngle - Angle to start from (0 is top, 0.5 is bottom and 1 is full circle back to top)
     * @param endAngle - Angle to end to (from startAngle and in clockwise rotation)
     * @param options - Drawing options
     */
    constructor (positionDefinition?: PositionDefinition, width = 0, height = 0, startAngle = 0, endAngle = 0.5, options?: Partial<O>) {
        super(positionDefinition, options);
        this.width = width;
        this.height = height;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }

    /**
     * Draw the arc
     * @param path - Drawing path
     * @returns Itself
     */
    trace (path: Path2D): this {
        const correction = -0.25;
        const startAngle = (this.startAngle + correction) * radianCircle;
        const endAngle = (this.endAngle + correction) * radianCircle;
        path.ellipse(0, 0, Math.abs(this.width), Math.abs(this.height), 0, startAngle, endAngle);
        return this;
    }

    override toJSON (): ContainerJSON {
        const { width, height, startAngle, endAngle } = this;
        return {
            ...super.toJSON(),
            width,
            height,
            startAngle,
            endAngle,
        };
    }

    /**
     * Return an instance from a generic object
     * @param definition - Arc definition
     */
    static override from (definition: ContainerJSON): Arc {
        return new this(
            definition.position,
            definition.width, definition.height,
            definition.startAngle, definition.endAngle,
            definition.options,
        );
    }

    /**
     * Default options for this class
     */
    static override get defaultOptions (): ComponentOptions {
        return Line.defaultOptions;
    }

    /**
     * How lines end
     */
    static get caps () {
        return Line.caps;
    }
}

export default Arc;
