import Component from "@pencil.js/component";

/**
 * Line class
 * @class
 * @extends Component
 */
export default class Line extends Component {
    /**
     * Line constructor
     * @param {Array<Position>} points -
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (points, options) {
        if (points.length < 2) {
            throw new RangeError(`A line need at least 2 points, only ${points.length} given.`);
        }

        super(points[0], options);

        /**
         * @type {Array<Position>}
         */
        this.points = points;
    }

    /**
     * Draw the line
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Line} Itself
     */
    trace (ctx) {
        ctx.moveTo(0, 0);
        this.points.slice(1).forEach((point) => {
            const diff = point.subtract(this.position);
            ctx.lineTo(diff.x, diff.y);
        });
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
        delete options.fill;
        delete options.cursor;
        return options;
    }
}
