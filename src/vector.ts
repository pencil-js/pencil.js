import Position, { type PositionDefinition } from "./position.js";

/**
 * Object with start and end values
 */
export interface AbstractVector {
    /** Start coordinates */
    start?: PositionDefinition;
    /** End coordinates */
    end?: PositionDefinition;
}

/**
 * Any value that can be turned into a {@link Vector}
 */
export type VectorDefinition = Vector | AbstractVector | [PositionDefinition?, PositionDefinition?];

/**
 * Something with a delta (like a {@link Vector})
 */
interface HasDelta {
    getDelta(): Position;
}

/**
 * Accept all kind of type and return only Number or Position
 * @param definition - Value definition
 */
function sanitizeParameters (definition: VectorDefinition | PositionDefinition | HasDelta | number): Position | number {
    // Number or Position
    if (typeof definition === "number" || definition instanceof Position) {
        return definition;
    }
    // Anything with a getDelta function (like a Vector)
    if (typeof (definition as HasDelta).getDelta === "function") {
        return (definition as HasDelta).getDelta();
    }
    // Array of two numbers or object with x/y
    if (Array.isArray(definition) ?
        typeof definition[0] === "number" && typeof definition[1] === "number" :
        "x" in definition || "y" in definition) {
        return Position.from(definition as PositionDefinition);
    }

    return Vector.from(definition as VectorDefinition).getDelta();
}

/**
 * Segment between two positions
 * @module Vector
 */
export default class Vector {
    /** Starting position */
    start: Position;

    /** Ending position */
    end: Position;

    /**
     * Vector constructor
     * @param start - Starting vector's position
     * @param end - Ending vector's position
     */
    constructor (start?: PositionDefinition, end?: PositionDefinition) {
        this.start = Position.from(start);
        this.end = Position.from(end);
    }

    /**
     * Get this vector horizontal component
     */
    get width (): number {
        return Math.abs(this.start.x - this.end.x);
    }

    /**
     * Get this vector vertical component
     */
    get height (): number {
        return Math.abs(this.start.y - this.end.y);
    }

    /**
     * Return this vector's length
     */
    get length (): number {
        return this.start.distance(this.end);
    }

    /**
     * Create a new copy of this vector
     */
    clone (): Vector {
        return new Vector(this.start.clone(), this.end.clone());
    }

    /**
     * Determine if is equal to another vector
     * @param vectorDefinition - Any vector
     */
    equals (vectorDefinition: VectorDefinition): boolean {
        const vector = Vector.from(vectorDefinition);
        return this.start.equals(vector.start) && this.end.equals(vector.end);
    }

    /**
     * Get the vector move with start at (0, 0)
     */
    getDelta (): Position {
        return this.end.clone().subtract(this.start);
    }

    /**
     * Add a vector (move its end)
     * @param modification - Any Vector or Position or Number
     * @returns Itself
     */
    add (modification: VectorDefinition | PositionDefinition | number): this {
        this.end.add(sanitizeParameters(modification));
        return this;
    }

    /**
     * Move this vector
     * @param modification - Any Vector or Position or Number
     * @returns Itself
     */
    translate (modification: VectorDefinition | PositionDefinition | number): this {
        const toAdd = sanitizeParameters(modification);
        this.start.add(toAdd);
        this.end.add(toAdd);
        return this;
    }

    /**
     * Multiply this vector's length (keeping its start in place)
     * @param modification - Any Vector or Position or Number
     * @returns Itself
     */
    multiply (modification: VectorDefinition | PositionDefinition | number): this {
        const delta = this.getDelta().multiply(sanitizeParameters(modification));
        this.end.set(this.start).add(delta);
        return this;
    }

    /**
     * Define if this vector intersect another
     * @param vectorDefinition - Any vector
     */
    intersect (vectorDefinition: VectorDefinition): boolean {
        const vector = Vector.from(vectorDefinition);
        if (!(this.start.isOnSameSide(this.end, vector) || vector.start.isOnSameSide(vector.end, this))) {
            return true;
        }

        const delta = this.getDelta();
        const startDiff = vector.start.clone().subtract(this.start);
        // Collinear
        if (delta.crossProduct(startDiff) === 0 && delta.crossProduct(vector.getDelta()) === 0) {
            // Overlap on any axis
            const overlap = (axis: "x" | "y") => Math.max(Math.min(this.start[axis], this.end[axis]), Math.min(vector.start[axis], vector.end[axis])) <=
                Math.min(Math.max(this.start[axis], this.end[axis]), Math.max(vector.start[axis], vector.end[axis]));
            return overlap("x") && overlap("y");
        }

        return false;
    }

    /**
     * Return the intersection point between two vector or null if no intersection happen
     * @param vectorDefinition - Any vector
     */
    getIntersectionPoint (vectorDefinition: VectorDefinition): Position | null {
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
        return this.start.clone().lerp(this.end, delta.crossProduct(diff) / determinant);
    }

    /**
     * Find the closest position to a point on this vector
     * @param positionDefinition - Any position
     */
    getClosestToPoint (positionDefinition: PositionDefinition): Position {
        const position = Position.from(positionDefinition);
        const aToP = position.clone().subtract(this.start);
        const aToB = this.getDelta();
        const lengthSquare = aToB.dotProduct(aToB);

        if (!lengthSquare) {
            return this.start.clone();
        }

        const ratio = aToP.dotProduct(aToB) / lengthSquare;

        return this.start.clone().add(aToB.multiply(ratio)).constrain(this.start, this.end);
    }

    /**
     * Return a JSON ready Vector definition
     */
    toJSON (): [[number, number], [number, number]] {
        return [this.start.toJSON(), this.end.toJSON()];
    }

    /**
     * Create a Vector from a generic definition
     * @param vectorDefinition - Vector definition
     */
    static from (vectorDefinition?: VectorDefinition): Vector {
        if (vectorDefinition instanceof Vector) {
            return vectorDefinition;
        }
        if (vectorDefinition === undefined) {
            return new Vector();
        }
        if (Array.isArray(vectorDefinition)) {
            return new Vector(vectorDefinition[0], vectorDefinition[1]);
        }
        if (typeof vectorDefinition === "object") {
            return new Vector(vectorDefinition.start, vectorDefinition.end);
        }
        throw new TypeError(`Unexpected type for vector: ${JSON.stringify(vectorDefinition)}.`);
    }
}
