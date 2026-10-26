import Position, { type PositionDefinition } from "./position.js";
import { addColorStops, colorStopsToJSON, type ColorStops } from "./internal/gradient.js";

/**
 * JSON representation of a radial gradient
 */
export interface RadialGradientJSON {
    constructor: "RadialGradient";
    position: [number, number];
    radius: number;
    colorStops: Record<string, string>;
}

/**
 * Radial gradient usable as fill or stroke
 * @module RadialGradient
 */
export default class RadialGradient {
    static get className (): "RadialGradient" {
        return "RadialGradient";
    }

    /** Center of the gradient */
    position: Position;

    /** Radius of the gradient */
    radius: number;

    /** Set of colors to go through (key is position [from 0 to 1], value is the color) */
    colorStops: ColorStops;

    /**
     * Radial gradient constructor
     * @param positionDefinition - Center of the gradient (relative to the component)
     * @param radius - Radius of the gradient
     * @param colorStops - Set of colors to go through (key is position [from 0 to 1], value is the color)
     */
    constructor (positionDefinition: PositionDefinition, radius: number, colorStops: ColorStops) {
        this.position = Position.from(positionDefinition);
        this.radius = radius;
        this.colorStops = colorStops;
    }

    /**
     * Return a canvas gradient
     * @param ctx - Drawing context
     */
    toString (ctx: CanvasRenderingContext2D): CanvasGradient {
        const { x, y } = this.position;
        return addColorStops(ctx.createRadialGradient(x, y, 0, x, y, this.radius), this.colorStops);
    }

    /**
     * Return a json ready object
     */
    toJSON (): RadialGradientJSON {
        return {
            constructor: RadialGradient.className,
            position: this.position.toJSON(),
            radius: this.radius,
            colorStops: colorStopsToJSON(this.colorStops),
        };
    }

    /**
     * Return an instance from a generic object
     * @param definition - RadialGradient definition
     */
    static from (definition: Omit<RadialGradientJSON, "constructor">): RadialGradient {
        return new RadialGradient(definition.position, definition.radius, definition.colorStops);
    }
}
