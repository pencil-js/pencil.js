import NetworkEvent from "@pencil.js/network-event";
import Component from "@pencil.js/component";
import textDirection from "text-direction";
import hash from "@sindresorhus/fnv1a";
import * as textMetrics from "text-metrics";

/**
 * Reformat passed arguments into an array of line string
 * @param {String|Array<String>} string -
 * @return {Array<String>}
 */
function formatString (string) {
    const separator = "\n";
    return Array.isArray(string) ?
        string.reduce((acc, line) => acc.concat(line.split(separator)), []) :
        string.split(separator);
}

/**
 * Cache based text measurement
 * @param {String} text - Any text
 * @param {TextOptions} options - Font definition
 * @return {TextMeasures}
 */
const measureText = (() => {
    const cache = {};

    return (text, options) => {
        const key = hash(`${text}${JSON.stringify(options)}`);
        if (cache[key] !== undefined) {
            return cache[key];
        }

        const multiline = {
            multiline: true,
        };
        const measures = textMetrics.init({
            fontFamily: options.font,
            fontSize: `${options.fontSize}px`,
            fontWeight: options.bold ? "700" : "400",
            lineHeight: `${options.fontSize * options.lineHeight}px`,
        });
        const result = {
            width: measures.width(text, multiline),
            height: measures.height(text, multiline),
        };
        cache[key] = result;
        return result;
    };
})();

/**
 * Text class
 * @class
 * @extends Component
 */
