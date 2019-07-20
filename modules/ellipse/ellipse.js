import Arc from "@pencil.js/arc";
import Component from "@pencil.js/component";

/**
 * Ellipse class
 * @class
 * @extends Arc
 */
export default class Ellipse extends Arc {
    /**
     * Ellipse constructor
     * @param {PositionDefinition} positionDefinition - Position of the center of the ellipse
     * @param {Number} [horizontalRadius=0] - Horizontal radius
     * @param {Number} [verticalRadius=0] - Vertical radius
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (positionDefinition, horizontalRadius, verticalRadius, options) {
        super(positionDefinition, horizontalRadius, verticalRadius, 0, 1, options);
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
            definition.horizontalRadius, definition.verticalRadius,
            definition.options,
        );
    }

    /**
     * @return {ComponentOptions}
     */
    static get defaultOptions () {
        return Component.defaultOptions;
    }
}
