import Position, { type PositionDefinition } from "./position.js";
import { addColorStops, colorStopsToJSON, type ColorStops } from "./internal/gradient.js";

export type { ColorStops };

/**
 * JSON representation of a linear gradient
 */
export interface LinearGradientJSON {
    constructor: "LinearGradient";
    from: [number, number];
    to: [number, number];
    colorStops: Record<string, string>;
}

/**
 * Linear gradient usable as fill or stroke
 */
export class LinearGradient {
    static get className (): "LinearGradient" {
        return "LinearGradient";
    }

    /** Starting position of the gradient */
    from: Position;

    /** Ending position of the gradient */
    to: Position;

    /** Set of colors to go through (key is position [from 0 to 1], value is the color) */
    colorStops: ColorStops;

    /**
     * Linear gradient constructor
     * @param fromPosition - Starting position of the gradient (relative to the component)
     * @param toPosition - Ending position of the gradient (relative to the component)
     * @param colorStops - Set of colors to go through (key is position [from 0 to 1], value is the color)
     * @example
     * new LinearGradient([0, 0], [100, 0], {
     *     0: "red",
     *     1: "blue",
     * });
     */
    constructor (fromPosition: PositionDefinition | undefined, toPosition: PositionDefinition | undefined, colorStops: ColorStops = {}) {
        this.from = Position.from(fromPosition);
        this.to = Position.from(toPosition);
        this.colorStops = colorStops;
    }

    /**
     * Return a canvas gradient
     * @param ctx - Drawing context
     */
    toString (ctx: CanvasRenderingContext2D): CanvasGradient {
        const { from, to } = this;
        return addColorStops(ctx.createLinearGradient(from.x, from.y, to.x, to.y), this.colorStops);
    }

    /**
     * Return a json ready object
     */
    toJSON (): LinearGradientJSON {
        return {
            constructor: LinearGradient.className,
            from: this.from.toJSON(),
            to: this.to.toJSON(),
            colorStops: colorStopsToJSON(this.colorStops),
        };
    }

    /**
     * Return an instance from a generic object
     * @param definition - LinearGradient definition
     */
    static from (definition: Omit<LinearGradientJSON, "constructor">): LinearGradient {
        return new LinearGradient(definition.from, definition.to, definition.colorStops);
    }
}

export default LinearGradient;
