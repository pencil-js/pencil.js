import Component, { type ComponentOptions } from "./component.js";
import type { ContainerJSON } from "./container.js";
import Position, { type PositionDefinition } from "./position.js";

/**
 * Polygon class (closed shape from a set of vertices)
 * @module Polygon
 */
export default class Polygon<O extends ComponentOptions = ComponentOptions> extends Component<O> {
    static override get className (): string {
        return "Polygon";
    }

    /** Vertices of the polygon */
    points: Array<Position>;

    /**
     * Polygon constructor
     * @param positionDefinition - Position of the polygon
     * @param points - List of vertices (relative to the position)
     * @param options - Drawing options
     */
    constructor (positionDefinition?: PositionDefinition, points: Array<PositionDefinition> = [], options?: Partial<O>) {
        if (points.length < 3) {
            throw new RangeError(`A polygon can't have less than 3 vertices, but only ${points.length} given.`);
        }

        super(positionDefinition, options);

        this.points = points.map(point => Position.from(point));
    }

    /**
     * Draw the polygon
     * @param path - Drawing path
     * @returns Itself
     */
    trace (path: Path2D): this {
        const [first, ...rest] = this.points;
        path.moveTo(first.x, first.y);
        for (const point of rest) {
            path.lineTo(point.x, point.y);
        }
        path.closePath();
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
     * @param definition - Polygon definition
     */
    static override from (definition: ContainerJSON): Polygon {
        return new this(definition.position, definition.points, definition.options);
    }
}
