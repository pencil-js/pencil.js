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

    add (vector) {
        return new Vector(this.start.clone(), this.end.add(vector.getDelta()));
    }

    translate (vector) {
        let delta = vector.getDelta();
        return new Vector(this.start.add(delta), this.end.add(delta));
    }

    isHover (position) {
        let delta = this.getDelta();
        let zero = new Position();
        return delta.crossProduct(position) < Number.EPSILON && zero.distance(position) < zero.distance(delta);
    }

    /**
     *
     * @param {Vector} vector -
     * @return {Boolean}
     */
    intersect (vector) {
        let thisDelta = this.getDelta();
        let otherDelta = vector.getDelta();
        return Math.sign(thisDelta.crossProduct(vector.start)) !== Math.sign(thisDelta.crossProduct(vector.end)) &&
            Math.sign(otherDelta.crossProduct(this.start)) !== Math.sign(otherDelta.crossProduct(this.end));
    }
}