import Position from "@pencil.js/position";

/**
 * Vector class
 */
export default class Vector {
    /**
     * Vector constructor
     * @param {Position|Number} start - Starting vector's position
     * @param {Position|Number} end - Ending vector's position
     * @param {Number} [xEnd] - Horizontal position of the end point (if "start" and "end" are Number)
     * @param {Number} [yEnd] - Vertical position of the end point
     */
    constructor (start, end, xEnd, yEnd) {
        if (start instanceof Position && end instanceof Position) {
            this.start = start;
            this.end = end;
        }
        else if (xEnd !== undefined && yEnd !== undefined) {
            this.start = new Position(start, end);
            this.end = new Position(xEnd, yEnd);
        }
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
        return this.end.subtract(this.start);
    }

    /**
     * Add a vector to this
     * @param {Vector} vector - Any vector
     * @return {Vector} New instance
     */
    add (vector) {
        return new Vector(this.start.clone(), this.end.add(vector.getDelta()));
    }

    /**
     * Move this vector by another vector
     * @param {Vector} vector - Any vector
     * @return {Vector} New instance
     */
    translate (vector) {
        const delta = vector.getDelta();
        return new Vector(this.start.add(delta), this.end.add(delta));
    }

    /**
     * Define if this vector intersect another
     * @param {Vector} vector - Any vector
     * @return {Boolean}
     */
    intersect (vector) {
        return !this.start.isOnSameSide(this.end, vector) && !vector.start.isOnSameSide(vector.end, this);
    }
}
