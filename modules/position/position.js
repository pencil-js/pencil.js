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
        this.x = Math.floor(x);
        this.y = Math.floor(y);
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
            this.x = Math.floor(position);
            this.y = Math.floor(y);
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
     * Return a new position instance after applying an operation
     * @param {Function} operation - Function to apply on value
     * @param {Position|Number} position - Another position or a number
     * @param {Number} [diffY] - Value to apply on "y" if "position" is a number
     * @return {Position} New instance
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
        return new Position(x, y);
    }

    /**
     * Add another position or number
     * @param {Position|Number} position - Another position or a number
     * @param {Number} [y] - Value for "y" if "position" is a number
     * @return {Position} New instance
     */
    add (position, y) {
        return this.calc((a, b) => a + b, position, y);
    }

    /**
     * Subtract another position or number
     * @param {Position|Number} position - Another position or a number
     * @param {Number} [y] - Value for "y" if "position" is a number
     * @return {Position} New instance
     */
    subtract (position, y) {
        return this.calc((a, b) => a - b, position, y);
    }

    /**
     * Multiply by another position or number
     * @param {Position|Number} position - Another position or a number
     * @param {Number} y - Value for "y" if "position" is a number
     * @return {Position} New instance
     */
    multiply (position, y) {
        return this.calc((self, other) => self * other, position, y);
    }

    /**
     * Divide by another position or number
     * @param {Position|Number} position - Another position or a number
     * @param {Number} y - Value for "y" if "position" is a number
     * @return {Position} New instance
     */
    divide (position, y) {
        return this.calc((self, other) => self / other, position, y);
    }

    /**
     * Rotate the position around the origin
     * @param {Number} angle - Angle of rotation in ratio of full circle (0 means no rotation, 1 means go full circle back to same position)
     * @return {Position}
     */
    rotate (angle) {
        const { cos, sin } = Math;
        const degree = angle * 360;
        const x = (this.x * cos(degree)) - (this.y * sin(degree));
        const y = (this.y * cos(degree)) + (this.x * sin(degree));
        return new Position(x, y);
    }

    /**
     * Compute distance with another position
     * @param {Position} position - Any position
     * @return {Number}
     */
    distance (position) {
        return Math.sqrt(((position.x - this.x) ** 2) + ((position.y - this.y) ** 2));
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
        const thisMoved = this.subtract(vector.start);
        const positionMoved = position.subtract(vector.start);
        const delta = vector.getDelta();
        return sign(thisMoved.crossProduct(delta)) === sign(positionMoved.crossProduct(delta));
    }

    /**
     * Compute the average for a set of positions
     * @param {Array<Position>} positions -
     * @return {Position}
     */
    static average (positions) {
        let result = new Position();
        positions.forEach(position => result = result.add(position));
        const nbPositions = positions.length;
        return result.divide(nbPositions);
    }
}
