import Arc from "./arc.js";
import Component, { type ComponentOptions } from "./component.js";
import type { ContainerJSON } from "./container.js";
import type { PositionDefinition } from "./position.js";

/**
 * Ellipse shape
 */
export class Ellipse<O extends ComponentOptions = ComponentOptions> extends Arc<O> {
    static override get className (): string {
        return "Ellipse";
    }

    /**
     * Ellipse constructor
     * @param positionDefinition - Center of the ellipse
     * @param width - Horizontal radius
     * @param height - Vertical radius
     * @param options - Drawing options
     */
    constructor (positionDefinition?: PositionDefinition, width?: number, height?: number, options?: Partial<O>) {
        super(positionDefinition, width, height, 0, 1, options);
    }

    override toJSON (): ContainerJSON {
        const { startAngle: _start, endAngle: _end, ...json } = super.toJSON();
        return json as ContainerJSON;
    }

    /**
     * Return an instance from a generic object
     * @param definition - Ellipse definition
     */
    static override from (definition: ContainerJSON): Ellipse {
        return new this(definition.position, definition.width, definition.height, definition.options);
    }

    static override get defaultOptions (): ComponentOptions {
        return Component.defaultOptions;
    }
}

export default Ellipse;
