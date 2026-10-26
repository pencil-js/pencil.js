import Component, { type ComponentOptions, type Style } from "./component.js";
import type { ContainerJSON } from "./container.js";
import type Position from "./position.js";
import type { PositionDefinition } from "./position.js";

/**
 * Widget options
 */
export interface WidgetOptions extends ComponentOptions {
    /** Initial value */
    value: unknown;
    /** Color of the foreground elements */
    foreground: Style;
}

/**
 * Any shape class usable as the background of a widget
 */
export interface WidgetBase {
    prototype: {
        trace (path: Path2D): unknown;
        getOrigin (): Position;
    };
}

/**
 * Base class for UI elements drawn over a background shape and holding a value
 * @module Widget
 */
export abstract class Widget<O extends WidgetOptions = WidgetOptions> extends Component<O> {
    static override get className (): string {
        return "Widget";
    }

    /** Base shape for the background */
    base: WidgetBase;

    /**
     * Widget constructor
     * @param positionDefinition - Any position
     * @param base - Base shape class for the background (Rectangle, Circle …)
     * @param options - Specific options
     */
    constructor (positionDefinition: PositionDefinition | undefined, base: WidgetBase, options?: Partial<O>) {
        super(positionDefinition, options);

        this.base = base;
    }

    /**
     * Draw the background using the base shape
     * @param path - Drawing path
     * @returns Itself
     */
    trace (path: Path2D): this {
        this.base.prototype.trace.call(this, path);
        return this;
    }

    override getOrigin (): Position {
        return this.base.prototype.getOrigin.call(this);
    }

    /**
     * Current value
     */
    abstract get value (): unknown;

    abstract set value (value: unknown);

    override toJSON (): ContainerJSON {
        const json = super.toJSON();
        // Children are built by the widget itself
        delete json.children;
        json.options = {
            ...json.options,
            value: this.value,
        };
        return json;
    }

    /**
     * Return an instance from a generic object
     * @param definition - Widget definition
     */
    static override from (definition: ContainerJSON): Component {
        const WidgetClass = this as unknown as new (position: PositionDefinition, options: unknown) => Component;
        return new WidgetClass(definition.position, definition.options);
    }

    static override get defaultOptions (): WidgetOptions {
        return {
            ...super.defaultOptions,
            value: null,
            foreground: "#444",
            fill: "#f6f6f6",
            stroke: "#aaa",
            cursor: null,
        };
    }
}

export default Widget;
