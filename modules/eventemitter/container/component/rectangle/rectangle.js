import Component from "../component";

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
     */
    trace (ctx) {
        let x = 0;
        let y = 0;
        let width = this.width;
        let height = this.height;

        if (this.options.stroke && this.options.strokeWidth) {
            const halfStroke = this.options.strokeWidth / 2;
            x += halfStroke;
            y += halfStroke;
            width -= halfStroke;
            height -= halfStroke;
        }

        ctx.rect(x << 0, y << 0, width << 0, height << 0);
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
