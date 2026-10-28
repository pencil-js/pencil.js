import Line, { type LineOptions } from "./line.js";
import type { ContainerJSON } from "./container.js";
import Position, { type PositionDefinition } from "./position.js";
import { equals } from "./math.js";

/**
 * Draw a spline from a starting point through a list of points (computed with numbers only, no allocation)
 * @param path - Drawing path
 * @param startX - Horizontal starting position
 * @param startY - Vertical starting position
 * @param points - Points to go through after the start
 * @param tension - Ratio of tension
 * @param shiftX - Horizontal shift applied to every point
 * @param shiftY - Vertical shift applied to every point
 * @internal
 */
export function traceSpline (
    path: Path2D,
    startX: number,
    startY: number,
    points: ReadonlyArray<PositionDefinition>,
    tension: number,
    shiftX = 0,
    shiftY = 0,
): void {
    const count = points.length + 1;
    // Point at an index of the virtual list [start, ...points]
    const read = (index: number, axis: "x" | "y"): number => {
        if (index === 0) {
            return axis === "x" ? startX : startY;
        }
        const point = points[index - 1];
        return (point instanceof Position ? point : Position.from(point))[axis];
    };

    if (count === 2) {
        path.lineTo(read(1, "x") - shiftX, read(1, "y") - shiftY);
        return;
    }

    for (let i = 1; i < count; ++i) {
        const currentX = read(i - 1, "x");
        const currentY = read(i - 1, "y");
        const targetX = read(i, "x");
        const targetY = read(i, "y");
        // First control point follows the direction from the previous point to the target
        const before = i >= 2;
        const control1X = currentX + (before ? (targetX - read(i - 2, "x")) * tension : 0);
        const control1Y = currentY + (before ? (targetY - read(i - 2, "y")) * tension : 0);
        // Second control point follows the direction from the next point to the current one
        const after = i + 1 < count;
        const control2X = targetX + (after ? (currentX - read(i + 1, "x")) * tension : 0);
        const control2Y = targetY + (after ? (currentY - read(i + 1, "y")) * tension : 0);

        path.bezierCurveTo(
            control1X - shiftX, control1Y - shiftY,
            control2X - shiftX, control2Y - shiftY,
            targetX - shiftX, targetY - shiftY,
        );
    }
}

/**
 * Smooth line going through all its points
 */
export class Spline<O extends LineOptions = LineOptions> extends Line<O> {
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
        if (this.options.absolute) {
            const { x, y } = this.position;
            traceSpline(path, x, y, this.points, this.tension, x, y);
        }
        else {
            traceSpline(path, 0, 0, this.points, this.tension);
        }
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

        const [start, ...rest] = points;
        const { x, y } = Position.from(start);
        const shift = correction === undefined ? null : Position.from(correction);
        traceSpline(path, x, y, rest, tension, shift?.x, shift?.y);
    }
}

export default Spline;
