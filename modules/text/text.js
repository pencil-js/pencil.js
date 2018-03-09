import Component from "@pencil.js/component";
import Rectangle from "@pencil.js/rectangle";
import Scene from "@pencil.js/scene";
import Container from "@pencil.js/container";
import Position from "@pencil.js/position";
import textDirection from "text-direction";

/**
 * Text class
 * @class
 * @extends Component
 */
export default class Text extends Component {
    /**
     * Text constructor
     * @param {Position} position - Top most point of the line start (depend on align option)
     * @param {String} text - Text to display
     * @param {TextOptions} options - Drawing options
     */
    constructor (position, text, options) {
        super(position, options);
        /**
         * @type {String}
         */
        this.text = text;
        /**
         * @type {Object}
         * @private
         */
        this._cachedWidth = {};
    }

    /**
     * Render the text into a drawing context
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Text} Itself
     */
    render (ctx) {
        return Container.prototype.render.call(this, ctx, function textRender () {
            const text = this.text.toString();
            if (text) {
                ctx.globalAlpha = this.options.alpha;
                ctx.font = `${this.options.fontSize}px ${this.options.font}`;
                ctx.textAlign = this.options.align;
                ctx.textBaseline = "top";

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
     * @param {Position} position - Any position
     * @return {Boolean}
     */
    isHover (position) {
        const root = this.getRoot();
        if (root instanceof Scene) {
            const dir = textDirection(root.ctx.canvas);
            const { width } = this;
            const { align } = this.options;

            let horizontal = 0;

            if (align === Text.alignments.center) {
                horizontal = width / 2;
            }
            else if (align === Text.alignments.right ||
                (align === Text.alignments.start && dir === "rtl") ||
                (align === Text.alignments.end && dir === "ltr")) {
                horizontal = width;
            }

            const diff = new Position(horizontal, 0);
            return Rectangle.prototype.isHover.call(this, position.subtract(diff));
        }

        return false;
    }

    /**
     * Width of the text
     * @return {Number}
     */
    get width () {
        const key = [this.options.font, this.options.fontSize, this.text].join("-");
        if (this._cachedWidth[key]) {
            return this._cachedWidth[key];
        }

        const root = this.getRoot();
        if (root instanceof Scene) {
            root.ctx.font = `${this.options.fontSize}px ${this.options.font}`;
            const { width } = root.ctx.measureText(this.text);
            this._cachedWidth = {
                [key]: width,
            };
            return width;
        }

        return 0;
    }

    /**
     * Height of the text
     * @return {Number}
     */
    get height () {
        return this.options.fontSize;
    }

    /**
     * @typedef {Object} TextOptions
     * @extends ComponentOptions
     * @prop {String} [font="sans-serif"] - Font to use
     * @prop {Number} [fontSize=10] - Size of the text in pixels
     * @prop {String} [align=Text.alignments.start] - Text horizontal alignment
     * @prop {String} [baseline=Text.baselines.top] - Text vertical alignment
     */
    /**
     * @return {TextOptions}
     */
    static get defaultOptions () {
        return Object.assign({
            font: "sans-serif",
            fontSize: 10,
            align: Text.alignments.start,
        }, super.defaultOptions);
    }

    /**
     * @typedef {Object} TextAlignments
     * @prop {String} left - The text is left-aligned.
     * @prop {String} right - The text is right-aligned.
     * @prop {String} center - The text is centered.
     * @prop {String} start - The text is aligned at the normal start of the line. (regarding locales)
     * @prop {String} end - The text is aligned at the normal end of the line. (regarding locales)
     */
    /**
     *
     * @returns {TextAlignments}
     */
    static get alignments () {
        return {
            left: "left",
            right: "right",
            center: "center",
            start: "start",
            end: "end",
        };
    }
}
