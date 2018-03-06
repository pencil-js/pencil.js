/**
 * Pair of value in 2d space
 * @class
 */
export default class Position {
    /**
     * Position constructor
     * @param {Number} x - Vertical
     * @param {Number} y - Horizontal
     */
    constructor (x = 0, y = 0) {
        this.x = Math.floor(x);
        this.y = Math.floor(y);
    }

    /**
     * Define this position value
     * @param {Position|Number} position - Horizontal position or another position
     * @param {Number} y - Vertical position if position is a number
     * @return {Position}
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
     * @return {Position}
     */
    clone () {
        return new Position(this.x, this.y);
    }

    /**
     * Return a new position instance after applying an operation
     * @param {Function} operation -
     * @param {Position|Number} position -
     * @param {Number} [diffY] -
     * @return {Position}
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
     * Add another position
     * @param {Position|Number} position - Another position or a number
     * @param {Number} [y] -
     * @return {Position}
     */
    add (position, y) {
        return this.calc((a, b) => a + b, position, y);
    }

    /**
     * Subtract another position
     * @param {Position|Number} position - Another position or a number
     * @param {Number} [y] -
     * @return {Position}
     */
    subtract (position, y) {
        return this.calc((a, b) => a - b, position, y);
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
     * Compute distance with another position
     * @param {Position} position -
     * @return {Number}
     */
    distance (position) {
        return Math.sqrt(((position.x - this.x) ** 2) + ((position.y - this.y) ** 2));
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
        return result.calc((self, other) => self / other, nbPositions);
    }
}
