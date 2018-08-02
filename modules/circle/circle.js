import Ellipse from "@pencil.js/ellipse";

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
     * @param {ComponentOptions} options - Drawing options
     */
    constructor (positionDefinition, radius, options) {
        super(positionDefinition, radius * 2, radius * 2, options);
    }

    /**
     * Return this circle's radius
     * @return {Number}
     */
    get radius () {
        return this.width / 2;
    }

    /**
     * Change this circle's radius
     * @param {Number} radius - New radius value
     */
    set radius (radius) {
        this.width = radius * 2;
        this.height = radius * 2;
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const json = Object.assign(super.toJSON(), {
            radius: this.radius,
        });
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
