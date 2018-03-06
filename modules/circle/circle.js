import Component from "@pencil.js/component";

/**
 * Basic circle class
 * @class
 * @extends Component
 */
export default class Circle extends Component {
    /**
     * Circle constructor
     * @param {Position} position - Center of arc
     * @param {Number} radius - Distance from center to outer edge
     * @param {ComponentOptions} options - Drawing options
     */
    constructor (position, radius, options) {
        super(position, options);
        this.radius = Math.floor(radius);
    }

    /**
     * Draw the circle
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     */
    trace (ctx) {
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    }

    /**
     * Define if position in over this
     * @param {Position} position - Any position
     * @return {Boolean}
     */
    isHover (position) {
        return super.isHover(position) && this.position.distance(position) <= this.radius;
    }
}
