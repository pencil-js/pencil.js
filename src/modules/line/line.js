import Component from "@pencil.js/component";
import Position from "@pencil.js/position";

/**
 * @module Line
 */

/**
 * Line class
 * <br><img src="./media/examples/line.png" alt="line demo"/>
 * @class
 * @extends {module:Component}
 */
export default class Line extends Component {
    /**
     * Line constructor
     * @param {PositionDefinition} positionDefinition - First point
     * @param {Array<PositionDefinition>} points - List of points
     * @param {LineOptions} [options] - Drawing options
     */
    constructor (positionDefinition, points, options) {
        super(positionDefinition, options);

        /**
         * @type {Array<Position>}
         */
        this.points = points.map(Position.from);
    }

    /**
     * Draw the line
     * @param {Path2D} path - Drawing context
     * @return {Line} Itself
     */
    trace (path) {
        path.moveTo(0, 0);
        const { x = 0, y = 0 } = this.options.absolute ? this.position : {};
        this.points.forEach(point => path.lineTo(point.x - x, point.y - y));
        return this;
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const { points } = this;
        return {
            ...super.toJSON(),
            points,
        };
    }

    /**
     * @inheritDoc
     * @param {Object} definition -Line definition
     * @return {Line}
     */
    static from (definition) {
        return new Line(definition.position, definition.points, definition.options);
    }

    /**
     * @typedef {Object} LineOptions
     * @extends ComponentOptions
     * @prop {String} [cap=Line.caps.round] - How the line end points looks
     * @prop {String} [join=Line.joins.round] - How the line segment are join
     * @prop {String|ColorDefinition} [fill=null] - Color used to fill, set to null for transparent
     * @prop {String|ColorDefinition} [stroke=Component.defaultOptions.fill] - Color used to stroke, set to null for transparent
     * @prop {Boolean} [absolute=false] - Should points be treated as absolute coordinates
     */
    /**
     * @type {LineOptions}
     */
    static get defaultOptions () {
        return {
            ...super.defaultOptions,
            cap: Line.caps.round,
            join: Line.joins.round,
            fill: null,
            stroke: super.defaultOptions.fill,
            absolute: false,
        };
    }

    /**
     * @typedef {Object} LineCaps
     * @prop {String} butt - Caps cut straight at end points
     * @prop {String} round - Round caps by adding a circle at end points, with a radius of lineWidth
     * @prop {String} square - Square caps by adding a square at end points, with a size of lineWidth
     */
    /**
     * @type {LineCaps}
     */
    static get caps () {
        return {
            butt: "butt",
            round: "round",
            square: "square",
        };
    }
}
