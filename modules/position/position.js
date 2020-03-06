import { constrain, equals, radianCircle, modulo } from "@pencil.js/math";

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
        this.x = +x;
        this.y = +y;
    }

    /**
     * Define this position value
     * @param {PositionDefinition|Number} definition - Horizontal position or another position
     * @param {Number} [diffY] - Vertical position if "definition" is a number
     * @return {Position} Itself
     */
    set (definition, diffY) {
        let x;
        let y;
        if (typeof definition === "number") {
            x = definition;
            y = diffY === undefined ? definition : diffY;
        }
        else {
            const position = Position.from(definition);
            ({ x, y } = position);
        }

        this.x = x;
        this.y = y;
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
     * @param {PositionDefinition} positionDefinition - Any other position
     * @return {Boolean}
     */
    equals (positionDefinition) {
        const position = Position.from(positionDefinition);
        return equals(this.x, position.x) && equals(this.y, position.y);
    }

    /**
     * Apply an operation to this position values
     * @param {Function} operation - Function to apply on value
     * @param {PositionDefinition|Number} definition - Another position or a number
     * @param {Number} [diffY] - Value to apply on "y" if "definition" is a number
     * @return {Position} Itself
     */
    calc (operation, definition, diffY) {
        let x = 0;
        let y = 0;
        if (typeof definition === "number") {
            x = operation(this.x, definition);
            y = operation(this.y, diffY === undefined ? definition : diffY);
        }
        else {
            const position = Position.from(definition);
            x = operation(this.x, position.x);
            y = operation(this.y, position.y);
        }

        return this.set(x, y);
    }

    /**
     * Add another position or number
     * @param {PositionDefinition|Number} definition - Another position or a number
     * @param {Number} [y] - Value for "y" if "position" is a number
     * @return {Position} Itself
     */
    add (definition, y) {
        return this.calc((self, other) => self + other, definition, y);
    }

    /**
     * Subtract another position or number
     * @param {PositionDefinition|Number} definition - Another position or a number
     * @param {Number} [y] - Value for "y" if "position" is a number
     * @return {Position} Itself
     */
    subtract (definition, y) {
        return this.calc((self, other) => self - other, definition, y);
    }

    /**
     * Multiply by another position or number
     * @param {PositionDefinition|Number} definition - Another position or a number
     * @param {Number} [y] - Value for "y" if "position" is a number
     * @return {Position} Itself
     */
    multiply (definition, y) {
        return this.calc((self, other) => self * other, definition, y);
    }

    /**
     * Divide by another position or number
     * @param {PositionDefinition|Number} definition - Another position or a number
     * @param {Number} [y] - Value for "y" if "position" is a number
     * @return {Position} Itself
     */
    divide (definition, y) {
        return this.calc((self, other) => self / other, definition, y);
    }

    /**
     * Gives the modulo by another position or number
     * @param {PositionDefinition|Number} definition - Another position or a number
     * @param {Number} [y] - Value for "y" if "position" is a number
     * @return {Position} Itself
     */
    modulo (definition, y) {
        return this.calc((self, other) => modulo(self, other), definition, y);
    }

    /**
     * Raise to a power
     * @param {PositionDefinition|Number} definition - Another position or a number
     * @param {Number} [y] - Value for "y" if "position" is a number
     * @return {Position} Itself
     */
    power (definition, y) {
        return this.calc((self, other) => self ** other, definition, y);
    }

    /**
     * Rotate the position around the origin clockwise
     * @param {Number} [angle=0] - Angle of rotation in ratio of full circle
     * (0 means no rotation, 1 means go full circle back to same position)
     * @param {PositionDefinition} [originDefinition] - Point of origin to rotate around (by default (0, 0))
     * @return {Position} Itself
     */
    rotate (angle = 0, originDefinition) {
        const { cos, sin } = Math;
        const degree = angle * radianCircle;
        const origin = Position.from(originDefinition);
        const clone = this.clone().subtract(origin);
        const x = (clone.x * cos(degree)) - (clone.y * sin(degree));
        const y = (clone.y * cos(degree)) + (clone.x * sin(degree));
        return this.set(x, y).add(origin);
    }

    /**
     * Constrain the position to a rectangle define by two positions
     * @param {PositionDefinition} startDefinition - Starting position of the constrain (upper-left corner)
     * @param {PositionDefinition} endDefinition - Ending position of the constrain (lower-right corner)
     * @return {Position} Itself
     */
    constrain (startDefinition, endDefinition) {
        const start = Position.from(startDefinition);
        const end = Position.from(endDefinition);
        const x = constrain(this.x, Math.min(start.x, end.x), Math.max(start.x, end.x));
        const y = constrain(this.y, Math.min(start.y, end.y), Math.max(start.y, end.y));
        return this.set(x, y);
    }

    /**
     * Move the position towards another by a ratio
     * @param {PositionDefinition} positionDefinition - Any other position
     * @param {Number} ratio - Ratio of distance to move, 0 mean no change, 1 mean arrive at position
     * @return {Position} Itself
     */
    lerp (positionDefinition, ratio) {
        const difference = Position.from(positionDefinition).clone().subtract(this).multiply(ratio);
        return this.add(difference);
    }

    /**
     * Compute distance with another position
     * @param {PositionDefinition} positionDefinition - Any position
     * @return {Number}
     */
    distance (positionDefinition) {
        const position = Position.from(positionDefinition);
        return Math.hypot(position.x - this.x, position.y - this.y);
    }

    /**
     * Dot product
     * @param {PositionDefinition} positionDefinition - Another position
     * @return {Number}
     */
    dotProduct (positionDefinition) {
        const position = Position.from(positionDefinition);
        return (this.x * position.x) + (this.y * position.y);
    }

    /**
     * Cross product
     * @param {PositionDefinition} positionDefinition - Another position
     * @return {Number}
     */
    crossProduct (positionDefinition) {
        const position = Position.from(positionDefinition);
        return (this.x * position.y) - (this.y * position.x);
    }

    /**
     * Define if this is on the same side of a vector as another position
     * @param {PositionDefinition} positionDefinition - Another position
     * @param {Vector} vector - Any vector
     * @return {Boolean}
     */
    isOnSameSide (positionDefinition, vector) {
        const position = Position.from(positionDefinition);
        const thisMoved = this.clone().subtract(vector.start);
        const positionMoved = position.clone().subtract(vector.start);
        const delta = vector.getDelta();
        const { sign } = Math;
        return sign(thisMoved.crossProduct(delta)) === sign(positionMoved.crossProduct(delta));
    }

    /**
     * Get the angle of a position relative to the horizontal axis
     * @return {Number}
     */
    get angle () {
        if (this.x === 0 && this.y === 0) {
            return 0;
        }

        return (Math.atan(this.y / this.x) / radianCircle) + (this.x < 0 ? 0.75 : 0.25);
    }

    /**
     * Return a JSON ready Position definition
     * @return {Array<Number>}
     */
    toJSON () {
        const { x, y } = this;
        return [
            x,
            y,
        ];
    }

    /**
     * @typedef {Object} AbstractPosition
     * @prop {Number} [x=0] - Vertical position
     * @prop {Number} [y=0] - Horizontal position
     */
    /**
     * @typedef {Position|Array|AbstractPosition} PositionDefinition
     */
    /**
     * Create a Position from a generic definition or do nothing if already a Position
     * @param {PositionDefinition} [positionDefinition] - Position definition
     * @return {Position}
     */
    static from (positionDefinition = new Position()) {
        if (positionDefinition instanceof Position) {
            return positionDefinition;
        }
        if (Array.isArray(positionDefinition)) {
            return new Position(...positionDefinition);
        }

        try {
            return new Position(positionDefinition.x, positionDefinition.y);
        }
        catch {
            throw TypeError(`Unexpected type for position: ${JSON.stringify(positionDefinition)}.`);
        }
    }

    /**
     * Compute the average for a set of positions
     * @param {...PositionDefinition} positionDefinitions - List of positions to average
     * @return {Position}
     */
    static average (...positionDefinitions) {
        let result = new Position();
        positionDefinitions.forEach(one => result = result.add(Position.from(one)));
        const nbPositions = positionDefinitions.length;
        return result.divide(nbPositions);
    }
}
