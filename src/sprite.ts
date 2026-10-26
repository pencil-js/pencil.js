import zeptomatch from "zeptomatch";
import BaseEvent from "./base-event.js";
import Image, { type ImageOptions, type ImageSource } from "./image.js";
import type { ContainerJSON } from "./container.js";
import type { PositionDefinition } from "./position.js";
import { modulo } from "./math.js";

/**
 * Sprite options
 */
export interface SpriteOptions extends ImageOptions {
    /** Speed of the animation (1 = one frame per render, 0.5 = one frame every two render …) */
    speed: number;
    /** Should the animation loop */
    loop: boolean;
}

/**
 * Rectangle definition in a spritesheet
 */
export interface FrameRectangle {
    x: number;
    y: number;
    w: number;
    h: number;
}

/**
 * Frame data (as exported by TexturePacker or pencil-js/spritesheet)
 */
export interface FrameData {
    /** Position of the frame in the sheet */
    frame: FrameRectangle;
    /** Position of the trimmed frame relative to the original size */
    spriteSourceSize: FrameRectangle;
    /** Original size of the frame */
    sourceSize: { w: number; h: number };
    [key: string]: unknown;
}

/**
 * Spritesheet JSON description
 */
export interface SpritesheetData {
    frames: Record<string, FrameData>;
    meta: {
        image: string;
        file?: HTMLImageElement;
        [key: string]: unknown;
    };
}

/**
 * Selector for frames in a spritesheet (a glob pattern, a regular expression or a function)
 */
export type FrameSelector = string | RegExp | ((name: string) => boolean);

/**
 * Turn a selector into a filter function
 * @param selector - Any selector
 */
function toFilter (selector: FrameSelector): (name: string) => boolean {
    if (typeof selector === "function") {
        return selector;
    }
    if (selector instanceof RegExp) {
        return name => selector.test(name);
    }
    const pattern = selector.includes("/") ? selector : `**/${selector}`;
    return name => name === selector || zeptomatch(pattern, name, {});
}

/**
 * Animated image from a spritesheet
 */
export class Sprite<O extends SpriteOptions = SpriteOptions> extends Image<O> {
    static override get className (): string {
        return "Sprite";
    }

    /** List of frames */
    frames: Array<FrameData>;

    /** Current frame (can be a decimal) */
    frame: number;

    /** Is the animation paused */
    isPaused: boolean;

    /**
     * Sprite constructor
     * @param positionDefinition - Top-left corner (depending on the origin)
     * @param url - Url of the spritesheet image
     * @param frames - Description of all frames
     * @param options - Drawing options
     */
    constructor (positionDefinition: PositionDefinition | undefined, url: ImageSource, frames: Array<FrameData>, options?: Partial<O>) {
        super(positionDefinition, url, options);
        this.frames = frames;
        this.frame = 0;
        this.isPaused = false;
        this.#resize();
    }

