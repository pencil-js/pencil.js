import Component from "@pencil.js/component";
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
     * @param {PositionDefinition} position - Top most point of the line start (depend on align option)
     * @param {String} text - Text to display
     * @param {TextOptions} [options] - Drawing options
     */
    constructor (position, text, options) {
        super(position, options);

        /**
         * @type {Array<String>}
         */
        this.lines = [];
        this.text = text;
        /**
         * @type {Object}
         * @private
         */
        this._cachedMeasures = {};
    }

    /**
     * Returns the text
     * @return {String}
     */
    get text () {
        return this.lines.join("\n");
    }

    /**
     * Change the text
     * @param {String|Array<String>} lines - New text value
     * @example this.text = "Single line text";
     * @example this.text = "Multi\nLine text";
     * @example this.text = ["Multi", "Line text"];
     * @example this.text = ["Multi", "Line\ntext"];
     */
    set text (lines) {
        const separator = "\n";
        this.lines = Array.isArray(lines) ?
            lines.reduce((acc, line) => acc.concat(line.split(separator)), []) :
            lines.split(separator);
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Text}
     */
    render (ctx) {
        return Container.prototype.render.call(this, ctx, () => {
            if (this.lines.length) {
                this.trace(ctx);
            }
        });
    }

    /**
     * Draw the text into a drawing context
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Text} Itself
     */
    trace (ctx) {
        const lineHeight = this.height / this.lines.length; // TODO: could be user defined

        const opts = this.options;
        ctx.font = this.getFontDefinition();
        ctx.textAlign = opts.align;
        ctx.textBaseline = "top"; // TODO: user could want to change this, but fonts em-box can have crazy values

        if (opts.fill) {
            ctx.fillStyle = opts.fill;
        }
        if (opts.stroke) {
            ctx.strokeStyle = opts.stroke;
            ctx.lineWidth = opts.strokeWidth;
        }

        this.lines.forEach((line, index) => {
            const y = index * lineHeight;
            if (opts.fill) {
                ctx.fillText(line, 0, y);
            }
            if (opts.stroke) {
                ctx.strokeText(line, 0, y);
            }
        });
        return this;
    }

    /**
     *
     * @return {String}
     */
    getFontDefinition () {
        const opts = this.options;
        return `${opts.bold ? "bold " : ""}${opts.italic ? "italic " : ""}${opts.fontSize}px ${opts.font}`;
    }

    /**
     * @inheritDoc
     */
    isHover (position) {
        if (!this.options.shown) {
            return false;
        }

        const { width, height } = this.getMeasures();
        return this.position.x <= position.x && position.x <= this.position.x + width &&
            this.position.y <= position.y && position.y <= this.position.y + height;
    }

    /**
     * Get this origin position relative to the top-left corner
     * @return {Position}
     */
    getOriginPosition () {
        const { align } = this.options;

        let horizontal = 0;

        if (align === Text.alignments.center) {
            horizontal = this.width / 2;
        }
        else if (align === Text.alignments.right) {
            horizontal = this.width;
        }

        if (align === Text.alignments.start || align === Text.alignments.end) {
            const scene = this.hasScene();
            if (scene) {
                const dir = textDirection(scene.ctx.canvas);
                if ((align === Text.alignments.start && dir === "rtl") ||
                    (align === Text.alignments.end && dir === "ltr")) {
                    horizontal = this.width;
                }
            }
        }

        return new Position(horizontal, 0);
    }

    /**
     * Return a hash of the current string (with options)
     * @returns {String}
     */
    get hash () {
        return btoa(encodeURIComponent([this.options.font, this.options.fontSize, this.text].join(",")));
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
            scene.ctx.font = this.getFontDefinition();
            const maxLineWidth = Math.max(...this.lines.map(line => scene.ctx.measureText(line).width));
            // Hack to get the em box's height
            const height = scene.ctx.measureText("M").width * this.lines.length * 1.5;
            const measured = {
                width: maxLineWidth,
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
     * @inheritDoc
     */
    toJSON () {
        return Object.assign(super.toJSON(), {
            text: this.text,
        });
    }

    /**
     * @param {Object} definition - Text definition
     * @return {Text}
     */
    static from (definition) {
        return new Text(definition.position, definition.text, definition.options);
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
        return Object.assign(super.defaultOptions, {
            font: "sans-serif",
            fontSize: 20,
            align: Text.alignments.start,
            bold: false,
            italic: false,
        });
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
