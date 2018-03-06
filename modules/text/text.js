import Component from "@pencil.js/component";
import Rectangle from "@pencil.js/rectangle";
import Scene from "@pencil.js/scene";
import Container from "@pencil.js/container";

/**
 * @typedef {Object} TextOptions
 * @extends ComponentOptions
 * @prop {String} [font="sans-serif"] -
 * @prop {Number} [fontSize=10] -
 * @prop {String} [baseline="top"] -
 */

/**
 * Text class
 * @class
 * @extends Component
 */
export default class Text extends Component {
    /**
     * Text constructor
     * @param {Position} position -
     * @param {String} text -
     * @param {TextOptions} options -
     */
    constructor (position, text, options) {
        super(position, options);
        this.text = text;
    }

    /**
     * Render the text into a drawing context
     * @param {CanvasRenderingContext2D} ctx -
     * @return {Text} Itself
     */
    render (ctx) {
        return Container.prototype.render.call(this, ctx, function textRender () {
            const text = this.text.toString();
            if (text) {
                ctx.globalAlpha = this.options.alpha;
                ctx.font = `${this.options.fontSize}px ${this.options.font}`;
                ctx.textBaseline = this.options.baseline;

                if (this.options.fill) {
                    ctx.fillStyle = this.options.fill;
                    ctx.fillText(text, 0, 0);
                }

                if (this.options.stroke) {
                    ctx.strokeStyle = this.options.stroke;
                    ctx.lineWidth = this.options.strokeWidth;
                    ctx.strokeText(text, 0, 0);
                }
            }
        });
    }

    /**
     * Define if it's hover a position
     * @param {Position} position -
     * @return {Boolean}
     */
    isHover (position) {
        return Rectangle.prototype.isHover.call(this, position);
    }

    /**
     * @return {Number}
     */
    get width () {
        const root = this.getRoot();
        if (root instanceof Scene) {
            root.ctx.font = `${this.options.fontSize}px ${this.options.font}`;
            return root.ctx.measureText(this.text).width;
        }

        return 0;
    }

    /**
     * @return {Number}
     */
    get height () {
        return this.options.fontSize;
    }

    /**
     * @return {TextOptions}
     */
    static get defaultOptions () {
        return Object.assign({
            font: "sans-serif",
            fontSize: 10,
            baseline: "top",
        }, super.defaultOptions);
    }
}
