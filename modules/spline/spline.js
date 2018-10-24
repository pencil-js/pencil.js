import Line from "@pencil.js/line";
import Position from "@pencil.js/position";
import { equals } from "@pencil.js/math";

/**
 * Spline class
 * @class
 * @extends Line
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
            Spline.splineThrough(path, [new Position(0, 0)].concat(this.points), this.tension);
        }
        return this;
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        return Object.assign(super.toJSON(), {
            tension: this.tension,
        });
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
     * @return {Number}
     */
    static get defaultTension () {
        return 0.2;
    }

    /**
     * Draw a spline through points using a tension (first point should be current position)
     * @param {Path2D} path - Current drawing path
     * @param {Array<PositionDefinition>} points - Points to use (need at least 2 points)
     * @param {Number} [tension=Spline.defaultTension] - Ratio of tension
     */
    static splineThrough (path, points, tension = Spline.defaultTension) {
        if (points.length < 2) {
            throw new RangeError(`Need at least 2 points to spline, but only ${points.length} given.`);
        }

        const positions = points.map(point => Position.from(point));
        if (positions.length === 2) {
            path.lineTo(positions[1].x, positions[1].y);
            return;
        }

        const getCtrlPts = Spline.getControlPoint;
        let previousControls = [null, positions[0]];

        for (let i = 1, l = positions.length; i < l; ++i) {
            const controlPoints = i < l - 1 ? getCtrlPts(positions.slice(i - 1, i + 2), tension) : [positions[i], null];
            path.bezierCurveTo(
                previousControls[1].x, previousControls[1].y, controlPoints[0].x, controlPoints[0].y,
                positions[i].x, positions[i].y,
            );

            previousControls = controlPoints;
        }
    }

    /**
     * Returns control points for a point in a spline (needs before and after, 3 points in total)
     * @param {Array<PositionDefinition>} points - 3 points to use (before, target, after)
     * @param {Number} [tension=Spline.defaultTension] - Ratio of tension
     * @return {Array<Position>}
     */
    static getControlPoint (points, tension = Spline.defaultTension) {
        if (points.length < 3) {
            throw new RangeError(`Need exactly 3 points to compute control points, but ${points.length} given.`);
        }

        const positions = points.map(point => Position.from(point));
        const diff = positions[2].clone().subtract(positions[0]).multiply(tension);
        return [
            positions[1].clone().subtract(diff),
            positions[1].clone().add(diff),
        ];
    }
}
