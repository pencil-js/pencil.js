import textDirection from "text-direction";
import NetworkEvent from "./network-event.js";
import Rectangle, { type RectangleOptions } from "./rectangle.js";
import type { ContainerJSON } from "./container.js";
import type { PositionDefinition } from "./position.js";
import { getSandbox, toStyle } from "./internal/canvas.js";
import { set } from "./internal/render-state.js";

/**
 * Text options
 */
export interface TextOptions extends RectangleOptions {
    /** Font to use (can be a URL) */
    font: string;
    /** Size of the text in pixels */
    fontSize: number;
    /** Text horizontal alignment */
    align: CanvasTextAlign;
    /** Use bold font-weight */
    bold: boolean;
    /** Use italic font-style */
    italic: boolean;
    /** Draw a line under the text */
    underscore: boolean;
    /** Ratio of line height (1 is normal, 2 is twice the space) */
    lineHeight: number;
}

/**
 * Size of a text
 */
export interface TextMeasures {
    width: number;
    height: number;
}

export type FontOptions = Pick<TextOptions, "font" | "fontSize" | "bold" | "italic" | "lineHeight">;

/**
 * Format a text or a list of lines into a list of lines
 * @param text - Any text or list of lines
 */
function formatString (text: string | Array<string> | number): Array<string> {
    return Array.isArray(text) ? text.flatMap(line => formatString(line)) : String(text).split("\n");
}

const MAX_CACHE_SIZE = 500;
const measureCache = new Map<string, TextMeasures>();

const DEFAULT_FONT = "sans-serif";
const DEFAULT_FONT_SIZE = 20;
const NO_DASH: Array<number> = [];

/**
 * Measures and font of a text, kept while the text and font options don't change
 */
interface TextCache {
    lines: Array<string>;
    font: string;
    fontSize: number;
    bold: boolean;
    italic: boolean;
    lineHeight: number;
    definition: string;
    measures: TextMeasures;
    lineWidths: Array<number>;
}

/** Text direction of each canvas, computed once per frame */
const directions = new WeakMap<HTMLCanvasElement, { frame: number; direction: string }>();

const textAlignments = {
    left: "left",
    right: "right",
    center: "center",
    start: "start",
    end: "end",
} as const;

/**
 * Display text
 */
export class Text<O extends TextOptions = TextOptions> extends Rectangle<O> {
    static override get className (): string {
        return "Text";
    }

    /** Lines of text */
    lines!: Array<string>;

    #cache: TextCache | null = null;

    /**
     * Text constructor
     * @param positionDefinition - Top-left corner of the text (depending on the alignment)
     * @param text - Text to display (can contain line breaks or be a list of lines)
     * @param options - Drawing options
     */
    constructor (positionDefinition?: PositionDefinition, text: string | Array<string> = "", options?: Partial<O>) {
        super(positionDefinition, 0, 0, options);

        this.text = text;

        const fireReady = () => this.fire(new NetworkEvent(NetworkEvent.events.ready, this));
        // If font is an URL
        if (/^(\w+:)?\/\//.test(this.options.font)) {
            Text.load(this.options.font).then((name) => {
                this.options.font = name;
                fireReady();
            }).catch(() => this.fire(new NetworkEvent(NetworkEvent.events.error, this)));
        }
        else {
            // Let a chance to listen to the event
            queueMicrotask(fireReady);
        }
    }

    /**
     * Displayed text
     */
    get text (): string {
        return this.lines.join("\n");
    }

    set text (text: string | Array<string>) {
        this.lines = formatString(text);
    }

    override makePath (ctx: CanvasRenderingContext2D): this {
        const { options, lines } = this;
        const isEmpty = lines.length === 1 && !lines[0];
        if (isEmpty || (!this.willFill && !this.willStroke)) {
            return this;
        }

        this.setContext(ctx);

        const origin = this.getOrigin();
        ctx.translate(origin.x, origin.y);

        const cache = this.#getCache();
        const height = options.fontSize;
        const lineHeight = height * options.lineHeight;
        const margin = height * ((options.lineHeight - 1) / 2);

        const offset = this.getAlignOffset();
        const shift = offset * cache.measures.width;
        ctx.translate(shift, 0);

        if (options.underscore) {
            ctx.beginPath();
        }

        for (let index = 0; index < lines.length; ++index) {
            const y = (index * lineHeight) + margin;
            if (this.willFill) {
                ctx.fillText(lines[index], 0, y);
            }
            if (this.willStroke) {
                ctx.strokeText(lines[index], 0, y);
            }
            if (options.underscore) {
                const width = cache.lineWidths[index];
                const left = offset * width;
                ctx.moveTo(-left, y + height);
                ctx.lineTo(width - left, y + height);
            }
        }

        if (options.underscore) {
            const style = (this.willStroke && options.stroke) || options.fill;
            ctx.lineWidth = height * (options.bold ? 0.07 : 0.05);
            if (style) {
                ctx.strokeStyle = toStyle(style, ctx);
            }
            ctx.setLineDash(NO_DASH);
            ctx.stroke();
        }

        ctx.translate(-shift - origin.x, -origin.y);

        return this;
    }

    override trace (path: Path2D): this {
        // Hit-box of a text is its bounding rectangle
        path.rect(0, 0, this.width, this.height);
        return this;
    }

