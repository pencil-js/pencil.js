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
     * @param {Position} position - Center of the polygon
     * @param {Number} nbSides - Number of sides
     * @param {Number} radius - Distance between center and outer points
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (position = new Position(), nbSides, radius, options) {
        super(RegularPolygon.getRotatingPoint(nbSides, radius), options);

        this.radius = radius;
        this.position = position;
    }

    /**
     * @inheritDoc
     */
    isHover (position) {
        return position.distance(this.position) < this.radius && super.isHover(position);
    }

    /**
     * @inheritDoc
     */
    trace (ctx) {
        const firstPoint = this.points[0];
        ctx.moveTo(firstPoint.x, firstPoint.y);
        return super.trace(ctx);
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
