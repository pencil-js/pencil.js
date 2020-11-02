import NetworkEvent from "@pencil.js/network-event";
import Rectangle from "@pencil.js/rectangle";
import textDirection from "text-direction";
import hash from "@sindresorhus/fnv1a";

/**
 * @module Text
 */

/**
 * Reformat passed arguments into an array of line string
 * @param {String|Array<String>} string - Multiline string or Array of multiline strings to split
 * @return {Array<String>}
 */
function formatString (string) {
    const split = text => text.toString().split("\n");
    return Array.isArray(string) ?
        string.reduce((acc, line) => acc.concat(split(line)), []) :
        split(string);
}

/**
 * Cache based text measurement
 * @param {String} text - Any text
 * @param {TextOptions} options - Font definition
 * @return {TextMeasures}
 */
const measureText = (() => {
    let sandbox;
    const cache = {};

    return (text, options) => {
        const key = hash(`${text}${JSON.stringify(options)}`);
        if (cache[key] !== undefined) {
            return cache[key];
        }

        if (!sandbox) {
            sandbox = document.createElement("canvas").getContext("2d");
        }

        sandbox.font = Text.getFontDefinition(options);
        const lines = formatString(text);
        const height = options.fontSize * options.lineHeight * lines.length;
        const width = lines.reduce((max, line) => Math.max(max, sandbox.measureText(line).width), 0);
        const result = {
            width,
            height,
        };
        cache[key] = result;
        return result;
    };
})();

/**
 * Text class
 * @class
 * @extends Rectangle
 */
export default class Text extends Rectangle {
    /**
     * Text constructor
     * @param {PositionDefinition} positionDefinition - Top most point of the line start (depend on align option)
     * @param {String} [text=""] - Text to display
     * @param {TextOptions} [options] - Drawing options
     */
    constructor (positionDefinition, text = "", options) {
        super(positionDefinition, undefined, undefined, options);

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
        const { options } = this;
        if (this.text.length && (this.willFill || this.willStroke)) {
            const origin = this.getOrigin();
            ctx.translate(origin.x, origin.y);

            const lineHeight = Text.measure("M", this.options).height;
            const height = lineHeight / options.lineHeight;
            const margin = height * ((options.lineHeight - 1) / 2);

            if (options.underscore) {
                ctx.beginPath();
            }

            const offset = this.getAlignOffset();
            ctx.translate(offset * this.width, 0);
            this.lines.forEach((line, index) => {
                const y = (index * lineHeight) + margin;
                if (this.willFill) {
                    ctx.fillText(line, 0, y);
                }
                if (this.willStroke) {
                    ctx.strokeText(line, 0, y);
                }
                if (options.underscore) {
                    const { width } = Text.measure(line, options);
                    const left = offset * width;
                    ctx.moveTo(-left, y + height);
                    ctx.lineTo(width - left, y + height);
                }
            });

            if (options.underscore) {
                ctx.lineWidth = height * (options.bold ? 0.07 : 0.05);
                ctx.strokeStyle = ((this.willStroke && options.stroke) || options.fill).toString(ctx);
                ctx.stroke();
                ctx.closePath();
            }

            ctx.translate(-origin.x, -origin.y);
        }

        return this;
    }

    /**
     * @inheritDoc
     * @return {Text} Itself
     */
    setContext (ctx) {
        super.setContext(ctx);

        if (this.willFill || this.willStroke) {
            ctx.font = Text.getFontDefinition(this.options);
            ctx.textAlign = this.options.align;
            ctx.textBaseline = "top"; // TODO: user could want to change this
        }

        return this;
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

        return offset;
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
     * Can't set text's width
     * @param {*} _ -
     */
    set width (_) { // eslint-disable-line class-methods-use-this
        // Do nothing
    }

    /**
     * Height of the text
     * @return {Number}
     */
    get height () {
        return this.getMeasures().height;
    }

    /**
     * Can't set text's height
     * @param {*} _ -
     */
    set height (_) { // eslint-disable-line class-methods-use-this
        // Do nothing
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
     * @return {String}
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
     * @prop {String} [font="sans-serif"] - Font to use (can be a URL)
     * @prop {Number} [fontSize=10] - Size of the text in pixels
     * @prop {String} [align=Text.alignments.start] - Text horizontal alignment
     * @prop {Boolean} [bold=false] - Use bold font-weight
     * @prop {Boolean} [italic=false] - Use italic font-style
     * @prop {Boolean} [underscore=false] - Draw a line under the text
     * @prop {Number} [lineHeight=1] - Ratio of line height (1 is normal, 2 is twice the space)
     */
    /**
     * @type {TextOptions}
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
     * @type {TextAlignments}
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
