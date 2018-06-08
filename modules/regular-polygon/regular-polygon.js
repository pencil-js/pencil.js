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
    constructor (position = new Position(), nbSides, radius = 0, options) {
        super(position, RegularPolygon.getRotatingPoints(nbSides, radius), options);

        /**
         * @type {Position}
         */
        this.position = Position.from(position);
        /**
         * @type {Number}
         */
        this.radius = radius;
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const json = Object.assign(super.toJSON(), {
            radius: this.radius,
            nbSides: this.points.length,
        });
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
