import Line from "@pencil.js/line";
import Position from "@pencil.js/position";
import { equals } from "@pencil.js/math";

/**
 * @module Spline
 */

/**
 * Spline class
 * <br><img src="./media/examples/spline.png" alt="spline demo"/>
 * @class
 * @extends {module:Line}
 */
export default class Spline extends Line {
    /**
     * Spline constructor
     * @param {PositionDefinition} positionDefinition - First point
     * @param {Array<PositionDefinition>|PositionDefinition} points - Set of points to go through or a single target point
     * @param {Number} [tension=Spline.defaultTension] - Ratio of tension between points (0 means straight line, can take any value, but with weird results above 1)
     * @param {LineOptions} [options] - Drawing options
     */
    constructor (positionDefinition, points, tension = Spline.defaultTension, options) {
        super(positionDefinition, points, options);

        /**
         * @type {Number}
         */
        this.tension = tension;
    }

    /**
     * Draw the spline
     * @param {Path2D} path - Current drawing path
     * @return {Spline} Itself
     */
    trace (path) {
        if (this.points.length === 1 || equals(this.tension, 0)) {
            super.trace(path);
        }
        else {
            path.moveTo(0, 0);
            const correction = this.options.absolute ? this.position : new Position();
            Spline.splineThrough(path, [new Position(), ...this.points], this.tension, correction);
        }
        return this;
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const { tension } = this;
        return {
            ...super.toJSON(),
            tension,
        };
    }

    /**
     * @inheritDoc
     * @param {Object} definition - Spline definition
     * @return {Spline}
     */
    static from (definition) {
        return new Spline(definition.position, definition.points, definition.tension, definition.options);
    }

    /**
     * Default ratio of tension
     * @type {Number}
     */
    static get defaultTension () {
        return 0.2;
    }

    /**
     * Draw a spline through points using a tension (first point should be current position)
     * @param {Path2D|CanvasRenderingContext2D} path - Current drawing path
     * @param {Array<PositionDefinition>} points - Points to use (need at least 2 points)
     * @param {Number} [tension=Spline.defaultTension] - Ratio of tension
     * @param {PositionDefinition} [_correction] - Apply position correction to all points (used by the library)
     */
    static splineThrough (path, points, tension = Spline.defaultTension, _correction) {
        if (points.length < 2) {
            throw new RangeError(`Need at least 2 points to spline, but only ${points.length} given.`);
        }

        const shift = Position.from(_correction);

        if (points.length === 2) {
            const target = Position.from(points[1]);
            path.lineTo(target.x - shift.x, target.y - shift.y);
            return;
        }

        const positions = points.map(point => Position.from(point).clone().subtract(shift));

        for (let i = 1; i < positions.length; ++i) {
            const slice = [...new Array(4)].map((_, n) => positions[i + n - 2]);
            // eslint-disable-next-line no-use-before-define
            const [before, after] = getControlPoint(slice, tension);

            path.bezierCurveTo(
                before.x, before.y,
                after.x, after.y,
                positions[i].x, positions[i].y,
            );
        }
    }
}

/**
 * Returns control points for a point in a spline (needs before and after, 3 points in total)
 * @param {Array<Position>} points - 4 points to use (before, one, two, after)
 * @param {Number} [tension=Spline.defaultTension] - Ratio of tension
 * @return {Array<Position>}
 */
function getControlPoint (points, tension = Spline.defaultTension) {
    const [previous, current, target, next] = points;

    let diffBefore;
    let diffAfter;
    if (previous) {
        diffBefore = target.clone().subtract(previous).multiply(tension);
    }
    if (next) {
        diffAfter = current.clone().subtract(next).multiply(tension);
    }
    return [
        points[1].clone().add(diffBefore),
        points[2].clone().add(diffAfter),
    ];
}