    override setContext (ctx: CanvasRenderingContext2D): this {
        super.setContext(ctx);

        set(ctx, "font", this.#getCache().definition);
        set(ctx, "textAlign", this.options.align);
        set(ctx, "textBaseline", "top");

        return this;
    }

    /**
     * Compute the horizontal offset ratio according to alignment and text direction
     */
    getAlignOffset (): number {
        const { align } = this.options;

        if (align === "center") {
            return 0.5;
        }
        if (align === "right") {
            return 1;
        }
        if (align === "start" || align === "end") {
            const root = this.getRoot() as unknown as { isScene: boolean; ctx?: CanvasRenderingContext2D; frameCount: number };
            const canvas = root.ctx?.canvas;
            if (root.isScene && canvas?.isConnected) {
                // Reading the direction is costly, do it once per frame for all texts
                let known = directions.get(canvas);
                if (!known) {
                    known = {
                        frame: NaN,
                        direction: "",
                    };
                    directions.set(canvas, known);
                }
                if (known.frame !== root.frameCount) {
                    known.frame = root.frameCount;
                    known.direction = textDirection(canvas);
                }
                const { direction } = known;
                if ((align === "start" && direction === "rtl") || (align === "end" && direction === "ltr")) {
                    return 1;
                }
            }
            else if (align === "end") {
                return 1;
            }
        }

        return 0;
    }

    /**
     * Measure the text with current options
     */
    getMeasures (): TextMeasures {
        return this.#getCache().measures;
    }

    /**
     * Return measures and font, computed again only when the text or the font options change
     */
    #getCache (): TextCache {
        const { lines } = this;
        const { font, fontSize, bold, italic, lineHeight } = this.options;
        const cache = this.#cache;
        if (cache && cache.lines === lines && cache.font === font && cache.fontSize === fontSize &&
            cache.bold === bold && cache.italic === italic && cache.lineHeight === lineHeight) {
            return cache;
        }

        const definition = Text.getFontDefinition(this.options);
        const sandbox = getSandbox();
        sandbox.font = definition;
        const lineWidths = lines.map(line => sandbox.measureText(line).width);
        this.#cache = {
            lines,
            font,
            fontSize,
            bold,
            italic,
            lineHeight,
            definition,
            measures: {
                width: Math.max(0, ...lineWidths),
                height: fontSize * lineHeight * lines.length,
            },
            lineWidths,
        };
        return this.#cache;
    }

    /**
     * Width of the text (read-only)
     */
    override get width (): number {
        return this.getMeasures().width;
    }

    override set width (_value: number) {
        // Computed from the text
    }

    /**
     * Height of the text (read-only)
     */
    override get height (): number {
        return this.getMeasures().height;
    }

    override set height (_value: number) {
        // Computed from the text
    }

    override toJSON (): ContainerJSON {
        const { width: _width, height: _height, ...json } = super.toJSON();
        return {
            ...json,
            text: this.text,
        };
    }

    /**
     * Return an instance from a generic object
     * @param definition - Text definition
     */
    static override from (definition: ContainerJSON): Text {
        return new this(definition.position, definition.text, definition.options);
    }

    /**
     * Load a font from a URL
     * @param url - Url (or list of url) of the font file
     * @returns A promise for the font name(s) to use
     */
    static load (url: string): Promise<string>;
    static load (url: Array<string>): Promise<Array<string>>;
    static load (url: string | Array<string>): Promise<string | Array<string>> {
        if (Array.isArray(url)) {
            return Promise.all(url.map(singleUrl => Text.load(singleUrl)));
        }

        const name = url.replace(/\W/g, "-");
        const fontFace = new FontFace(name, `url(${url})`);
        window.document.fonts.add(fontFace);
        return fontFace.load().then(() => name);
    }

    /**
     * Return a CSS font definition
     * @param options - Font related options
     */
    static getFontDefinition (options: Partial<FontOptions>): string {
        const { bold, italic, fontSize = DEFAULT_FONT_SIZE, font = DEFAULT_FONT } = options;
        return `${bold ? "bold " : ""}${italic ? "italic " : ""}${fontSize}px ${font}`;
    }

    /**
     * Compute the size of a text
     * @param text - Any text or list of lines
     * @param options - Font related options
     */
    static measure (text: string | Array<string>, options: Partial<FontOptions> = {}): TextMeasures {
        const lines = formatString(text);
        const { lineHeight = 1, fontSize = DEFAULT_FONT_SIZE } = options;
        const fontDefinition = Text.getFontDefinition(options);
        const key = `${fontDefinition}|${lineHeight}|${lines.join("\n")}`;
        const cached = measureCache.get(key);
        if (cached) {
            return cached;
        }

        const sandbox = getSandbox();
        sandbox.font = fontDefinition;
        const result = {
            width: lines.reduce((max, line) => Math.max(max, sandbox.measureText(line).width), 0),
            height: fontSize * lineHeight * lines.length,
        };
        if (measureCache.size >= MAX_CACHE_SIZE) {
            measureCache.clear();
        }
        measureCache.set(key, result);
        return result;
    }

    static override get defaultOptions (): TextOptions {
        return {
            ...super.defaultOptions,
            font: DEFAULT_FONT,
            fontSize: DEFAULT_FONT_SIZE,
            align: Text.alignments.start,
            bold: false,
            italic: false,
            underscore: false,
            lineHeight: 1,
        };
    }

    /**
     * Text alignments
     */
    static get alignments () {
        return textAlignments;
    }
}

export default Text;
