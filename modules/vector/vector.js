import Position from "@pencil.js/position";

/**
 * Vector class
 */
export default class Vector {
    /**
     * Vector constructor
     * @param {PositionDefinition} start - Starting vector's position
     * @param {PositionDefinition} end - Ending vector's position
     */
    constructor (start, end) {
        this.start = Position.from(start);
        this.end = Position.from(end);
    }

    /**
     * Get this vector horizontal component
     * @return {Number}
     */
    get width () {
        return Math.abs(this.start.x - this.end.x);
    }

    /**
     * Get this vector vertical component
     * @return {Number}
     */
    get height () {
        return Math.abs(this.start.y - this.end.y);
    }

    /**
     * Return this vector's length
     * @return {Number}
     */
    length () {
        return this.start.distance(this.end);
    }

    /**
     * Create a new copy of this vector
     * @return {Vector}
     */
    clone () {
        return new Vector(this.start.clone(), this.end.clone());
    }

    /**
     * Determine if is equal to another vector
     * @param {Vector} vector - Any vector
     * @return {Boolean}
     */
    equal (vector) {
        return this.start.equal(vector.start) && this.end.equal(vector.end);
    }

    /**
     * Get the vector move with start at (0, 0)
     * @return {Position}
     */
    getDelta () {
        return this.end.clone().subtract(this.start);
    }

    /**
     * Add a vector to this
     * @param {Vector|Position|Number} modification - Any Vector or Position or Number
     * @return {Vector} Itself
     */
    add (modification) {
        const toAdd = modification instanceof Vector ? modification.getDelta() : modification;
        this.end.add(toAdd);
        return this;
    }

    /**
     * Move this vector
     * @param {Vector|Position|Number} modification - Any Vector or Position or Number
     * @return {Vector} Itself
     */
    translate (modification) {
        const toAdd = modification instanceof Vector ? modification.getDelta() : modification;
        this.start.add(toAdd);
        this.end.add(toAdd);
        return this;
    }

    /**
     * Define if this vector intersect another
     * @param {Vector} vector - Any vector
     * @return {Boolean}
     */
    intersect (vector) {
        return !(this.start.isOnSameSide(this.end, vector) || vector.start.isOnSameSide(vector.end, this));
    }
}
