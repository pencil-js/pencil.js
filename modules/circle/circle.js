import Arc from "@pencil.js/arc";
import Component from "@pencil.js/component";

/**
 * Circle class
 * @class
 * @extends Component
 */
export default class Circle extends Arc {
    /**
     * Circle constructor
     * @param {PositionDefinition} position - Center of circle
     * @param {Number} radius - Distance from center to outer edge
     * @param {ComponentOptions} options - Drawing options
     */
    constructor (position, radius, options) {
        super(position, radius, 0, 1, options);
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
     * @param {Object} definition - Circle definition
     * @return {Circle}
     */
    static from (definition) {
        return new Circle(definition.position, definition.radius, definition.options);
    }

    /**
     * @return {ComponentOptions}
     */
    static get defaultOptions () {
        return Component.defaultOptions;
    }
}
