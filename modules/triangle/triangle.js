import RegularPolygon from "@pencil.js/regular-polygon";

/**
 * Triangle class
 * @class
 * @extends RegularPolygon
 */
export default class Triangle extends RegularPolygon {
    /**
     * Triangle constructor
     * @param {PositionDefinition} position - Center of the triangle
     * @param {Number} radius - Distance of branches from center
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (position, radius, options) {
        super(position, 3, radius, options);
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const json = super.toJSON();
        delete json.nbSides;
        return json;
    }

    /**
     * @inheritDoc
     * @param {Object} definition - Triangle definition
     * @return {Triangle}
     */
    static from (definition) {
        return new Triangle(definition.position, definition.radius, definition.options);
    }
}
