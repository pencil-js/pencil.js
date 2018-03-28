import Line from "@pencil.js/line";
import Position from "@pencil.js/position";
import { equal } from "@pencil.js/math";

/**
 * Spline class
 * @class
 * @extends Line
 */
export default class Spline extends Line {
    /**
     * Spline constructor
     * @param {Array<Position>} points - Set of points to go through
     * @param {Number} [tension=0.5] - Ratio of tension between points (0 means straight line, can go higher than 1, but with weird results)
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (points, tension = 0.5, options) {
        super(points, options);

        /**
         * @type {Number}
         */
        this.tension = tension;
    }

    /**
     * Draw the spline
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Spline} Itself
     */
    trace (ctx) {
        if (this.points.length < 3 || equal(this.tension, 0)) {
            super.trace(ctx);
        }
        else {
            ctx.moveTo(0, 0);
            Spline.splineThrough(this.points.map(point => point.subtract(this.position)), this.tension, ctx);
        }
        return this;
    }

    /**
     * Draw a spline through points using a tension
     * @param {Array<Position>} points - Points to use
     * @param {Number} tension - Ratio of tension
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     */
    static splineThrough (points, tension, ctx) {
        const getCtrlPts = Spline.getControlPoint;
        let previousControls = [null, new Position()];
        for (let i = 0, l = points.length; i < l - 1; ++i) {
            const controlPoints = i + 2 < l ? getCtrlPts(points.slice(i, i + 3), tension) : [points[i], null];
            ctx.bezierCurveTo(
                previousControls[1].x, previousControls[1].y, controlPoints[0].x, controlPoints[0].y,
                points[i].x, points[i].y,
            );
            previousControls = controlPoints;
        }
    }

    /**
     * Returns control points for a point in a spline (needs 3 points in total)
     * @param {Array<Position>} points - 3 points to use (before, target, after)
     * @param {Number} tension - Ratio of tension
     * @return {Array<Position>}
     */
    static getControlPoint (points, tension) {
        if (points.length < 3) {
            throw new RangeError(`Need exactly 3 points to compute control points, but ${points.length} given.`);
        }

        const diff = points[2].subtract(points[0]).multiply(tension);
        return [
            points[1].subtract(diff),
            points[1].add(diff),
        ];
    }
}
