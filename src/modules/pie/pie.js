import Arc from "@pencil.js/arc";
import Component from "@pencil.js/component";

/**
 * @module Pie
 */

/**
 * Pie class
 * <br><img src="./media/examples/pie.png" alt="pie demo"/>
 * @class
 * @extends {module:Arc}
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

    /**
     * Return this pie's radius
     * @return {Number}
     */
    get radius () {
        return this.width;
    }

    /**
     * Change this pie's radius
     * @param {Number} radius - New radius value
     */
    set radius (radius) {
        this.width = radius;
        this.height = radius;
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
     * @return {ComponentOptions}
     */
    static get defaultOptions () {
        return Component.defaultOptions;
    }
}
