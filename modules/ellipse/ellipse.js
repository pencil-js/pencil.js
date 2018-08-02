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
     * @param {PositionDefinition} positionDefinition -
     * @param {Number} width -
     * @param {Number} height -
     * @param {ComponentOptions} options - Drawing options
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
        return new Ellipse(definition.position, definition.width, definition.height, definition.options);
    }

    /**
     * @return {ComponentOptions}
     */
    static get defaultOptions () {
        return Component.defaultOptions;
    }
}
