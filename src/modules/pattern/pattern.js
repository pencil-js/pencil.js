import Position from "@pencil.js/position";
import Rectangle from "@pencil.js/rectangle";
import Image from "@pencil.js/image";
import OffScreenCanvas from "@pencil.js/offscreen-canvas";
import NetworkEvent from "@pencil.js/network-event";

/**
 * @module Pattern
 */

const sourceKey = Symbol("_source");

/**
 * Background pattern filing
 * @class
 */
export default class Pattern {
    /**
     * Pattern constructor
     * @param {HTMLImageElement|Image|HTMLCanvasElement|OffScreenCanvas} source - Source of the pattern
     * @param {PatternOptions} options - Some options
     */
    constructor (source, options) {
        this.options = {
            ...Pattern.defaultOptions,
            ...options,
        };
        this.source = source;
    }

    /**
     * @return {HTMLImageElement}
     */
    get source () {
        const source = this[sourceKey];
        if (source instanceof OffScreenCanvas) {
            if (!source.isLooped) {
                source.render();
            }
            return source.ctx.canvas;
        }

        return source;
    }

    /**
     * @param {HTMLImageElement|Image} newSource - New source for the pattern
     */
    set source (newSource) {
        if (newSource instanceof window.HTMLImageElement ||
            newSource instanceof window.HTMLCanvasElement ||
            newSource instanceof OffScreenCanvas) {
            this[sourceKey] = newSource;
        }
        else if (newSource instanceof Image) {
            if (newSource.isLoaded) {
                this[sourceKey] = newSource.file;
            }
            else {
                newSource.on(NetworkEvent.events.ready, () => {
                    this[sourceKey] = newSource.file;
                });
            }
        }
        else if (newSource instanceof Pattern) {
            this[sourceKey] = newSource.source;
        }
    }

    /**
     * @return {Number}
     */
    get width () {
        return this[sourceKey].width;
    }

    /**
     * @return {Number}
     */
    get height () {
        return this[sourceKey].height;
    }

    /**
     * Return the pattern object
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {CanvasPattern}
     */
    toString (ctx) {
        const { repeat, scale } = this.options;
        const pattern = ctx.createPattern(this.source, repeat);
        const matrix = new window.DOMMatrix();
        if (typeof scale === "number") {
            matrix.a = scale;
            matrix.d = scale;
        }
        else {
            const s = Position.from(scale);
            matrix.a = s.x;
            matrix.d = s.y;
        }
        const origin = Rectangle.prototype.getOrigin.call(this);
        matrix.e = origin.x * matrix.a;
        matrix.f = origin.y * matrix.d;
        pattern.setTransform(matrix);
        return pattern;
    }

    // TODO: add toJSON and static from function

    /**
     * @typedef {Object} PatternOptions
     * @prop {String} [repeat=Pattern.repetition.repeat] - Repetition rule
     * @prop {PositionDefinition} [origin=new Position()] - Relative offset
     * @prop {Number|PositionDefinition} [scale=1] - Scaling ratio or a pair of value for horizontal and vertical scaling
     */
    /**
     * @return {PatternOptions}
     */
    static get defaultOptions () {
        return {
            repeat: this.repetition.repeat,
            origin: new Position(),
            scale: 1,
        };
    }

    /**
     * @typedef {Object} PatternRepetitions
     * @prop {String} repeat -
     * @prop {String} x -
     * @prop {String} y -
     * @prop {String} none -
     */
    /**
     * @return {PatternRepetitions}
     */
    static get repetition () {
        return {
            repeat: "repeat",
            x: "repeat-x",
            y: "repeat-y",
            none: "no-repeat",
        };
    }
}
