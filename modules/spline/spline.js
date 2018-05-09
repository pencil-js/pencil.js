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
     * @param {Array<PositionDefinition>} points - Set of points to go through
     * @param {Number} [tension=Spline.defaultTension] - Ratio of tension between points (0 means straight line, can take any value, but with weird results above 1)
     * @param {LineOptions} [options] - Drawing options
     */
    constructor (points, tension = Spline.defaultTension, options) {
        super(points, options);

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
        if (this.points.length < 3 || equals(this.tension, 0)) {
            super.trace(path);
        }
        else {
            path.lineCap = this.options.cap;
            Spline.splineThrough(path, this.points.map(point => point.clone().subtract(this.position)), this.tension);
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
        return new Spline(definition.points, definition.tension, definition.options);
    }

    /**
     * Default ratio of tension
     * @return {Number}
     */
    static get defaultTension () {
        return 0.2;
    }

    /**
     * Draw a spline through points using a tension
     * @param {Path2D} path - Current drawing path
     * @param {Array<PositionDefinition>} points - Points to use
     * @param {Number} [tension=Spline.defaultTension] - Ratio of tension
     */
    static splineThrough (path, points, tension = Spline.defaultTension) {
        const getCtrlPts = Spline.getControlPoint;
        const positions = points.map(point => Position.from(point));
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
     * @param {Array<Position>} points - 3 points to use (before, target, after)
     * @param {Number} tension - Ratio of tension
     * @return {[Position, Position]}
     */
    static getControlPoint (points, tension) {
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
