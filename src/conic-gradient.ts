import Position, { type PositionDefinition } from "./position.js";
import { radianCircle } from "./math.js";
import { addColorStops, colorStopsToJSON, type ColorStops } from "./internal/gradient.js";

/**
 * JSON representation of a conic gradient
 */
export interface ConicGradientJSON {
    constructor: "ConicGradient";
    position: [number, number];
    startAngle: number;
    colorStops: Record<string, string>;
}

/**
 * Conic gradient usable as fill or stroke
 * @module ConicGradient
 */
export default class ConicGradient {
    static get className (): "ConicGradient" {
        return "ConicGradient";
    }

    /** Center of the gradient */
    position: Position;

    /** Starting angle (0 is top, 0.5 is bottom and 1 is full circle back to top) */
    startAngle: number;

    /** Set of colors to go through (key is position [from 0 to 1], value is the color) */
    colorStops: ColorStops;

    /**
     * Conic gradient constructor
     * @param positionDefinition - Center of the gradient (relative to the component)
     * @param startAngle - Starting angle (0 is top, 0.5 is bottom and 1 is full circle back to top)
     * @param colorStops - Set of colors to go through (key is position [from 0 to 1], value is the color)
     */
    constructor (positionDefinition: PositionDefinition | undefined, startAngle = 0, colorStops: ColorStops = {}) {
        this.position = Position.from(positionDefinition);
        this.startAngle = startAngle;
        this.colorStops = colorStops;
    }

    /**
     * Return a canvas gradient
     * @param ctx - Drawing context
     */
    toString (ctx: CanvasRenderingContext2D): CanvasGradient {
        const { x, y } = this.position;
        return addColorStops(ctx.createConicGradient((this.startAngle - 0.25) * radianCircle, x, y), this.colorStops);
    }

    /**
     * Return a json ready object
     */
    toJSON (): ConicGradientJSON {
        return {
            constructor: ConicGradient.className,
            position: this.position.toJSON(),
            startAngle: this.startAngle,
            colorStops: colorStopsToJSON(this.colorStops),
        };
    }

    /**
     * Return an instance from a generic object
     * @param definition - ConicGradient definition
     */
    static from (definition: Omit<ConicGradientJSON, "constructor">): ConicGradient {
        return new ConicGradient(definition.position, definition.startAngle, definition.colorStops);
    }
}