export default class Text extends Component {
    /**
     * Text constructor
     * @param {PositionDefinition} positionDefinition - Top most point of the line start (depend on align option)
     * @param {String} [text=""] - Text to display
     * @param {TextOptions} [options] - Drawing options
     */
    constructor (positionDefinition, text = "", options) {
        super(positionDefinition, options);

        /**
         * @type {Array<String>}
         */
        this.lines = [];
        this.text = text;

        // if font is an URL
        const isLoadedEvent = new NetworkEvent(NetworkEvent.events.ready, this);
        if (/^(\w+:)?\/\//.test(this.options.font)) {
            Text.load(this.options.font).then((name) => {
                this.options.font = name;
                this.fire(isLoadedEvent);
            });
        }
        else {
            this.fire(isLoadedEvent);
        }
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
     * @param {String|Array<String>} text - New text value
     * @example this.text = "Single line text";
     * @example this.text = "Multi\nLine text";
     * @example this.text = ["Multi", "Line text"];
     * @example this.text = ["Multi", "Line\ntext"];
     */
    set text (text) {
        this.lines = formatString(text);
    }

    /**
     * Draw the text into a drawing context
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Text} Itself
     */
    makePath (ctx) {
        const opts = this.options;
        if (this.text.length && (opts.fill || (opts.stroke && opts.strokeWidth > 0))) {
            ctx.save();

            const lineHeight = Text.measure("M", this.options).height;
            const height = lineHeight / opts.lineHeight;
            const margin = height * ((opts.lineHeight - 1) / 2);

            this.setContext(ctx);

            if (opts.underscore) {
                ctx.beginPath();
            }

            const offset = -this.getAlignOffset();
            this.lines.forEach((line, index) => {
                const y = (index * lineHeight) + margin;
                if (opts.fill) {
                    ctx.fillText(line, offset * this.width, y);
                }
                if (opts.stroke) {
                    ctx.strokeText(line, offset * this.width, y);
                }
                if (opts.underscore) {
                    const { width } = Text.measure(line, opts);
                    const left = offset * (this.width - width);
                    ctx.moveTo(left, y + height);
                    ctx.lineTo(left + width, y + height);
                }
            });

            if (opts.underscore) {
                ctx.lineWidth = height * (opts.bold ? 0.07 : 0.05);
                ctx.strokeStyle = opts.fill || opts.stroke;
                ctx.stroke();
                ctx.closePath();
            }

            ctx.restore();
        }

        return this;
    }

    /**
     * @inheritDoc
     */
    setContext (ctx) {
        const [willFill, willStroke] = super.setContext(ctx);

        if (willFill || willStroke) {
            ctx.font = Text.getFontDefinition(this.options);
            ctx.textAlign = this.options.align;
            ctx.textBaseline = "top"; // TODO: user could want to change this
        }

        return [willFill, willStroke];
    }

    /**
     *
     * @param {Path2D} path -
     * @return {Path2D}
     */
    trace (path) {
        path.rect(0, 0, this.width, this.height);
        return path;
    }

    /**
     * Return the position offset according to alignment
     * @return {Number}
     */
    getAlignOffset () {
        const { align } = this.options;

        let offset = 0;

        if (align === Text.alignments.center) {
            offset = 0.5;
        }
        else if (align === Text.alignments.right) {
            offset = 1;
        }
        else if (align === Text.alignments.start || align === Text.alignments.end) {
            const root = this.getRoot();
            if (root.isScene) {
                const dir = textDirection(root.ctx.canvas);
                if ((align === Text.alignments.start && dir === "rtl") ||
                    (align === Text.alignments.end && dir === "ltr")) {
                    offset = 1;
                }
            }
        }

        return -offset;
    }

    /**
     * Get this origin position relative to the top-left corner
     * @return {Position}
     */
    getOrigin () {
        return super.getOrigin().clone().add(this.getAlignOffset() * this.width, 0);
    }

    /**
     * Measure the text with current options
     * @return {TextMeasures}
     */
    getMeasures () {
        return Text.measure(this.text, this.options);
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
        const { text } = this;
        return {
            ...super.toJSON(),
            text,
        };
    }

    /**
     * @param {Object} definition - Text definition
     * @return {Text}
     */
    static from (definition) {
        return new Text(definition.position, definition.text, definition.options);
    }

    /**
     * Load a font URL
     * @param {String|Array<String>} url - URL or an array of URL to font files
     * @return {Promise<String>} Promise for the generated font-family
     */
    static load (url) {
        if (Array.isArray(url)) {
            return Promise.all(url.map(singleUrl => Text.load(singleUrl)));
        }

        const name = url.replace(/\W/g, "-");
        const fontFace = new window.FontFace(name, `url(${url})`);
        window.document.fonts.add(fontFace);
        return fontFace.load().then(() => name);
    }

    /**
     * Return a font definition from a set of options
     * @param {TextOptions} options - Chosen options
     * @returns {String}
     */
    static getFontDefinition (options) {
        return `${options.bold ? "bold " : ""}${options.italic ? "italic " : ""}${options.fontSize}px ${options.font}`;
    }

    /**
     * @typedef {Object} TextMeasures
     * @prop {Number} width - Horizontal size
     * @prop {Number} height - Vertical size
     */
    /**
     * Compute a text width and height
     * @param {String|Array<String>} text - Any text
     * @param {TextOptions} [options] - Options of the text
     * @return {TextMeasures}
     */
    static measure (text, options) {
        const string = Array.isArray(text) ? text.join("\n") : text;
        const opts = {
            ...this.defaultOptions,
            ...options,
        };
        return measureText(string, opts);
    }

    /**
     * @typedef {Object} TextOptions
     * @extends ComponentOptions
     * @prop {String} [font="sans-serif"] - Font to use
     * @prop {Number} [fontSize=10] - Size of the text in pixels
     * @prop {String} [align=Text.alignments.start] - Text horizontal alignment
     * @prop {Boolean} [bold=false] - Use bold font-weight
     * @prop {Boolean} [italic=false] - Use italic font-style
     * @prop {Number} [lineHeight=1] - Ratio of line height; 1 is normal, 2 is twice the space
     * @prop {Boolean} [underscore=false] - Draw a line under the text
     */
    /**
     * @return {TextOptions}
     */
    static get defaultOptions () {
        return {
            ...super.defaultOptions,
            font: "sans-serif",
            fontSize: 20,
            align: Text.alignments.start,
            bold: false,
            italic: false,
            underscore: false,
            lineHeight: 1,
        };
    }

    /**
     * @typedef {Object} TextAlignments
     * @enum {String}
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
