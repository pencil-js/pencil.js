import Component, { type ComponentOptions } from "./component.js";
import type { ContainerJSON } from "./container.js";
import Position, { type PositionDefinition } from "./position.js";

/**
 * Line options
 */
export interface LineOptions extends ComponentOptions {
    /** How the line end */
    cap: CanvasLineCap;
    /** Should points be considered as absolute coordinates (in the parent space) instead of relative to the line position */
    absolute: boolean;
}

/**
 * Line class (a set of connected segments)
 * @module Line
 */
export default class Line<O extends LineOptions = LineOptions> extends Component<O> {
    static override get className (): string {
        return "Line";
    }

    /** Points to go through */
    points: Array<Position>;

    /**
     * Line constructor
     * @param positionDefinition - First point
     * @param points - List of points to go through
     * @param options - Drawing options
     */
    constructor (positionDefinition?: PositionDefinition, points: Array<PositionDefinition> = [], options?: Partial<O>) {
        super(positionDefinition, options);

        this.points = points.map(point => Position.from(point));
    }

    /**
     * Draw the line
     * @param path - Drawing path
     * @returns Itself
     */
    trace (path: Path2D): this {
        path.moveTo(0, 0);
        const { x, y } = this.options.absolute ? this.position : new Position();
        for (const point of this.points) {
            path.lineTo(point.x - x, point.y - y);
        }
        return this;
    }

    override toJSON (): ContainerJSON {
        return {
            ...super.toJSON(),
            points: this.points.map(point => point.toJSON()),
        };
    }

    /**
     * Return an instance from a generic object
     * @param definition - Line definition
     */
    static override from (definition: ContainerJSON): Line {
        return new this(definition.position, definition.points, definition.options);
    }

    /**
     * Default options for this class
     */
    static override get defaultOptions (): LineOptions {
        const componentOptions = super.defaultOptions;
        return {
            ...componentOptions,
            cap: Line.caps.round,
            join: Line.joins.round,
            fill: null,
            stroke: componentOptions.fill,
            absolute: false,
        };
    }

    /**
     * How lines end
     */
    static get caps () {
        return {
            /** Flat end */
            butt: "butt",
            /** Rounded end */
            round: "round",
            /** Squared end (extend the line by half its width) */
            square: "square",
        } as const;
    }
}
