import Position, { type PositionDefinition } from "./position.js";
import Image from "./image.js";
import OffScreenCanvas from "./offscreen-canvas.js";
import NetworkEvent from "./network-event.js";
import { getRectangleOrigin } from "./rectangle.js";

/**
 * Pattern options
 */
export interface PatternOptions {
    /** Repetition rule */
    repeat: PatternRepetition;
    /** Relative offset (accept named origins like "center") */
    origin: PositionDefinition | string;
    /** Scaling ratio or a pair of value for horizontal and vertical scaling */
    scale: number | PositionDefinition;
}

/**
 * Any repetition rule
 */
export type PatternRepetition = "repeat" | "repeat-x" | "repeat-y" | "no-repeat";

/**
 * Any source accepted by a Pattern
 */

export type PatternSource = string | HTMLImageElement | HTMLCanvasElement | OffScreenCanvas | Image | Pattern;

/**
 * JSON representation of a pattern
 */
export interface PatternJSON {
    constructor: "Pattern";
    source: string;
    options: Partial<PatternOptions>;
}

/**
 * Repeated image usable as fill or stroke
 * @module Pattern
 */
export default class Pattern {
    static get className (): "Pattern" {
        return "Pattern";
    }

    /** Set of options */
    options: PatternOptions;

    #source: HTMLImageElement | HTMLCanvasElement | OffScreenCanvas | null = null;

    /**
     * Pattern constructor
     * @param source - Source of the pattern
     * @param options - Some options
     */
    constructor (source: PatternSource, options?: Partial<PatternOptions>) {
        this.options = {
            ...Pattern.defaultOptions,
            ...options,
        };
        this.source = source;
    }

    /**
     * Drawable source of the pattern
     */
    get source (): HTMLImageElement | HTMLCanvasElement | null {
        const source = this.#source;
        if (source instanceof OffScreenCanvas) {
            if (!(source as unknown as { isLooped?: boolean }).isLooped) {
                source.render();
            }
            return source.ctx.canvas;
        }

        return source;
    }

    /**
     * Change the source of the pattern
     * @param newSource - New source for the pattern
     */
    set source (newSource: PatternSource) {
        if (typeof newSource === "string") {
            this.source = new Image(undefined, newSource);
        }
        else if (newSource instanceof window.HTMLImageElement ||
            newSource instanceof window.HTMLCanvasElement ||
            newSource instanceof OffScreenCanvas) {
            this.#source = newSource;
        }
        else if (newSource instanceof Image) {
            this.#source = null;
            if (newSource.isLoaded) {
                this.#source = newSource.file;
            }
            else {
                newSource.once(NetworkEvent.events.ready, () => {
                    this.#source = newSource.file;
                });
            }
        }
        else if (newSource instanceof Pattern) {
            this.#source = newSource.#source;
        }
    }

    /**
     * Width of the source
     */
    get width (): number {
        return this.source?.width ?? 0;
    }

    /**
     * Height of the source
     */
    get height (): number {
        return this.source?.height ?? 0;
    }

    /**
     * Return a canvas pattern (or a transparent color when not ready)
     * @param ctx - Drawing context
     */
    toString (ctx: CanvasRenderingContext2D): CanvasPattern | string {
        const { source } = this;
        if (!source || !this.width || !this.height) {
            return "transparent";
        }
        const pattern = ctx.createPattern(source, this.options.repeat);
        if (!pattern) {
            return "transparent";
        }
        const { scale } = this.options;
        const { x, y } = typeof scale === "number" ? { x: scale, y: scale } : Position.from(scale);
        const origin = getRectangleOrigin(this);
        pattern.setTransform(new DOMMatrix([x, 0, 0, y, origin.x * x, origin.y * y]));
        return pattern;
    }

    /**
     * Return a json ready object (only works with image sources)
     */
    toJSON (): PatternJSON {
        const source = this.#source;
        if (!(source instanceof window.HTMLImageElement)) {
            throw new TypeError("Only patterns using an image can be serialized.");
        }
        const { origin, ...options } = this.options;
        return {
            constructor: Pattern.className,
            source: source.getAttribute("src") ?? source.src,
            options: {
                ...options,
                origin: typeof origin === "string" ? origin : Position.from(origin).toJSON(),
            },
        };
    }

    /**
     * Return an instance from a generic object
     * @param definition - Pattern definition
     */
    static from (definition: Omit<PatternJSON, "constructor">): Pattern {
        return new Pattern(definition.source, definition.options);
    }

    /**
     * Default options for this class
     */
    static get defaultOptions (): PatternOptions {
        return {
            repeat: Pattern.repetition.repeat,
            origin: new Position(),
            scale: 1,
        };
    }

    /**
     * Repetition rules
     */
    static get repetition () {
        return {
            /** Repeat in both directions */
            repeat: "repeat",
            /** Repeat only horizontally */
            x: "repeat-x",
            /** Repeat only vertically */
            y: "repeat-y",
            /** Don't repeat */
            none: "no-repeat",
        } as const;
    }
}
