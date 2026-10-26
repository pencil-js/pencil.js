import RegularPolygon from "./regular-polygon.js";
import type { ComponentOptions } from "./component.js";
import type { ContainerJSON } from "./container.js";
import type { PositionDefinition } from "./position.js";

/**
 * Equilateral triangle
 * @module Triangle
 */
export default class Triangle<O extends ComponentOptions = ComponentOptions> extends RegularPolygon<O> {
    static override get className (): string {
        return "Triangle";
    }

    /**
     * Triangle constructor
     * @param positionDefinition - Center of the triangle
     * @param radius - Distance between center and outer points
     * @param options - Drawing options
     */
    constructor (positionDefinition?: PositionDefinition, radius?: number, options?: Partial<O>) {
        super(positionDefinition, 3, radius, options);
    }

    override toJSON (): ContainerJSON {
        const { nbSides: _nbSides, ...json } = super.toJSON();
        return json;
    }

    /**
     * Return an instance from a generic object
     * @param definition - Triangle definition
     */
    static override from (definition: ContainerJSON): Triangle {
        return new this(definition.position, definition.radius, definition.options);
    }
}
