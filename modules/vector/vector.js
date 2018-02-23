import Position from "@pencil.js/position";

/**
 * Vector class
 */
export default class Vector {
    /**
     * Vector constructor
     * @param {Position|Number} start - Starting vector's position
     * @param {Position|Number} end - Ending vector's position
     * @param {Number} [xEnd] -
     * @param {Number} [yEnd] -
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
     * Get the vector move with start at (0, 0)
     * @return {Position}
     */
    getDelta () {
        return this.end.subtract(this.start);
    }

    /**
     * Add a vector to this
     * @param {Vector} vector - Any vector
     * @return {Vector}
     */
    add (vector) {
        return new Vector(this.start.clone(), this.end.add(vector.getDelta()));
    }

    /**
     * Move this vector by another vector
     * @param {Vector} vector - Any vector
     * @return {Vector}
     */
    translate (vector) {
        const delta = vector.getDelta();
        return new Vector(this.start.add(delta), this.end.add(delta));
    }

    /**
     * Define if it's hover a position
     * @param {Position} position - Any position
     * @return {Boolean}
     */
    isHover (position) {
        const delta = this.getDelta();
        const zero = new Position();
        return delta.crossProduct(position) < Number.EPSILON && zero.distance(position) < zero.distance(delta);
    }

    /**
     * Define if this vector intersect another
     * @param {Vector} vector - Any vector
     * @return {Boolean}
     */
    intersect (vector) {
        const thisDelta = this.getDelta();
        const otherDelta = vector.getDelta();
        return Math.sign(thisDelta.crossProduct(vector.start)) !== Math.sign(thisDelta.crossProduct(vector.end)) &&
            Math.sign(otherDelta.crossProduct(this.start)) !== Math.sign(otherDelta.crossProduct(this.end));
    }
}
