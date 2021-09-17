import Component from "@pencil.js/component";
import Position from "@pencil.js/position";

/**
 * @module Polygon
 */

/**
 * Polygon class
 * <br><img src="./media/examples/polygon.png" alt="polygon demo"/>
 * @class
 * @extends {module:Component}
 */
export default class Polygon extends Component {
    /**
     * Polygon constructor
     * @param {PositionDefinition} positionDefinition - Any position
     * @param {Array<PositionDefinition>} points - Set of vertices relative to position defining the polygon
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (positionDefinition, points = [], options) {
        if (points.length < 3) {
            throw new RangeError(`A polygon can't have less than 3 vertices, but only ${points.length} given.`);
        }

        super(positionDefinition, options);

        /**
         * @type {Array<Position>}
         */
        this.points = points.map(point => Position.from(point));
    }

    /**
     * Draw the polygon
     * @param {Path2D} path - Current drawing path
     * @return {Polygon} Itself
     */
    trace (path) {
        this.points.concat(...this.points.slice(0, 2))
            .forEach(point => path.lineTo(point.x, point.y));
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
     * @param {Object} definition - Polygon definition
     * @return {Polygon}
     */
    static from (definition) {
        return new Polygon(definition.position, definition.points, definition.options);
    }
}
