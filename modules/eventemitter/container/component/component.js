import Container from "@pencil.js/container";

/**
 * @typedef {Object} ComponentOptions
 * @extends ContainerOptions
 * @prop {Number} [alpha=1] - Opacity level
 * @prop {String} [fill="#000"] - Color used to fill, set to null for transparent
 * @prop {String} [stroke=null] - Color used to stroke, set to null for transparent
 * @prop {Number} [strokeWidth=1] - Stroke line thickness in pixels
 * @prop {String} [cursor=null] - Cursor to use when hover
 */

/**
 * Basic class for visual component
 * @class
 * @extends Container
 */
export default class Component extends Container {
    /**
     * Component constructor
     * @param {Position} position - Position in space
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (position, options) {
        super(position, options);
        /**
         * @type {ComponentOptions}
         */
        this.options = Object.assign(this.constructor.defaultOptions, options);
        this.isShown = this.options.shown === undefined || this.options.shown;
        this.isHovered = false;
    }
    /**
     * Draw it on a context
     * @param {CanvasRenderingContext2D} ctx - Context to use
     * @return {Component} Itself
     */
    render (ctx) {
        return super.render(ctx, function() {
            ctx.beginPath();
            ctx.globalAlpha = this.options.alpha;

            this.trace(ctx);

            if (this.options.fill) {
                ctx.fillStyle = this.options.fill;
                ctx.fill();
            }

            if (this.options.stroke) {
                ctx.strokeStyle = this.options.stroke;
                ctx.lineWidth = this.options.strokeWidth;
                ctx.stroke();
            }
            ctx.closePath();
        });
    }

    trace () {
        throw new ReferenceError("Unimplemented trace function in " + this.constructor.name);
    }

    isHover (position) {
        return this.isShown;
    }

    show () {
        this.isShown = true;
    }
    hide () {
        this.isShown = false;
    }

    /**
     * @return {ComponentOptions}
     */
    static get defaultOptions () {
        return Object.assign({
            alpha: 1,
            fill: "#000",
            stroke: null,
            strokeWidth: 1,
            cursor: null
        }, super.defaultOptions);
    }
}
