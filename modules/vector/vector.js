import Position from "@pencil.js/position";

/**
 * Accept all kind of type and return only Number or Position
 * @param {VectorDefinition|PositionDefinition|Number} definition - Value definition
 * @return {Position|Number}
 */
function sanitizeParameters (definition) {
    let scalar;
    try {
        // eslint-disable-next-line no-use-before-define
        const vector = Vector.from(definition);
        scalar = vector.getDelta();
    }
    catch (e) {
        scalar = definition.getDelta ? definition.getDelta() : definition;
    }
    return scalar;
}

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
     * @param {VectorDefinition} vectorDefinition - Any vector
     * @return {Boolean}
     */
    equals (vectorDefinition) {
        const vector = Vector.from(vectorDefinition);
        return this.start.equals(vector.start) && this.end.equals(vector.end);
    }

    /**
     * Get the vector move with start at (0, 0)
     * @return {Position}
     */
    getDelta () {
        return this.end.clone().subtract(this.start);
    }

    /**
     * Add a vector
     * @param {VectorDefinition|PositionDefinition|Number} modification - Any Vector or Position or Number
     * @return {Vector} Itself
     */
    add (modification) {
        const toAdd = sanitizeParameters(modification);
        this.end.add(toAdd);
        return this;
    }

    /**
     * Move this vector
     * @param {VectorDefinition|PositionDefinition|Number} modification - Any Vector or Position or Number
     * @return {Vector} Itself
     */
    translate (modification) {
        const toAdd = sanitizeParameters(modification);
        this.start.add(toAdd);
        this.end.add(toAdd);
        return this;
    }

    /**
     * Multiply this vector
     * @param {VectorDefinition|PositionDefinition|Number} modification - Any Vector or Position or Number
     * @return {Vector} Itself
     */
    multiply (modification) {
        if (typeof modification === "number") {
            this.add(this.getDelta().multiply(modification - 1));
            return this;
        }

        const toMultiply = sanitizeParameters(modification);
        this.end.multiply(toMultiply);
        return this;
    }

    /**
     * Define if this vector intersect another
     * @param {VectorDefinition} vectorDefinition - Any vector
     * @return {Boolean}
     */
    intersect (vectorDefinition) {
        const vector = Vector.from(vectorDefinition);
        return !(this.start.isOnSameSide(this.end, vector) || vector.start.isOnSameSide(vector.end, this));
    }

    /**
     * Return a JSON ready Vector definition
     * @return {Array<Array<Number>>}
     */
    toJSON () {
        return [
            this.start.toJSON(),
            this.end.toJSON(),
        ];
    }

    /**
     * @typedef {Object} AbstractVector
     * @prop {PositionDefinition} [start] - Start coordinates
     * @prop {PositionDefinition} [end] - End coordinates
     */
    /**
     * @typedef {Position|Array|AbstractVector} VectorDefinition
     */
    /**
     * Create a Vector from a generic definition
     * @param {VectorDefinition} vectorDefinition - Vector definition
     * @return {Vector}
     */
    static from (vectorDefinition = new Vector()) {
        if (vectorDefinition instanceof Vector) {
            return vectorDefinition;
        }
        if (Array.isArray(vectorDefinition) && vectorDefinition.length === 2) {
            if ((Array.isArray(vectorDefinition[0]) && Array.isArray(vectorDefinition[1])) ||
                (vectorDefinition[0] instanceof Position && vectorDefinition[1] instanceof Position)) {
                return new Vector(...vectorDefinition);
            }
        }
        if (vectorDefinition.constructor.name === "Object") {
            return new Vector(vectorDefinition.start, vectorDefinition.end);
        }

        throw new TypeError(`Unexpected type for vector [${typeof vectorDefinition}]`);
    }
}
