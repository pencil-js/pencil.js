import Rectangle from "@pencil.js/rectangle";

/**
 * @module Square
 */

const widthKey = Symbol("_width");
const heightKey = Symbol("_height");

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
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (positionDefinition, size, options) {
        super(positionDefinition, size, size, options);
    }

    /**
     * Set this square's size
     * @param {Number} size - New size
     */
    set size (size) {
        this[widthKey] = size;
        this[heightKey] = size;
    }

    /**
     * Get this square's size
     * @return {Number}
     */
    get size () {
        return this.width;
    }

    /**
     * Set width (also set height)
     * @param {Number} width - Any value for width (and height)
     */
    set width (width) {
        this.size = width;
    }

    /**
     * Get width
     * @return {Number}
     */
    get width () {
        return this[widthKey];
    }

    /**
     * Set height (also set width)
     * @param {Number} height - Any value for height (and width)
     */
    set height (height) {
        this.size = height;
    }

    /**
     * Get height
     * @return {Number}
     */
    get height () {
        return this[heightKey];
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const { size } = this;
        const json = {
            ...super.toJSON(),
            size,
        };
        delete json.height;
        delete json.width;
        return json;
    }

    /**
     * @inheritDoc
     * @param {Object} definition - Square definition
     * @return {Square}
     */
    static from (definition) {
        return new Square(definition.position, definition.size, definition.options);
    }
}
