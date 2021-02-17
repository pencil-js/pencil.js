import Arc from "@pencil.js/arc";

/**
 * @module Pie
 */

/**
 * @class
 */
export default class Pie extends Arc {
    /**
     * Pie constructor
     * @param {PositionDefinition} positionDefinition - Position of the center
     * @param {Number} radius - Circle radius
     * @param {Number} startAngle - Angle beginning the arc
     * @param {Number} endAngle - Angle ending the arc
     * @param {ComponentOptions} [options] - Specific options
     */
    constructor (positionDefinition, radius, startAngle, endAngle, options) {
        super(positionDefinition, radius, radius, startAngle, endAngle, options);
    }

    /**
     * @inheritDoc
     */
    trace (path) {
        path.moveTo(0, 0);
        return super.trace(path);
    }
}
