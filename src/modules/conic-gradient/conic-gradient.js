import Position from "@pencil.js/position";
import { radianCircle } from "@pencil.js/math";

/**
 * @module ConicGradient
 */

/**
 * Conic-gradient class
 * <br><img src="./media/examples/conic-gradient.png" alt="conic-gradient demo"/>
 * @class
 */
export default class ConicGradient {
    /**
     * Conic-gradient constructor
     * @param {PositionDefinition} positionDefinition - Center of the gradient
     * @param {Number} startAngle - Starting angle (0 is top, 0.5 is bottom and 1 is full circle back to top)
     * @param {Object} colorStops - Set of colors to go through (key is position [from 0 to 1], value is the color)
     * @example new ConicGradient(center, 0, { 0: "red", 0.25: "orange", 0.5: "yellow", 0.75: "green", 1: "blue" });
     */
    constructor (positionDefinition, startAngle, colorStops) {
        this.position = Position.from(positionDefinition);
        this.startAngle = startAngle;
        this.colorStops = colorStops;
    }

    /**
     * Return a drawing context compatible gradient
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {CanvasGradient}
     */
    toString (ctx) {
        const from = Position.from(this.position);
        const gradient = ctx.createConicGradient((this.startAngle - 0.25) * radianCircle, from.x, from.y);
        Object.keys(this.colorStops).forEach((key) => {
            gradient.addColorStop(Number(key), this.colorStops[key].toString());
        });
        return gradient;
    }
}
