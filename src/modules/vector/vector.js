import Position from "@pencil.js/position";

/**
 * @module Vector
 */

const allEquals = (...args) => args.slice(1).every(a => a === args[0]);

/**
 * Accept all kind of type and return only Number or Position
 * @param {VectorDefinition|PositionDefinition|Number} definition - Value definition
 * @return {Position|Number}
 */
function sanitizeParameters (definition) {
    // Number or Position
    if (typeof definition === "number" || definition instanceof Position) {
        return definition;
    }
    // Anything with a getDelta function
    if (typeof definition.getDelta === "function") {
        return definition.getDelta();
    }
    // PositionDefinition
    if (typeof definition[0] === "number" && typeof definition[1] === "number") {
        return Position.from(definition);
    }
    // eslint-disable-next-line no-use-before-define
    return Vector.from(definition).getDelta();
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
    get length () {
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
        if (!(this.start.isOnSameSide(this.end, vector) || vector.start.isOnSameSide(vector.end, this))) {
            return true;
        }

        const delta = this.getDelta();
        const startDiff = vector.start.clone().subtract(this.start);
        // Collinear
        if (delta.crossProduct(startDiff) === 0 && delta.crossProduct(vector.getDelta()) === 0) {
            // Overlap
            return !allEquals(
                this.start.x < vector.start.x,
                this.start.x < vector.end.x,
                this.end.x < vector.start.x,
                this.end.x < vector.end.x,
            ) || !allEquals(
                this.start.y < vector.start.y,
                this.start.y < vector.end.y,
                this.end.y < vector.start.y,
                this.end.y < vector.end.y,
            );
        }

        return false;
    }

    /**
     * Return the intersection point between two vector or null if no intersection happen
     * @param {VectorDefinition} vectorDefinition - Any vector
     * @return {Position}
     */
    getIntersectionPoint (vectorDefinition) {
        const vector = Vector.from(vectorDefinition);
        if (!this.intersect(vector)) {
            return null;
        }

        const delta = vector.getDelta();
        const determinant = this.getDelta().crossProduct(delta);

        if (determinant === 0) {
            return this.start.clone()
                .constrain(vector.start, vector.end)
                .lerp(this.end.clone().constrain(vector.start, vector.end), 0.5);
        }

        const diff = this.start.clone().subtract(vector.start);
        return this.start.clone().lerp(this.end, (delta.crossProduct(diff)) / determinant);
    }

    /**
     * Find the closest position to a point on this vector
     * @param {PositionDefinition} positionDefinition - Any position
     * @return {Position}
     */
    getClosestToPoint (positionDefinition) {
        const position = Position.from(positionDefinition);
        const aToP = (new Vector(this.start, position)).getDelta();
        const aToB = this.getDelta();

        const t = aToP.dotProduct(aToB) / (this.length ** 2);

        return this.start.clone().add(aToB.multiply(t)).constrain(this.start, this.end);
    }

    /**
     * Return a JSON ready Vector definition
     * @return {Array<Array<Number>>}
     */
    toJSON () {
        const { start, end } = this;
        return [
            start,
            end,
        ];
    }

    /**
     * @typedef {Object} AbstractVector
     * @prop {PositionDefinition} [start] - Start coordinates
     * @prop {PositionDefinition} [end] - End coordinates
     */
    /**
     * @typedef {Array<PositionDefinition>|AbstractVector} VectorDefinition
     */
    /**
     * Create a Vector from a generic definition
     * @param {VectorDefinition} [vectorDefinition] - Vector definition
     * @return {Vector}
     */
    static from (vectorDefinition = new Vector()) {
        if (vectorDefinition instanceof Vector) {
            return vectorDefinition;
        }
        if (Array.isArray(vectorDefinition) && vectorDefinition.length === 2) {
            return new Vector(...vectorDefinition);
        }
        try {
            return new Vector(vectorDefinition.start, vectorDefinition.end);
        }
        catch {
            throw new TypeError(`Unexpected type for vector: ${JSON.stringify(vectorDefinition)}.`);
        }
    }
}
