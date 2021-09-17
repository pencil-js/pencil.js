import Polygon from "@pencil.js/polygon";
import Position from "@pencil.js/position";
import { radianCircle } from "@pencil.js/math";

const radiusKey = Symbol("_radius");

/**
 * @module RegularPolygon
 */

/**
 * Regular polygon class
 * <br><img src="./media/examples/regular-polygon.png" alt="regular-polygon demo"/>
 * @class
 * @extends {module:Polygon}
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

        this[radiusKey] = radius;
    }

    /**
     * Set a new radius
     * @param {Number} radius - New radius value
     */
    set radius (radius) {
        const newPoints = RegularPolygon.getRotatingPoints(this.points.length, radius);
        this.points.forEach((point, index) => point.set(newPoints[index]));
        this[radiusKey] = radius;
    }

    /**
     * Get the current radius
     * @return {Number}
     */
    get radius () {
        return this[radiusKey];
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
     * @param {Number} [startAngle=0] - Starting angle of the points (between 0 and 1)
     * @param {PositionDefinition} [center] - Relative center of all the points
     * @return {Array<Position>}
     */
    static getRotatingPoints (nbPoints, radius, startAngle = 0, center) {
        const angle = startAngle - (1 / 4);
        const points = [];
        for (let i = 0; i < nbPoints; ++i) {
            const rotation = ((i / nbPoints) + angle) * radianCircle;
            const point = new Position(Math.cos(rotation) * radius, Math.sin(rotation) * radius);
            points.push(point.add(center));
        }
        return points;
    }
}
