import Component from "@pencil.js/component";
import Vector from "@pencil.js/vector";

/**
 * @typedef {Object} LineOptions
 * @prop {Boolean} [shown=true] - Is shown
 * @prop {Number} [alpha=1] - Opacity value
 * @prop {String} [stroke="#000"] -
 * @prop {Number} [strokeWidth=1] -
 */

/**
 * Line class
 * @class
 * @extends Component
 */
export default class Line extends Component {
    /**
     * Line constructor
     * @param {Position} start -
     * @param {Position} end -
     * @param {LineOptions} [options] - Drawing options
     */
    constructor (start, end, options) {
        super(start, options);
        this.vector = new Vector(start, end);
    }

    /**
     * Draw the line
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     */
    trace (ctx) {
        let delta = this.vector.getDelta();
        ctx.moveTo(0, 0);
        ctx.lineTo(delta.x << 0, delta.y << 0);
    }

    isHover (position) {
        return false;
    }

    /**
     * @return {LineOptions}
     */
    static get defaultOptions () {
        return {
            shown: true,
            alpha: 1,
            stroke: "#000",
            strokeWidth: 1
        };
    }
}
