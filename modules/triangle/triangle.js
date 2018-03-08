import RegularPolygon from "@pencil.js/regular-polygon";

/**
 * Triangle class
 * @class
 * @extends RegularPolygon
 */
export default class Triangle extends RegularPolygon {
    /**
     * Triangle constructor
     * @param {Position} position - Center of the triangle
     * @param {Number} radius - Distance of branches from center
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (position, radius, options) {
        super(position, 3, radius, options);
    }
}
