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
        this.width = Math.floor(width);
        this.height = Math.floor(height);
    }

    /**
     * Draw the rectangle
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     */
    trace (ctx) {
        ctx.rect(0, 0, this.width, this.height);
    }

    /**
     * Define if is hover a position
     * @param {Position} position - Any position
     * @return {Boolean}
     */
    isHover (position) {
        const strokeModifier = this.options.stroke ? this.options.strokeWidth / 2 : 0;
        const x = this.position.x - strokeModifier;
        const y = this.position.y + strokeModifier;
        const width = this.width + strokeModifier;
        const height = this.height + strokeModifier;
        return super.isHover(position) &&
            x <= position.x && position.x <= this.position.x + width &&
            y <= position.y && position.y <= this.position.y + height;
    }
}
