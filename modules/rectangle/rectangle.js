import Component from "@pencil.js/component";

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
        this.width = Math.floor(width);
        this.height = Math.floor(height);
    }

    /**
     * Draw the rectangle
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Rectangle} Itself
     */
    trace (ctx) {
        ctx.rect(0, 0, this.width, this.height);
        return this;
    }

    /**
     * Define if is hover a position
     * @param {Position} position - Any position
     * @return {Boolean}
     */
    isHover (position) {
        return super.isHover(position) &&
            this.position.x <= position.x && position.x <= this.position.x + this.width &&
            this.position.y <= position.y && position.y <= this.position.y + this.height;
    }
}
