import Line, { type LineOptions } from "./line.js";
import type { ContainerJSON } from "./container.js";
import Position, { type PositionDefinition } from "./position.js";
import { equals } from "./math.js";

/**
 * Compute the two control points to go from one point to the next
 * @param points - Previous, current, target and next points
 * @param tension - Ratio of tension
 */
function getControlPoint (points: Array<Position | undefined>, tension: number): [Position, Position] {
    const [previous, current, target, next] = points as [Position | undefined, Position, Position, Position | undefined];

    const diffBefore = previous ? target.clone().subtract(previous).multiply(tension) : new Position();
    const diffAfter = next ? current.clone().subtract(next).multiply(tension) : new Position();

    return [
        current.clone().add(diffBefore),
        target.clone().add(diffAfter),
    ];
}

/**
 * Smooth line going through all its points
 * @module Spline
 */
export default class Spline<O extends LineOptions = LineOptions> extends Line<O> {
    static override get className (): string {
        return "Spline";
    }

    /** Ratio of tension (0 means straight lines) */
    tension: number;

    /**
     * Spline constructor
     * @param positionDefinition - First point
     * @param points - Set of points to go through
     * @param tension - Ratio of tension
     * @param options - Drawing options
     */
    constructor (
        positionDefinition?: PositionDefinition,
        points: Array<PositionDefinition> = [],
        tension = Spline.defaultTension,
        options?: Partial<O>,
    ) {
        super(positionDefinition, points, options);

        this.tension = tension;
    }

    override trace (path: Path2D): this {
        if (this.points.length < 2 || equals(this.tension, 0)) {
            return super.trace(path);
        }

        path.moveTo(0, 0);
        const correction = this.options.absolute ? this.position : new Position();
        Spline.splineThrough(path, [new Position().add(correction), ...this.points], this.tension, correction);
        return this;
    }

    override toJSON (): ContainerJSON {
        return {
            ...super.toJSON(),
            tension: this.tension,
        };
    }

    /**
     * Return an instance from a generic object
     * @param definition - Spline definition
     */
    static override from (definition: ContainerJSON): Spline {
        return new this(definition.position, definition.points, definition.tension, definition.options);
    }

    /**
     * Default ratio of tension
     */
    static get defaultTension (): number {
        return 0.2;
    }

    /**
     * Draw a spline through points using a tension (first point should be current position)
     * @param path - Current drawing path
     * @param points - Set of points to go through
     * @param tension - Ratio of tension
     * @param correction - Shift all points by this amount
     */
    static splineThrough (
        path: Path2D,
        points: Array<PositionDefinition>,
        tension = Spline.defaultTension,
        correction?: PositionDefinition,
    ): void {
        if (points.length < 2) {
            throw new RangeError(`Need at least 2 points to spline, but only ${points.length} given.`);
        }

        const shift = Position.from(correction);
        const positions = points.map(point => Position.from(point).clone().subtract(shift));

        if (positions.length === 2) {
            path.lineTo(positions[1].x, positions[1].y);
            return;
        }

        for (let i = 1; i < positions.length; ++i) {
            const slice = [positions[i - 2], positions[i - 1], positions[i], positions[i + 1]];
            const [before, after] = getControlPoint(slice, tension);

            path.bezierCurveTo(
                before.x, before.y,
                after.x, after.y,
                positions[i].x, positions[i].y,
            );
        }
    }
}
