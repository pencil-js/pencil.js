import Position from "@pencil.js/position";

/**
 * Radial-gradient class
 * @class
 */
export default class RadialGradient {
    /**
     * @typedef {Object} ColorStops
     * @prop {...ColorDefinition} x -
     */
    /**
     * Radial-gradient constructor
     * @param {PositionDefinition} fromPosition -
     * @param {Number} radius -
     * @param {ColorStops} colorStops -
     */
    constructor (fromPosition, radius, colorStops) {
        this.from = Position.from(fromPosition);
        this.radius = radius;
        this.colorStops = colorStops;
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx -
     * @return {CanvasGradient}
     */
    toString (ctx) {
        const from = Position.from(this.from);
        const gradient = ctx.createRadialGradient(from.x, from.y, 0, from.x, from.y, this.radius);
        Object.keys(this.colorStops).forEach(key => gradient.addColorStop(key, this.colorStops[key].toString()));
        return gradient;
    }
}
