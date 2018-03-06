import Arc from "@pencil.js/arc";
import Component from "@pencil.js/component";

/**
 * Circle class
 * @class
 * @extends Component
 */
export default class Circle extends Arc {
    /**
     * Circle constructor
     * @param {Position} position - Center of circle
     * @param {Number} radius - Distance from center to outer edge
     * @param {ComponentOptions} options - Drawing options
     */
    constructor (position, radius, options) {
        super(position, radius, 0, 1, options);
    }

    /**
     * Define if position in over this
     * @param {Position} position - Any position
     * @return {Boolean}
     */
    isHover (position) {
        return Component.prototype.isHover.call(this, position) && this.position.distance(position) <= this.radius;
    }
}
