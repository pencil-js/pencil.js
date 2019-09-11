import Position from "@pencil.js/position";

/**
 * Radial-gradient class
 * @class
 */
export default class RadialGradient {
    /**
     * Radial-gradient constructor
     * @param {PositionDefinition} positionDefinition - Center of the gradient
     * @param {Number} radius - Radius of the gradient
     * @param {Object} colorStops - Set of colors to go through (key is position [from 0 to 1], value is the color)
     * @example new RadialGradient(from, radius, { 0: "red", 1: "green" });
     */
    constructor (positionDefinition, radius, colorStops) {
        this.position = Position.from(positionDefinition);
        this.radius = radius;
        this.colorStops = colorStops;
    }

    /**
     * Return a drawing context compatible gradient
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {CanvasGradient}
     */
    toString (ctx) {
        const from = Position.from(this.position);
        const gradient = ctx.createRadialGradient(from.x, from.y, 0, from.x, from.y, this.radius);
        Object.keys(this.colorStops).forEach(key => gradient.addColorStop(key, this.colorStops[key].toString()));
        return gradient;
    }
}