    /**
     * Match the size of the current frame
     */
    #resize (): void {
        const size = this.frames[Math.floor(this.frame)]?.sourceSize;
        if (size) {
            this.width = size.w;
            this.height = size.h;
        }
    }

    override makePath (ctx: CanvasRenderingContext2D): this {
        this.#resize();

        super.makePath(ctx);

        if (this.isLoaded && !this.isPaused) {
            const last = this.frames.length - 1;
            const frameNumber = Math.floor(this.frame);
            if (this.frame === 0) {
                this.fire(new BaseEvent(Sprite.events.start, this));
            }
            if (this.options.loop || frameNumber < last) {
                const next = this.options.loop ? this.frame + this.options.speed : Math.min(this.frame + this.options.speed, last);
                this.setFrame(next);
            }

            const nextFrame = Math.floor(this.frame);
            if (nextFrame !== frameNumber) {
                this.fire(new BaseEvent(Sprite.events.frame, this));

                if (!this.options.loop && nextFrame === last) {
                    this.fire(new BaseEvent(Sprite.events.end, this));
                }
            }
        }

        return this;
    }

    override draw (ctx: CanvasRenderingContext2D): this {
        const current = this.frames[Math.floor(this.frame)];
        if (!this.file || !current) {
            return this;
        }

        const { frame, spriteSourceSize } = current;
        ctx.drawImage(
            this.file,
            frame.x, frame.y, frame.w, frame.h,
            spriteSourceSize.x, spriteSourceSize.y, spriteSourceSize.w, spriteSourceSize.h,
        );

        return this;
    }

    /**
     * Start (or resume) the animation
     * @param speed - Change the animation speed
     * @returns Itself
     */
    play (speed?: number): this {
        this.isPaused = false;
        if (speed !== undefined) {
            this.options.speed = speed;
        }
        return this;
    }

    /**
     * Pause the animation
     * @returns Itself
     */
    pause (): this {
        this.isPaused = true;
        return this;
    }

    /**
     * Go to a specific frame
     * @param frame - Frame index
     * @returns Itself
     */
    setFrame (frame: number): this {
        this.frame = this.frames.length ? modulo(frame, this.frames.length) : 0;
        return this;
    }

    override toJSON (): ContainerJSON {
        const { frames, frame, isPaused } = this;
        return {
            ...super.toJSON(),
            frames,
            frame,
            isPaused,
        };
    }

    /**
     * Return an instance from a generic object
     * @param definition - Sprite definition
     */
    static override from (definition: ContainerJSON): Sprite {
        const { position, url, frames, frame, isPaused, options } = definition;
        const sprite = new this(position, url, frames, options);
        sprite.setFrame(frame ?? 0);
        if (isPaused) {
            sprite.pause();
        }
        return sprite;
    }

    /**
     * Load a spritesheet description (and its image)
     * @param url - Url of the JSON description
     * @example
     * const sheet = await Sprite.sheet("spritesheet.json");
     * const runner = sheet.extract([100, 100], "run_*");
     */

    static async sheet (url: string): Promise<Spritesheet> {
        const response = await window.fetch(url);
        const json = await response.json() as SpritesheetData;

        json.meta.file = await Image.load(new URL(json.meta.image, new URL(url, window.location.href)).href);


        return new Spritesheet(json);
    }

    static override get defaultOptions (): SpriteOptions {
        return {
            ...super.defaultOptions,
            speed: 1,
            loop: true,
        };
    }

    static override get events () {
        return {
            ...super.events,
            /** Animation starts */
            start: "sprite-start",
            /** Animation goes to the next frame */
            frame: "sprite-frame",
            /** Animation reach its end (only when not looping) */
            end: "sprite-end",
        };
    }
}

/**
 * Loaded spritesheet, able to extract sprites
 */
export class Spritesheet {
    /** JSON description */
    json: SpritesheetData;

    /**
     * Spritesheet constructor
     * @param json - JSON description with loaded image
     */
    constructor (json: SpritesheetData) {
        this.json = json;
    }

    /**
     * Loaded image
     */
    get file (): HTMLImageElement | undefined {
        return this.json.meta.file;
    }

    /**
     * Return all frames matching a selector
     * @param selector - Glob pattern, regular expression or filter function
     */
    get (selector: FrameSelector = "*"): Array<FrameData> {
        const filter = toFilter(selector);
        const { frames } = this.json;
        return Object.keys(frames)
            .filter(filter)
            .map(key => frames[key]);
    }

    /**
     * Create a sprite with all frames matching a selector
     * @param position - Position of the sprite
     * @param selector - Glob pattern, regular expression or filter function
     * @param options - Sprite options
     */
    extract (position?: PositionDefinition, selector?: FrameSelector, options?: Partial<SpriteOptions>): Sprite {
        return new Sprite(position, this.file ?? null, this.get(selector), options);
    }
}

export default Sprite;
