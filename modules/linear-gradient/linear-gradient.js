import Position from "@pencil.js/position";

/**
 * Linear-gradient class
 * @class
 */
export default class LinearGradient {
    /**
     * linear-gradient constructor
     * @param {PositionDefinition} fromPosition - Starting position of the gradient
     * @param {PositionDefinition} toPosition - Ending position of the gradient
     * @param {Object} colorStops - Set of colors to go through (key is position, value is the color)
     * @example new LinearGradient(from, to, { 0: "red", 1: "green" });
     */
    constructor (fromPosition, toPosition, colorStops) {
        this.from = Position.from(fromPosition);
        this.to = Position.from(toPosition);
        this.colorStops = colorStops;
    }

    /**
     * Return a drawing context compatible gradient
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {CanvasGradient}
     */
    toString (ctx) {
        const from = Position.from(this.from);
        const to = Position.from(this.to);
        const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        Object.keys(this.colorStops).forEach(key => gradient.addColorStop(key, this.colorStops[key].toString()));
        return gradient;
    }
}
