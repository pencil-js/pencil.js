import Component from "@pencil.js/component";
import Vector from "@pencil.js/vector";

/**
 * Polygon class
 * @class
 * @extends Component
 */
export default class Polygon extends Component {
    /**
     * Polygon constructor
     * @param {Array<Position>} points -
     * @param {ComponentOptions} options - Drawing options
     */
    constructor (points, options) {
        super(points[0], options);

        this.points = points;
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
     */
    trace (ctx) {
        this.points.concat(this.points.slice(0, 2)).forEach((point, index) => ctx[index ? "lineTo" : "moveTo"](point.x << 0, point.y << 0));
    }

    /**
     *
     * @param {Position} position -
     * @return {Boolean}
     */
    isHover(position) {
        return false;

        // FIXME
        if (super.isHover(position)) {
            let testVector = new Vector(position, position.add(Infinity, 0));
            let intersection = 0;
            for (let i = 1; i < this.nbPoints; ++i) {
                if (testVector.intersect(new Vector(this.points[i - 1], this.points[i]))) {
                    ++intersection;
                }
            }
            return Boolean(intersection % 2);
        }
        else {
            return false;
        }
    }
}
