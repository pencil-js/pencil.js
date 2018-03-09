import Component from "@pencil.js/component";
import Vector from "@pencil.js/vector";
import { truncate } from "@pencil.js/math";

/**
 * Polygon class
 * @class
 * @extends Component
 */
export default class Polygon extends Component {
    /**
     * Polygon constructor
     * @param {Array<Position>} points - Set of vertices defining the polygon
     * @param {ComponentOptions} options - Drawing options
     */
    constructor (points, options) {
        const min = Polygon.MIN_NB_POINTS;
        if (points.length < min) {
            throw new RangeError(`Regular polygons can't have less than ${min} branches, but ${points.length} given.`);
        }
        super(points[0], options);

        /**
         * @type {Array<Position>}
         */
        this.points = points;
        /**
         * @type {Number}
         */
        this.nbPoints = points.length;
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Polygon} Itself
     */
    render (ctx) {
        ctx.beginPath();

        super.render(ctx);
        ctx.closePath();

        return this;
    }

    /**
     * Draw the polygon
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Polygon} Itself
     */
    trace (ctx) {
        this.points.slice(1).concat(this.points.slice(0, 2)).forEach((point) => {
            const pos = point.subtract(this.position);
            ctx.lineTo(truncate(pos.x), truncate(pos.y));
        });
        return this;
    }

    /**
     *
     * @param {Position} position -
     * @return {Boolean}
     */
    isHover (position) {
        if (super.isHover(position)) {
            const testVector = new Vector(position, position.add(Infinity, 0));
            let intersection = 0;
            for (let i = 1; i < this.nbPoints; ++i) {
                if (testVector.intersect(new Vector(this.points[i - 1], this.points[i]))) {
                    ++intersection;
                }
            }
            return Boolean(intersection % 2);
        }

        return false;
    }

    /**
     * Define minimal number of points (or vertex) for a polygon
     * @return {Number}
     * @constant
     */
    static get MIN_NB_POINTS () {
        return 3;
    }
}
