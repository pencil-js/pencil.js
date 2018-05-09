import Component from "@pencil.js/component";
import Position from "@pencil.js/position";

/**
 * Polygon class
 * @class
 * @extends Component
 */
export default class Polygon extends Component {
    /**
     * Polygon constructor
     * @param {Array<PositionDefinition>} points - Set of vertices defining the polygon
     * @param {ComponentOptions} options - Drawing options
     */
    constructor (points, options) {
        if (points.length < 3) {
            throw new RangeError(`A polygon can't have less than 3 vertices, but only ${points.length} given.`);
        }

        const positions = points.map(point => Position.from(point));
        super(positions[0], options);

        /**
         * @type {Array<Position>}
         */
        this.points = positions;
    }

    /**
     * Draw the polygon
     * @param {Path2D} path - Current drawing path
     * @return {Polygon} Itself
     */
    trace (path) {
        this.points.forEach((point) => {
            path.lineTo(point.x - this.position.x, point.y - this.position.y);
        });
        path.closePath();
        return this;
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        return Object.assign(super.toJSON(), {
            points: this.points,
        });
    }

    /**
     * @inheritDoc
     * @param {Object} definition - Polygon definition
     * @return {Polygon}
     */
    static from (definition) {
        return new Polygon(definition.points, definition.options);
    }
}
