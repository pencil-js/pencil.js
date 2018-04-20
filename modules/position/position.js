import { constrain, equal, radianCircle } from "@pencil.js/math";

/**
 * Pair of value in 2d space
 * @class
 */
export default class Position {
    /**
     * Position constructor
     * @param {Number} x - Vertical component
     * @param {Number} y - Horizontal component
     */
    constructor (x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Define this position value
     * @param {Position|Number} position - Horizontal position or another position
     * @param {Number} y - Vertical position if position is a number
     * @return {Position} Itself
     */
    set (position, y) {
        if (position instanceof Position) {
            this.x = position.x;
            this.y = position.y;
        }
        else if (position !== undefined && y !== undefined) {
            this.x = position;
            this.y = y;
        }
        return this;
    }

    /**
     * Create a copy of this position
     * @return {Position} New instance
     */
    clone () {
        return new Position(this.x, this.y);
    }

    /**
     * Determine if is equal to another position
     * @param {Position} position - Any position
     * @return {Boolean}
     */
    equal (position) {
        return equal(this.x, position.x) && equal(this.y, position.y);
    }

    /**
     * Apply an operation to this position values
     * @param {Function} operation - Function to apply on value
     * @param {Position|Number} position - Another position or a number
     * @param {Number} [diffY] - Value to apply on "y" if "position" is a number
     * @return {Position} Itself
     */
    calc (operation, position, diffY) {
        let x = 0;
        let y = 0;
        if (position instanceof Position) {
            x = operation(this.x, position.x);
            y = operation(this.y, position.y);
        }
        else if (x !== undefined) {
            x = operation(this.x, position);
            y = operation(this.y, diffY === undefined ? position : diffY);
        }
        return this.set(x, y);
    }

    /**
     * Add another position or number
     * @param {Position|Number} position - Another position or a number
     * @param {Number} [y] - Value for "y" if "position" is a number
     * @return {Position} Itself
     */
    add (position, y) {
        return this.calc((a, b) => a + b, position, y);
    }

    /**
     * Subtract another position or number
     * @param {Position|Number} position - Another position or a number
     * @param {Number} [y] - Value for "y" if "position" is a number
     * @return {Position} Itself
     */
    subtract (position, y) {
        return this.calc((a, b) => a - b, position, y);
    }

    /**
     * Multiply by another position or number
     * @param {Position|Number} position - Another position or a number
     * @param {Number} [y] - Value for "y" if "position" is a number
     * @return {Position} Itself
     */
    multiply (position, y) {
        return this.calc((self, other) => self * other, position, y);
    }

    /**
     * Divide by another position or number
     * @param {Position|Number} position - Another position or a number
     * @param {Number} [y] - Value for "y" if "position" is a number
     * @return {Position} Itself
     */
    divide (position, y) {
        return this.calc((self, other) => self / other, position, y);
    }

    /**
     * Rotate the position around the origin clockwise
     * @param {Number} [angle=0] - Angle of rotation in ratio of full circle
     * (0 means no rotation, 1 means go full circle back to same position)
     * @param {Position} [origin=new Position()] - Point of origin to rotate around (by default (0, 0))
     * @return {Position} Itself
     */
    rotate (angle = 0, origin = new Position()) {
        const { cos, sin } = Math;
        const degree = angle * radianCircle;
        const clone = this.clone().subtract(origin);
        const x = (clone.x * cos(degree)) - (clone.y * sin(degree));
        const y = (clone.y * cos(degree)) + (clone.x * sin(degree));
        return this.set(x, y).add(origin);
    }

    /**
     * Constrain the position to a rectangle define by two positions
     * @param {Vector} vector - Vector holding the two positions
     * @return {Position} Itself
     */
    constrain (vector) {
        const x = constrain(this.x, vector.start.x, vector.end.x);
        const y = constrain(this.y, vector.start.y, vector.end.y);
        return this.set(x, y);
    }

    /**
     * Move the position towards another by a ratio
     * @param {Position} position - Any other position
     * @param {Function|Number} ratio - Ratio of distance to move, 0 mean no change, 1 mean arrive at position
     * @return {Position} Itself
     */
    lerp (position, ratio) {
        const difference = position.clone().subtract(this).multiply(typeof ratio === "function" ? ratio() : ratio);
        return this.add(difference);
    }

    /**
     * Compute distance with another position
     * @param {Position} position - Any position
     * @return {Number}
     */
    distance (position) {
        return Math.hypot(position.x - this.x, position.y - this.y);
    }

    /**
     * Cross product
     * @param {Position} position - Another position
     * @return {Number}
     */
    crossProduct (position) {
        return (this.x * position.y) - (position.x * this.y);
    }

    /**
     * Define if this is on the same side of a vector as another position
     * @param {Position} position - Another position
     * @param {Vector} vector - Any vector
     * @return {Boolean}
     */
    isOnSameSide (position, vector) {
        const { sign } = Math;
        const thisMoved = this.clone().subtract(vector.start);
        const positionMoved = position.clone().subtract(vector.start);
        const delta = vector.getDelta();
        return sign(thisMoved.crossProduct(delta)) === sign(positionMoved.crossProduct(delta));
    }

    /**
     * Compute the average for a set of positions
     * @param {...Position} position -
     * @return {Position}
     */
    static average (...position) {
        let result = new Position();
        position.forEach(one => result = result.add(one));
        const nbPositions = position.length;
        return result.divide(nbPositions);
    }
}
