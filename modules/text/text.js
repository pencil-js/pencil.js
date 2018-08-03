import BaseEvent from "@pencil.js/base-event";
import Component from "@pencil.js/component";
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
        /**
         * @type {Object}
         * @private
         */
        this._cachedMeasures = {};

        // if font is an URL
        const isReadyEvent = new BaseEvent(this, "ready");
        if (/^(\w+:)?\/\//.test(this.options.font)) {
            Text.load(this.options.font).then((name) => {
                this.options.font = name;
                this.fire(isReadyEvent);
            });
        }
        else {
            this.fire(isReadyEvent);
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
     * Draw the text into a drawing context
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Text} Itself
     */
    makePath (ctx) {
        if (this.text.trim().length) {
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
        }
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
            const scene = this.getRoot();
            if (scene.isScene) {
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
     * Return a hash of the current text with its options
     * @returns {String}
     */
    get hash () {
        return window.btoa(encodeURIComponent([
            this.text,
            this.options.font,
            this.options.fontSize,
            +this.options.bold,
            +this.options.italic,
        ].join(";")));
    }

    /**
     * Use a hash to set this params
     * @param {String} value -
     */
    set hash (value) {
        const options = decodeURIComponent(window.atob(value)).split(";");
        [this.text, this.options.font] = options;
        this.options.fontSize = +options[2];
        this.options.bold = Boolean(options[3]);
        this.options.italic = Boolean(options[4]);
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

        const scene = this.getRoot();
        if (scene.isScene) {
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
        return fontFace.load().then(() => name);
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
