import { constrain, equals, modulo, radianCircle } from "./math.js";
import type Vector from "./vector.js";

/**
 * Object with x and y values
 */
export interface AbstractPosition {
    /** Horizontal position */
    x?: number;
    /** Vertical position */
    y?: number;
}

/**
 * Any value that can be turned into a {@link Position}
 */
export type PositionDefinition = Position | AbstractPosition | [number?, number?] | ReadonlyArray<number>;

type Operation = (self: number, other: number) => number;

/**
 * Pair of value in 2d space
 * @module Position
 */
export default class Position {
    /** Horizontal component */
    x: number;

    /** Vertical component */
    y: number;

    /**
     * Position constructor
     * @param x - Horizontal component
     * @param y - Vertical component
     */
    constructor (x = 0, y = 0) {
        this.x = +x;
        this.y = +y;
    }

    /**
     * Define this position value
     * @param definition - Horizontal position or another position
     * @param diffY - Vertical position if "definition" is a number
     * @returns Itself
     */
    set (definition: PositionDefinition | number, diffY?: number): this {
        if (typeof definition === "number") {
            this.x = definition;
            this.y = diffY ?? definition;
        }
        else {
            const { x, y } = Position.from(definition);
            this.x = x;
            this.y = y;
        }
        return this;
    }

    /**
     * Create a copy of this position
     */
    clone (): Position {
        return new Position(this.x, this.y);
    }

    /**
     * Determine if is equal to another position
     * @param positionDefinition - Any other position
     */
    equals (positionDefinition: PositionDefinition): boolean {
        const position = Position.from(positionDefinition);
        return equals(this.x, position.x) && equals(this.y, position.y);
    }

    /**
     * Apply an operation to this position values
     * @param operation - Function to apply on value
     * @param definition - Another position or a number
     * @param diffY - Value to apply on "y" if "definition" is a number
     * @returns Itself
     */
    calc (operation: Operation, definition: PositionDefinition | number, diffY?: number): this {
        if (typeof definition === "number") {
            return this.set(operation(this.x, definition), operation(this.y, diffY ?? definition));
        }
        const position = Position.from(definition);
        return this.set(operation(this.x, position.x), operation(this.y, position.y));
    }

    /**
     * Add another position or number
     * @param definition - Another position or a number
     * @param y - Value for "y" if "definition" is a number
     * @returns Itself
     */
    add (definition?: PositionDefinition | number, y?: number): this {
        return this.calc((self, other) => self + other, definition ?? 0, y);
    }

    /**
     * Subtract another position or number
     * @param definition - Another position or a number
     * @param y - Value for "y" if "definition" is a number
     * @returns Itself
     */
    subtract (definition?: PositionDefinition | number, y?: number): this {
        return this.calc((self, other) => self - other, definition ?? 0, y);
    }

    /**
     * Multiply by another position or number
     * @param definition - Another position or a number
     * @param y - Value for "y" if "definition" is a number
     * @returns Itself
     */
    multiply (definition: PositionDefinition | number, y?: number): this {
        return this.calc((self, other) => self * other, definition, y);
    }

    /**
     * Divide by another position or number
     * @param definition - Another position or a number
     * @param y - Value for "y" if "definition" is a number
     * @returns Itself
     */
    divide (definition: PositionDefinition | number, y?: number): this {
        return this.calc((self, other) => self / other, definition, y);
    }

    /**
     * Gives the modulo by another position or number
     * @param definition - Another position or a number
     * @param y - Value for "y" if "definition" is a number
     * @returns Itself
     */
    modulo (definition: PositionDefinition | number, y?: number): this {
        return this.calc(modulo, definition, y);
    }

    /**
     * Raise to a power
     * @param definition - Another position or a number
     * @param y - Value for "y" if "definition" is a number
     * @returns Itself
     */
    power (definition: PositionDefinition | number, y?: number): this {
        return this.calc((self, other) => self ** other, definition, y);
    }

    /**
     * Rotate the position around the origin clockwise
     * @param angle - Angle of rotation in ratio of full circle
     * (0 means no rotation, 1 means go full circle back to same position)
     * @param originDefinition - Point of origin to rotate around (by default (0, 0))
     * @returns Itself
     */
    rotate (angle = 0, originDefinition?: PositionDefinition): this {
        const radian = angle * radianCircle;
        const cos = Math.cos(radian);
        const sin = Math.sin(radian);
        const origin = Position.from(originDefinition);
        const dx = this.x - origin.x;
        const dy = this.y - origin.y;
        return this.set((dx * cos) - (dy * sin) + origin.x, (dy * cos) + (dx * sin) + origin.y);
    }

