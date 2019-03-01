import Position from "@pencil.js/position";

/**
 * Linear-gradient class
 * @class
 */
export default class LinearGradient {
    /**
     * @typedef {Object} ColorStops
     * @prop {...ColorDefinition} x -
     */
    /**
     * linear-gradient constructor
     * @param {PositionDefinition} fromPosition -
     * @param {PositionDefinition} toPosition -
     * @param {ColorStops} colorStops -
     */
    constructor (fromPosition, toPosition, colorStops) {
        this.from = Position.from(fromPosition);
        this.to = Position.from(toPosition);
        this.colorStops = colorStops;
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx -
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
