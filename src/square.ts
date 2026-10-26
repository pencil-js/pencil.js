import Rectangle, { type RectangleOptions } from "./rectangle.js";
import type { ContainerJSON } from "./container.js";
import type { PositionDefinition } from "./position.js";

/**
 * Square shape (width and height always equal)
 * @module Square
 */
export default class Square<O extends RectangleOptions = RectangleOptions> extends Rectangle<O> {
    static override get className (): string {
        return "Square";
    }

    /**
     * Square constructor
     * @param positionDefinition - Top-left corner (depending on the origin)
     * @param size - Length of the sides
     * @param options - Drawing options
     */
    constructor (positionDefinition?: PositionDefinition, size?: number, options?: Partial<O>) {
        super(positionDefinition, size, size, options);
    }

    /**
     * Length of the sides
     */
    get size (): number {
        return super.width;
    }

    set size (size: number) {
        super.width = size;
        super.height = size;
    }

    override get width (): number {
        return super.width;
    }

    override set width (width: number) {
        this.size = width;
    }

    override get height (): number {
        return super.height;
    }

    override set height (height: number) {
        this.size = height;
    }

    override toJSON (): ContainerJSON {
        const { width: _width, height: _height, ...json } = super.toJSON();
        return {
            ...json,
            size: this.size,
        };
    }

    /**
     * Return an instance from a generic object
     * @param definition - Square definition
     */
    static override from (definition: ContainerJSON): Square {
        return new this(definition.position, definition.size, definition.options);
    }
}
