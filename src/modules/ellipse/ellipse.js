import Arc from "@pencil.js/arc";
import Component from "@pencil.js/component";

/**
 * @module Ellipse
 */

/**
 * Ellipse class
 * <br><img src="./media/examples/ellipse.png" alt="ellipse demo"/>
 * @class
 * @extends Arc
 */
export default class Ellipse extends Arc {
    /**
     * Ellipse constructor
     * @param {PositionDefinition} positionDefinition - Position of the center of the ellipse
     * @param {Number} [width=0] - Horizontal radius
     * @param {Number} [height=0] - Vertical radius
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (positionDefinition, width, height, options) {
        super(positionDefinition, width, height, 0, 1, options);
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const json = super.toJSON();
        delete json.startAngle;
        delete json.endAngle;
        return json;
    }

    /**
     * @inheritDoc
     * @param {Object} definition - Ellipse definition
     * @return {Ellipse}
     */
    static from (definition) {
        return new Ellipse(
            definition.position,
            definition.width, definition.height,
            definition.options,
        );
    }

    /**
     * @type {ComponentOptions}
     */
    static get defaultOptions () {
        return Component.defaultOptions;
    }
}
