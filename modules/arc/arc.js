import Component from "@pencil.js/component";
import Line from "@pencil.js/line";
import Position from "@pencil.js/position";
import Vector from "@pencil.js/vector";
import { truncate, radianCircle } from "@pencil.js/math";

/**
 * Arc class
 * @class
 * @extends Component
 */
export default class Arc extends Component {
    /**
     * Arc constructor
     * @param {PositionDefinition} position - Center of arc
     * @param {Number} radius - Distance from center to outer edge
     * @param {Number} [startAngle=0] - Angle to start from (0 is top, 0.5 is bottom and 1 is full circle back to top)
     * @param {Number} [endAngle=0.5] - Angle to end to (from startAngle and in clockwise rotation)
     * @param {LineOptions} [options] - Drawing options
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
        ctx.lineCap = this.options.cap;
        const radius = truncate(this.radius);
        const correction = -0.25;
        const startAngle = (this.startAngle + correction) * radianCircle;
        const endAngle = (this.endAngle + correction) * radianCircle;
        const startPosition = (new Position(0, -radius)).rotate(this.startAngle).rotate();
        ctx.moveTo(startPosition.x, startPosition.y);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        return this;
    }

    /**
     * @inheritDoc
     */
    isHover (position) {
        // TODO: does it make sens to hover an arc ?
        const radius = truncate(this.radius);
        const top = new Position(0, -radius);
        const flatPart = new Vector(top.rotate(this.startAngle), top.rotate(this.endAngle));
        return super.isHover(position) &&
            this.position.distance(position) <= radius && position.isOnSameSide(this.position, flatPart);
    }

    /**
     * @return {LineOptions}
     */
    static get defaultOptions () {
        return Line.defaultOptions;
    }

    /**
     * @return {LineCaps}
     */
    static get caps () {
        return Line.caps;
    }
}
