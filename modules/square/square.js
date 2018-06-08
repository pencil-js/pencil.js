import Rectangle from "@pencil.js/rectangle";

/**
 * Square class
 * @class
 * @extends Rectangle
 */
export default class Square extends Rectangle {
    /**
     * Square constructor
     * @param {PositionDefinition} positionDefinition - Top-left corner
     * @param {Number} size - Side's length
     * @param {ComponentOptions} options - Drawing options
     */
    constructor (positionDefinition, size, options) {
        super(positionDefinition, size, size, options);
    }

    /**
     * Set this square's size
     * @param {Number} size - New size
     */
    set size (size) {
        this.width = size;
        this.height = size;
    }

    /**
     * Get this square's size
     * @return {Number}
     */
    get size () {
        return this.width;
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const json = super.toJSON();
        delete json.height;
        return json;
    }

    /**
     * @inheritDoc
     * @param {Object} definition - Square definition
     * @return {Square}
     */
    static from (definition) {
        return new Square(definition.position, definition.width, definition.options);
    }
}
