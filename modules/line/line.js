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
     * @param {LineOptions} [options] - Drawing options
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
        ctx.lineJoin = this.options.join;
        ctx.lineCap = this.options.cap;
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
     * @typedef {Object} LineOptions
     * @extends ComponentOptions
     * @prop {String} [cap=Line.caps.round] - How the line end points looks
     * @prop {String} [join=Line.joins.round] - How the line segment are join
     */
    /**
     * @return {LineOptions}
     */
    static get defaultOptions () {
        const options = Object.assign({
            cap: Line.caps.round,
            join: Line.joins.round,
        }, super.defaultOptions);
        options.stroke = options.fill;
        delete options.fill;
        delete options.cursor;
        return options;
    }

    /**
     * @typedef {Object} LineCaps
     * @prop {String} butt - Caps cut straight at end points
     * @prop {String} round - Round caps by adding a circle at end points, with a radius of lineWidth
     * @prop {String} square - Square caps by adding a square at end points, with a size of lineWidth
     */
    /**
     * @return {LineCaps}
     */
    static get caps () {
        return {
            butt: "butt",
            round: "round",
            square: "square",
        };
    }

    /**
     * @typedef {Object} LineJoins
     * @prop {String} miter - Join segment by extending the line edges until they meet
     * @prop {String} round - Join with a circle tangent to line edges
     * @prop {String} bevel - Join with a straight line between the line edges
     */
    /**
     * @return {LineJoins}
     */
    static get joins () {
        return {
            miter: "miter",
            round: "round",
            bevel: "bevel",
        };
    }
}
