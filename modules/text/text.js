import NetworkEvent from "@pencil.js/network-event";
import Component from "@pencil.js/component";
import OffScreenCanvas from "@pencil.js/offscreen-canvas";
import Position from "@pencil.js/position";
import textDirection from "text-direction";
import hash from "@sindresorhus/fnv1a";

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
 *
 * @param {String} line - Any text
 * @param {String} font - Font definition string
 */
const measureText = (() => {
    const { ctx } = new OffScreenCanvas();
    const cache = {};

    return (line, font) => {
        const key = hash(`${line}${font}`);
        if (cache[key] !== undefined) {
            return cache[key];
        }
        ctx.font = font;
        const measure = ctx.measureText(line);
        const result = {
            width: measure.width,
            height: measure.emHeightAscent + measure.emHeightDescent,
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
            Text.load(this.options.font).then(() => {
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
        if (this.text.length) {
            const opts = this.options;
            ctx.font = Text.getFontDefinition(opts);
            ctx.textAlign = opts.align;
            ctx.textBaseline = "top"; // TODO: user could want to change this

            const { height } = measureText("M", ctx.font);
            const lineHeight = height * opts.lineHeight;
            const margin = height * ((opts.lineHeight - 1) / 2);

            if (opts.fill) {
                ctx.fillStyle = opts.fill;
            }

            if (opts.stroke) {
                ctx.strokeStyle = opts.stroke;
                ctx.lineWidth = opts.strokeWidth;
            }

            if (opts.underscore) {
                ctx.beginPath();
            }
            this.lines.forEach((line, index) => {
                const y = (index * lineHeight) + margin;
                if (opts.fill) {
                    ctx.fillText(line, 0, y);
                }
                if (opts.stroke) {
                    ctx.strokeText(line, 0, y);
                }
                if (opts.underscore) {
                    const { width } = measureText(line, ctx.font);
                    ctx.moveTo(0, y + height);
                    ctx.lineTo(width, y + height);
                }
            });
            if (opts.underscore) {
                ctx.lineWidth = height * 0.05;
                ctx.strokeStyle = opts.fill || opts.stroke;
                ctx.stroke();
                ctx.closePath();
            }
        }
        return this;
    }

    /**
     * @inheritDoc
     */
    isHover (positionDefinition) {
        if (!this.options.shown) {
            return false;
        }

        const { width, height } = this.getMeasures();
        const relativePosition = this.getOriginPosition().add(Position.from(positionDefinition));
        return this.position.x <= relativePosition.x && relativePosition.x <= this.position.x + width &&
            this.position.y <= relativePosition.y && relativePosition.y <= this.position.y + height;
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
        else if (align === Text.alignments.start || align === Text.alignments.end) {
            const root = this.getRoot();
            if (root.isScene) {
                const dir = textDirection(root.ctx.canvas);
                if ((align === Text.alignments.start && dir === "rtl") ||
                    (align === Text.alignments.end && dir === "ltr")) {
                    horizontal = this.width;
                }
            }
        }

        return new Position(horizontal, 0);
    }

    /**
     * Measure the text with current options
     * @return {TextMeasures}
     */
    getMeasures () {
        return Text.measure(this.lines, this.options);
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
     * Load a font URL
     * @param {String|Array<String>} url - URL or an array of URL to font files
     * @return {Promise<String>} Promise for the generated font-family
     */
    static load (url) {
        if (Array.isArray(url)) {
            return Promise.all(url.map(singleUrl => Text.load(singleUrl)));
        }

        const name = url.replace(/\W/g, "-");
        const fontFace = new FontFace(name, `url(${url})`);
        window.document.fonts.add(fontFace);
        return fontFace.load().then(() => url);
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
     * @param {TextOptions} [options] -
     * @return {TextMeasures}
     */
    static measure (text, options) {
        const opts = Object.assign(this.defaultOptions, options);
        const lines = formatString(text);
        const font = this.getFontDefinition(opts);
        return {
            width: Math.max(...lines.map(line => measureText(line, font).width)),
            height: measureText("M", font).height * lines.length * opts.lineHeight,
        };
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
        return Object.assign(super.defaultOptions, {
            font: "sans-serif",
            fontSize: 20,
            align: Text.alignments.start,
            bold: false,
            italic: false,
            lineHeight: 1,
            underscore: false,
        });
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
