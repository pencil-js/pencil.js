import Ellipse from "@pencil.js/ellipse";
import { radianCircle } from "@pencil.js/math";

/**
 * Circle class
 * @class
 * @extends Ellipse
 */
export default class Circle extends Ellipse {
    /**
     * Circle constructor
     * @param {PositionDefinition} positionDefinition - Center of circle
     * @param {Number} radius - Distance from center to outer edge
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (positionDefinition, radius, options) {
        super(positionDefinition, radius, radius, options);
    }

    /**
     * Return this circle's radius
     * @return {Number}
     */
    get radius () {
        return this.width;
    }

    /**
     * Change this circle's radius
     * @param {Number} radius - New radius value
     */
    set radius (radius) {
        this.width = radius;
        this.height = radius;
    }

    /**
     * @override
     * @return {Circle} Itself
     */
    trace (path) {
        path.arc(0, 0, this.radius, 0, radianCircle);
        return this;
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const { radius } = this;
        const json = {
            ...super.toJSON(),
            radius,
        };
        delete json.width;
        delete json.height;
        return json;
    }

    /**
     * @inheritDoc
     * @param {Object} definition - Circle definition
     * @return {Circle}
     */
    static from (definition) {
        return new Circle(definition.position, definition.radius, definition.options);
    }
}