    /**
     * Constrain the position to a rectangle define by two positions
     * @param startDefinition - Starting position of the constrain (upper-left corner)
     * @param endDefinition - Ending position of the constrain (lower-right corner)
     * @returns Itself
     */
    constrain (startDefinition: PositionDefinition, endDefinition: PositionDefinition): this {
        const start = Position.from(startDefinition);
        const end = Position.from(endDefinition);
        const x = constrain(this.x, Math.min(start.x, end.x), Math.max(start.x, end.x));
        const y = constrain(this.y, Math.min(start.y, end.y), Math.max(start.y, end.y));
        return this.set(x, y);
    }

    /**
     * Move the position towards another by a ratio
     * @param positionDefinition - Any other position
     * @param ratio - Ratio of distance to move, 0 mean no change, 1 mean arrive at position
     * @returns Itself
     */
    lerp (positionDefinition: PositionDefinition, ratio: number): this {
        const target = Position.from(positionDefinition);
        return this.add((target.x - this.x) * ratio, (target.y - this.y) * ratio);
    }

    /**
     * Compute distance with another position
     * @param positionDefinition - Any position (by default (0, 0))
     */
    distance (positionDefinition?: PositionDefinition): number {
        const position = Position.from(positionDefinition);
        return Math.hypot(position.x - this.x, position.y - this.y);
    }

    /**
     * Dot product
     * @param positionDefinition - Another position
     */
    dotProduct (positionDefinition: PositionDefinition): number {
        const position = Position.from(positionDefinition);
        return (this.x * position.x) + (this.y * position.y);
    }

    /**
     * Cross product
     * @param positionDefinition - Another position
     */
    crossProduct (positionDefinition: PositionDefinition): number {
        const position = Position.from(positionDefinition);
        return (this.x * position.y) - (this.y * position.x);
    }

    /**
     * Define if this is on the same side of a vector as another position
     * @param positionDefinition - Another position
     * @param vector - Any vector
     */
    isOnSameSide (positionDefinition: PositionDefinition, vector: Vector): boolean {
        const position = Position.from(positionDefinition);
        const thisMoved = this.clone().subtract(vector.start);
        const positionMoved = position.clone().subtract(vector.start);
        const delta = vector.getDelta();
        return Math.sign(thisMoved.crossProduct(delta)) === Math.sign(positionMoved.crossProduct(delta));
    }

    /**
     * Get the length of the vector from (0, 0) to this
     */
    get length (): number {
        return this.distance();
    }

    /**
     * Get the angle of a position relative to the vertical axis (0 is up, 0.25 is right ...)
     */
    get angle (): number {
        if (this.x === 0 && this.y === 0) {
            return 0;
        }

        return modulo((Math.atan2(this.y, this.x) / radianCircle) + 0.25, 1);
    }

    /**
     * Return a JSON ready Position definition
     */
    toJSON (): [number, number] {
        return [this.x, this.y];
    }

    /**
     * Create a Position from a generic definition or do nothing if already a Position
     * @param positionDefinition - Position definition
     */
    static from (positionDefinition?: PositionDefinition): Position {
        if (positionDefinition instanceof Position) {
            return positionDefinition;
        }
        if (positionDefinition === undefined) {
            return new Position();
        }
        if (Array.isArray(positionDefinition)) {
            return new Position(positionDefinition[0], positionDefinition[1]);
        }
        if (typeof positionDefinition === "object") {
            const { x, y } = positionDefinition as AbstractPosition;
            return new Position(x, y);
        }
        throw new TypeError(`Unexpected type for position: ${JSON.stringify(positionDefinition)}.`);
    }

    /**
     * Compute the average for a set of positions
     * @param positionDefinitions - List of positions to average
     */
    static average (...positionDefinitions: Array<PositionDefinition>): Position {
        const result = new Position();
        positionDefinitions.forEach(one => result.add(one));
        return result.divide(positionDefinitions.length || 1);
    }
}
