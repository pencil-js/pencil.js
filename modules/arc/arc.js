import Component from "@pencil.js/component";
import Vector from "@pencil.js/vector";
import Position from "@pencil.js/position";
import { truncate, radianCircle } from "@pencil.js/math";

/**
 * Arc class
 * @class
 * @extends Component
 */
export default class Arc extends Component {
    /**
     * Arc constructor
     * @param {Position} position - Center of arc
     * @param {Number} radius - Distance from center to outer edge
     * @param {Number} [startAngle=0] - Angle to start from (0 is top, 0.5 is bottom and 1 is full circle back to top)
     * @param {Number} [endAngle=0.5] - Angle to end to
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (position, radius, startAngle = 0, endAngle = 0.5, options) {
        super(position, options);
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }

    /**
     * Draw the arc
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Arc} Itself
     */
    trace (ctx) {
        ctx.arc(0, 0, truncate(this.radius), this.startAngle * radianCircle, this.endAngle * radianCircle);
        return this;
    }

    /**
     * Define if position in over this
     * @param {Position} position - Any position
     * @return {Boolean}
     */
    isHover (position) {
        const radius = truncate(this.radius);
        const top = new Position(0, radius);
        const flatPart = new Vector(top.rotate(this.startAngle), top.rotate(this.endAngle));
        return super.isHover(position) &&
            this.position.distance(position) <= radius && position.isOnSameSide(this.position, flatPart);
    }
}
