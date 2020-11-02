import RegularPolygon from "@pencil.js/regular-polygon";

/**
 * @module Triangle
 */

/**
 * Triangle class
 * @class
 * @extends {module:RegularPolygon}
 */
export default class Triangle extends RegularPolygon {
    /**
     * Triangle constructor
     * @param {PositionDefinition} positionDefinition - Center of the triangle
     * @param {Number} radius - Distance of branches from center
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (positionDefinition, radius, options) {
        super(positionDefinition, 3, radius, options);
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
