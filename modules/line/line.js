import Component from "@pencil.js/component";
import Position from "@pencil.js/position";

/**
 * Line class
 * @class
 * @extends Component
 */
export default class Line extends Component {
    /**
     * Line constructor
     * @param {PositionDefinition} positionDefinition - First point
     * @param {PositionDefinition|Array<PositionDefinition>} points - List of points or a single end point
     * @param {LineOptions} [options] - Drawing options
     */
    constructor (positionDefinition, points, options) {
        super(positionDefinition, options);

        let positions;
        try {
            // Try to treat it as one position definition
            positions = [Position.from(points)];
        }
        catch (e) {
            positions = points.map(point => Position.from(point));
        }

        /**
         * @type {Array<Position>}
         */
        this.points = positions;
    }

    /**
     * Draw the line
     * @param {Path2D} path - Drawing context
     * @return {Line} Itself
     */
    trace (path) {
        path.moveTo(0, 0);
        this.points.forEach(point => path.lineTo(point.x, point.y));
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
     * @inheritDoc
     */
    toJSON () {
        return Object.assign(super.toJSON(), {
            points: this.points.map(point => point.toJSON()),
        });
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
     */
    /**
     * @return {LineOptions}
     */
    static get defaultOptions () {
        const options = Object.assign(super.defaultOptions, {
            cap: Line.caps.round,
            join: Line.joins.round,
            fill: null,
            cursor: null,
        });
        options.stroke = super.defaultOptions.fill;
        return options;
    }

    /**
     * @typedef {Object} LineCaps
     * @enum {String}
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
}
