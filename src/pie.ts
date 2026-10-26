import Arc from "./arc.js";
import Component, { type ComponentOptions } from "./component.js";
import type { ContainerJSON } from "./container.js";
import type { PositionDefinition } from "./position.js";

/**
 * Slice of a circle (like a pie chart slice)
 * @module Pie
 */
export default class Pie<O extends ComponentOptions = ComponentOptions> extends Arc<O> {
    static override get className (): string {
        return "Pie";
    }

    /**
     * Pie constructor
     * @param positionDefinition - Center of the pie
     * @param radius - Distance from center to outer edge
     * @param startAngle - Angle to start from (0 is top, 0.5 is bottom and 1 is full circle back to top)
     * @param endAngle - Angle to end to (from startAngle and in clockwise rotation)
     * @param options - Drawing options
     */
    constructor (positionDefinition?: PositionDefinition, radius = 0, startAngle = 0, endAngle = 0.5, options?: Partial<O>) {
        super(positionDefinition, radius, radius, startAngle, endAngle, options);
    }

    override trace (path: Path2D): this {
        path.moveTo(0, 0);
        super.trace(path);
        path.closePath();
        return this;
    }

    /**
     * Distance from center to outer edge
     */
    get radius (): number {
        return this.width;
    }

    set radius (radius: number) {
        this.width = radius;
        this.height = radius;
    }

    override toJSON (): ContainerJSON {
        const { width: _width, height: _height, ...json } = super.toJSON();
        return {
            ...json,
            radius: this.radius,
        };
    }

    /**
     * Return an instance from a generic object
     * @param definition - Pie definition
     */
    static override from (definition: ContainerJSON): Pie {
        return new this(definition.position, definition.radius, definition.startAngle, definition.endAngle, definition.options);
    }

    static override get defaultOptions (): ComponentOptions {
        return Component.defaultOptions;
    }
}
