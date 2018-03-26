import Component from "@pencil.js/component";
import Vector from "@pencil.js/vector";

/**
 * Line class
 * @class
 * @extends Component
 */
export default class Line extends Component {
    /**
     * Line constructor
     * @param {Position} start - Start point
     * @param {Position} end - End point
     * @param {LineOptions} [options] - Drawing options
     */
    constructor (start, end, options) {
        super(start, options);
        this.vector = new Vector(start, end);
    }

    /**
     * Draw the line
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Line} Itself
     */
    trace (ctx) {
        const delta = this.vector.getDelta();
        ctx.moveTo(0, 0);
        ctx.lineTo(delta.x, delta.y);
        return this;
    }

    /**
     * Can't hover a line
     * @returns {Boolean}
     */
    isHover () { // eslint-disable-line class-methods-use-this
        return false;
    }

    /**
     * @return {ComponentOptions}
     */
    static get defaultOptions () {
        const options = Object.assign({}, super.defaultOptions);
        options.stroke = options.fill;
        options.strokeWidth = 1;
        delete options.fill;
        delete options.cursor;
        return options;
    }
}
