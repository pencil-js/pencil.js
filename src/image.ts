import Rectangle, { type RectangleOptions } from "./rectangle.js";
import type { ContainerJSON } from "./container.js";
import NetworkEvent from "./network-event.js";
import type { PositionDefinition } from "./position.js";
import type { Style } from "./component.js";
import { createContext, toStyle } from "./internal/canvas.js";

/**
 * Image options
 */
export interface ImageOptions extends RectangleOptions {
    /** Override the color of all non-transparent pixels */
    tint: Style;
    /** Alternative description of the image */
    description: string;
}

/**
 * Any source accepted by an Image
 */
export type ImageSource = string | HTMLImageElement | Image | null;

/**
 * Display an image
 */
export class Image<O extends ImageOptions = ImageOptions> extends Rectangle<O> {
    static override get className (): string {
        return "Image";
    }

    /** Loaded image element */
    file: HTMLImageElement | null;

    /** Is the image loaded */
    isLoaded: boolean;

    #url: string | null = null;

    #cache: { ctx?: CanvasRenderingContext2D; tint?: string; file?: HTMLImageElement } = {};

    /**
     * Image constructor
     * @param positionDefinition - Top-left corner (depending on the origin)
     * @param source - Url of the image, image element or other Image instance
     * @param options - Drawing options
     */
    constructor (positionDefinition?: PositionDefinition, source?: ImageSource, options?: Partial<O>) {
        super(positionDefinition, 0, 0, options);

        this.file = null;
        this.isLoaded = false;
        this.url = source ?? null;
    }

    /**
     * Url of the image
     */
    get url (): string | null {
        return this.#url;
    }

    /**
     * Change the image source and start loading it
     * @param source - Url of the image, image element or other Image instance
     */
    set url (source: ImageSource) {
        if (source === this.#url) {
            return;
        }

        this.file = null;
        this.isLoaded = false;
        this.#url = typeof source === "string" ? source : null;

        if (!source) {
            return;
        }

        const done = (img: HTMLImageElement) => {
            this.#url = img.getAttribute?.("src") ?? img.src;
            this.file = img;
            this.isLoaded = true;
            this.width = img.naturalWidth || img.width;
            this.height = img.naturalHeight || img.height;
            this.fire(new NetworkEvent(NetworkEvent.events.ready, this));
        };

        if (source instanceof window.HTMLImageElement) {
            if (source.complete && (source.naturalWidth || source.width)) {
                done(source);
            }
            else {
                source.addEventListener("load", () => done(source), {
                    once: true,
                });
            }
        }
        else if (source instanceof Image) {
            if (source.isLoaded && source.file) {
                done(source.file);
            }
            else {
                source.once(NetworkEvent.events.ready, () => source.file && done(source.file));
            }
        }
        else {
            Image.load(source).then((img) => {
                // Make sure the source hasn't changed meanwhile
                if (this.#url === source) {
                    done(img);
                }
            }).catch(() => {
                this.fire(new NetworkEvent(NetworkEvent.events.error, this));
            });
        }
    }

    override makePath (ctx: CanvasRenderingContext2D): this {
        if (!this.isLoaded) {
            return this;
        }

        ctx.save();

        this.setContext(ctx);

        const origin = this.getOrigin();
        ctx.translate(origin.x, origin.y);

        const path = this.buildPath();

        if (this.willFill) {
            ctx.fill(path);
            // Don't apply shadow twice
            ctx.shadowColor = "transparent";
        }

        if (this.willStroke) {
            ctx.stroke(path);
        }

        this.draw(ctx);

        ctx.restore();

        return this;
    }

    /**
     * Draw the image itself
     * @param ctx - Drawing context
     * @returns Itself
     */
    draw (ctx: CanvasRenderingContext2D): this {
        const { file } = this;
        if (!file) {
            return this;
        }

        const { tint } = this.options;
        if (tint) {
            const tintString = String(toStyle(tint, ctx));
            const cache = this.#cache;
            const width = file.naturalWidth || file.width;
            const height = file.naturalHeight || file.height;
            if (!cache.ctx || cache.ctx.canvas.width !== width || cache.ctx.canvas.height !== height) {
                cache.ctx = createContext(width, height);
                cache.tint = undefined;
            }
            if (tintString !== cache.tint || file !== cache.file) {
                const tinted = cache.ctx;
                tinted.clearRect(0, 0, width, height);
                tinted.globalCompositeOperation = "source-over";
                tinted.drawImage(file, 0, 0);
                tinted.globalCompositeOperation = "source-atop";
                tinted.fillStyle = tintString;
                tinted.fillRect(0, 0, width, height);
                cache.tint = tintString;
                cache.file = file;
            }

            ctx.drawImage(cache.ctx.canvas, 0, 0, this.width, this.height);
        }
        else {
            ctx.drawImage(file, 0, 0, this.width, this.height);
        }
        return this;
    }

    /**
     * An image can be hovered on its whole surface (once loaded)
     * @param positionDefinition - Any position
     * @param ctx - Context use for calculation
     */
    override isHover (positionDefinition?: PositionDefinition, ctx?: CanvasRenderingContext2D): boolean {
        if (!this.isLoaded) {
            return false;
        }

        const previous = this.options.fill;
        this.options.fill = previous || "#000";
        const result = super.isHover(positionDefinition, ctx);
        this.options.fill = previous;

        return result;
    }

    override toJSON (): ContainerJSON {
        const { width: _width, height: _height, ...json } = super.toJSON();
        return {
            ...json,
            url: this.url,
        };
    }

    /**
     * Return an instance from a generic object
     * @param definition - Image definition
     */
    static override from (definition: ContainerJSON): Image {
        return new this(definition.position, definition.url, definition.options);
    }

    /**
     * Load one or more images
     * @param url - Url (or list of url) to load
     * @returns A promise for the loaded image(s)
     */
    static load (url: string): Promise<HTMLImageElement>;
    static load (url: Array<string>): Promise<Array<HTMLImageElement>>;
    static load (url: string | Array<string>): Promise<HTMLImageElement | Array<HTMLImageElement>> {
        if (Array.isArray(url)) {
            return Promise.all(url.map(singleUrl => Image.load(singleUrl)));
        }

        return new Promise((resolve, reject) => {
            const img = window.document.createElement("img");
            img.crossOrigin = "Anonymous";
            img.addEventListener("load", () => resolve(img), {
                once: true,
            });
            img.addEventListener("error", () => reject(new URIError(`Fail to load ${url}.`)), {
                once: true,
            });
            img.src = url;
        });
    }

    static override get defaultOptions (): ImageOptions {
        return {
            ...super.defaultOptions,
            fill: null,
            tint: null,
            description: "",
        };
    }
}

export default Image;
