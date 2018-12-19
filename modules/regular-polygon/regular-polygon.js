import Polygon from "@pencil.js/polygon";
import Position from "@pencil.js/position";

/**
 * Regular polygon class
 * @class
 * @extends Polygon
 */
export default class RegularPolygon extends Polygon {
    /**
     * Regular polygon constructor
     * @param {PositionDefinition} position - Center of the polygon
     * @param {Number} nbSides - Number of sides
     * @param {Number} [radius=0] - Distance between center and outer points
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (position, nbSides, radius = 0, options) {
        super(position, RegularPolygon.getRotatingPoints(nbSides, radius), options);

        /**
         * @type {Number}
         */
        this.radius = radius;
    }

    /**
     * Draw the polygon
     * @param {Path2D} path - Current drawing path
     * @return {Polygon} Itself
     */
    trace (path) {
        this.points.concat(...this.points.slice(0, 2)).forEach(point => path.lineTo(point.x, point.y));
        return this;
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const { points, radius } = this;
        const json = {
            ...super.toJSON(),
            nbSides: points.length,
            radius,
        };
        delete json.points;
        return json;
    }

    /**
     * @inheritDoc
     * @param {Object} definition - Regular polygon definition
     * @return {RegularPolygon}
     */
    static from (definition) {
        return new RegularPolygon(definition.position, definition.nbSides, definition.radius, definition.options);
    }

    /**
     * Return positions at regular intervals around a circle
     * @param {Number} nbPoints - Number of points
     * @param {Number} radius - Distance from origin
     * @param {Number} [startAngle=0] -
     * @return {Array<Position>}
     */
    static getRotatingPoints (nbPoints, radius, startAngle = 0) {
        const angle = startAngle - (1 / 4);
        const points = [];
        for (let i = 0; i < nbPoints; ++i) {
            const rotation = ((i / nbPoints) + angle) * Math.PI * 2;
            points.push(new Position(Math.cos(rotation) * radius, Math.sin(rotation) * radius));
        }
        return points;
    }
}
