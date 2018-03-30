import Component from "@pencil.js/component";
import Rectangle from "@pencil.js/rectangle";
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
     * @param {TextOptions} [options] - Drawing options
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
        this._cachedMeasures = {};
    }

    /**
     * Draw the text into a drawing context
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Text} Itself
     */
    trace (ctx) {
        const text = this.text.toString();
        if (text.length) {
            const opts = this.options;
            ctx.font = `${opts.bold ? "bold " : ""}${opts.italic ? "italic " : ""}${opts.fontSize}px ${opts.font}`;
            ctx.textAlign = opts.align;
            ctx.textBaseline = "top"; // TODO: user could want to change this, but fonts em-box can have crazy values

            if (opts.fill) {
                ctx.fillStyle = opts.fill;
                ctx.fillText(text, 0, 0);
            }

            if (opts.stroke) {
                ctx.strokeStyle = opts.stroke;
                ctx.lineWidth = opts.strokeWidth;
                ctx.strokeText(text, 0, 0);
            }
        }
        return this;
    }

    /**
     * Define if it's hover a position
     * @param {Position} position - Any position
     * @return {Boolean}
     */
    isHover (position) {
        const scene = this.hasScene();
        if (scene) {
            const dir = textDirection(scene.ctx.canvas);
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
            return Rectangle.prototype.isHover.call(this, position.add(diff));
        }

        return false;
    }

    /**
     * Return a hash of the current string (with options)
     * @returns {String}
     */
    get hash () {
        return btoa([this.options.font, this.options.fontSize, this.text].join(","));
    }

    /**
     * Measure the text with current options and cache the result
     * @return {{width: Number, height: Number}}
     */
    getMeasures () {
        const key = this.hash;
        if (this._cachedMeasures[key]) {
            return this._cachedMeasures[key];
        }

        const scene = this.hasScene();
        if (scene) {
            scene.ctx.font = `${this.options.fontSize}px ${this.options.font}`;
            const { width } = scene.ctx.measureText(this.text);
            // Hack to get the em box's height
            const height = scene.ctx.measureText("M").width;
            const measured = {
                width,
                height,
            };
            this._cachedMeasures = {
                [key]: measured,
            };
            return measured;
        }

        return {
            width: 0,
            height: 0,
        };
    }

    /**
     * Width of the text
     * @return {Number}
     */
    get width () {
        return this.getMeasures().width;
    }

    /**
     * Height of the text
     * @return {Number}
     */
    get height () {
        return this.getMeasures().height;
    }

    /**
     * @typedef {Object} TextOptions
     * @extends ComponentOptions
     * @prop {String} [font="sans-serif"] - Font to use
     * @prop {Number} [fontSize=10] - Size of the text in pixels
     * @prop {String} [align=Text.alignments.start] - Text horizontal alignment
     * @prop {Boolean} [bold=false] - Use bold font-weight
     * @prop {Boolean} [italic=false] - Use italic font-style
     */
    /**
     * @return {TextOptions}
     */
    static get defaultOptions () {
        return Object.assign({
            font: "sans-serif",
            fontSize: 20,
            align: Text.alignments.start,
            bold: false,
            italic: false,
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
