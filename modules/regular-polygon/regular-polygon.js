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
     * @param {Number} radius - Distance between center and outer points
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (position = new Position(), nbSides, radius, options) {
        super(RegularPolygon.getRotatingPoint(nbSides, radius), options);

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
     * Draw the regular-polygon
     * @param {Path2D} path - Current drawing path
     * @return {RegularPolygon} Itself
     */
    trace (path) {
        this.points.forEach((point) => {
            path.lineTo(point.x, point.y);
        });
        path.closePath();
        return this;
    }

    /**
     * @inheritDoc
     */
    isHover (position) {
        return position.distance(this.position) < this.radius && super.isHover(position);
    }

    /**
     * Return positions at regular intervals around a circle
     * @param {Number} nbPoints - Number of points
     * @param {Number} radius - Distance from origin
     * @param {Number} [startAngle=0] -
     * @return {Array<Position>}
     */
    static getRotatingPoint (nbPoints, radius, startAngle = 0) {
        const angle = startAngle - (1 / 4);
        const points = [];
        for (let i = 0; i < nbPoints; ++i) {
            const rotation = ((i / nbPoints) + angle) * Math.PI * 2;
            points.push(new Position(Math.cos(rotation) * radius, Math.sin(rotation) * radius));
        }
        return points;
    }
}
