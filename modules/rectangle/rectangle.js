import Component from "@pencil.js/component";
import { truncate } from "@pencil.js/math";

/**
 * Basic rectangle
 * @class
 * @extends Component
 */
export default class Rectangle extends Component {
    /**
     * Rectangle constructor
     * @param {Position} position - Position in space
     * @param {Number} [width=0] - Horizontal size
     * @param {Number} [height=0] - Vertical size
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (position, width = 0, height = 0, options) {
        super(position, options);
        this.width = width;
        this.height = height;
    }

    /**
     * Draw the rectangle
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Rectangle} Itself
     */
    trace (ctx) {
        ctx.rect(0, 0, truncate(this.width), truncate(this.height));
        return this;
    }

    /**
     * Define if is hover a position
     * @param {Position} position - Any position
     * @return {Boolean}
     */
    isHover (position) {
        const x = truncate(this.position.x);
        const y = truncate(this.position.y);
        const width = truncate(this.width);
        const height = truncate(this.height);
        return super.isHover(position) &&
            x <= position.x && position.x <= x + width &&
            y <= position.y && position.y <= y + height;
    }
}
