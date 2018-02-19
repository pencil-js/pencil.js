import Rectangle from "@pencil.js/rectangle";

/**
 * Square class
 * @class
 * @extends Rectangle
 */
export default class Square extends Rectangle {
    /**
     * Square constructor
     * @param {Position} position -
     * @param {Number} size -
     * @param {ComponentOptions} options -
     */
    constructor (position, size, options) {
        super(position, size, size, options);
    }

    set size (size) {
        this.width = size;
        this.height = size;
    }

    get size () {
        return this.width;
    }
}
