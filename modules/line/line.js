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
     * @param {Array<PositionDefinition>} points -
     * @param {LineOptions} [options] - Drawing options
     */
    constructor (points, options) {
        if (points.length < 2) {
            throw new RangeError(`A Line need at least 2 points, only ${points.length} given.`);
        }

        const positions = points.map(point => Position.from(point));
        super(positions[0], options);

        /**
         * @type {Array<Position>}
         */
        this.points = positions;
    }

    /**
     * Draw the line
     * @param {path} path - Drawing context
     * @return {Line} Itself
     */
    trace (path) {
        path.moveTo(0, 0);
        this.points.slice(1).forEach((point) => {
            const diff = point.clone().subtract(this.position);
            path.lineTo(diff.x, diff.y);
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
     * @inheritDoc
     */
    toJSON () {
        const json = Object.assign(super.toJSON(), {
            points: this.points,
        });
        delete json.position;
        return json;
    }

    /**
     * @inheritDoc
     * @param {Object} definition -Line definition
     * @return {Line}
     */
    static from (definition) {
        return new Line(definition.points, definition.options);
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
        });
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
}
