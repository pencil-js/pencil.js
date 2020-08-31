import BaseEvent from "@pencil.js/base-event";
import Image from "@pencil.js/image";
import { modulo } from "@pencil.js/math";
import picomatch from "picomatch";

/**
 * Sprite class
 * @class
 * @extends Image
 */
export default class Sprite extends Image {
    /**
     * @typedef {Object} Frame
     * @prop {Number} x - Horizontal position
     * @prop {Number} y - Vertical position
     * @prop {Number} w - Width
     * @prop {Number} h - Height
     */
    /**
     * @typedef {Object} FrameData
     * @prop {Frame} frame - Data about this frame in the sprite-sheet
     * @prop {Frame} spriteSourceSize - Data about the original file
     */
    /**
     * Sprite constructor
     * @param {PositionDefinition} positionDefinition -
     * @param {String} url -
     * @param {Array<FrameData>} frames -
     * @param {SpriteOptions} options - Drawing options
     */
    constructor (positionDefinition, url, frames, options) {
        super(positionDefinition, url, options);
        this.frames = frames;
        this.frame = 0;
        this.isPaused = false;
    }

    /**
     * @inheritDoc
     * @return {Sprite} Itself
     */
    makePath (ctx) {
        const { sourceSize } = this.frames[Math.floor(this.frame)];
        this.width = sourceSize.w;
        this.height = sourceSize.h;

        super.makePath(ctx);

        if (this.isLoaded) {
            const frameNumber = Math.floor(this.frame);
            if (!this.isPaused && (this.options.loop || this.frame < this.frames.length - 1)) {
                this.setFrame(this.frame + this.options.speed);
            }

            const nextFrame = Math.floor(this.frame);
            if (nextFrame !== frameNumber) {
                this.fire(new BaseEvent(Sprite.events.frame, this));

                if (!this.options.loop && nextFrame === this.frames.length - 1) {
                    this.fire(new BaseEvent(Sprite.events.end, this));
                }
            }
        }

        return this;
    }

    /**
     * @inheritDoc
     * @return {Sprite} Itself
     */
    draw (ctx) {
        const { frame, spriteSourceSize } = this.frames[Math.floor(this.frame)];

        ctx.drawImage(
            this.file,
            frame.x, frame.y, frame.w, frame.h,
            spriteSourceSize.x, spriteSourceSize.y, spriteSourceSize.w, spriteSourceSize.h,
        );

        return this;
    }

    /**
     * Play the sprite animation
     * @param {Number} [speed] - Choose a play speed
     * @return {Sprite} Itself
     */
    play (speed) {
        this.isPaused = false;
        if (speed !== undefined) {
            this.options.speed = speed;
        }
        return this;
    }

    /**
     * Put the sprite on pause
     * @return {Sprite} Itself
     */
    pause () {
        this.isPaused = true;
        return this;
    }

    /**
     *
     * @param {Number} frame - Number of the frame to set
     * @return {Sprite} Itself
     */
    setFrame (frame) {
        this.frame = modulo(frame, this.frames.length);
        return this;
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const { frames, frame, isPaused } = this;
        return {
            ...super.toJSON(),
            frames,
            frame,
            isPaused,
        };
    }

    /**
     *
     * @param {Object} definition -
     * @return {Sprite}
     */
    static from (definition) {
        const { position, url, frames, frame, isPaused, options } = definition;
        const sprite = new Sprite(position, url, frames, options);
        sprite.setFrame(frame);
        if (isPaused) {
            sprite.pause();
        }
        return sprite;
    }

    /**
     * Load and return a spritesheet json file
     * @param {String} url - Url to the file
     * @return {Spritesheet}
     */
    static async sheet (url) {
        const response = await window.fetch(url);
        const json = await response.json();

        json.meta.file = await this.load(json.meta.image);

        // eslint-disable-next-line no-use-before-define
        return new Spritesheet(json);
    }

    /**
     * @typedef {Object} SpriteOptions
     * @extends ComponentOptions
     * @prop {Number} [speed=1] -
     * @prop {Boolean} [loop=true] -
     */
    /**
     * return {SpriteOptions}
     */
    static get defaultOptions () {
        return {
            ...super.defaultOptions,
            speed: 1,
            loop: true,
        };
    }

    /**
     * @typedef {Object} SpriteEvents
     * @extends ContainerEvent
     * @prop {String} start -
     * @prop {String} frame -
     * @prop {String} end -
     */
    /**
     * @return {SpriteEvents}
     */
    static get events () {
        return {
            ...super.events,
            start: "sprite-start",
            frame: "sprite-frame",
            end: "sprite-end",
        };
    }
}

/**
 * Spritesheet class
 * @class
 */
class Spritesheet {
    /**
     * Spritesheet constructor
     * @param {Object} json -
     */
    constructor (json) {
        this.json = json;
    }

    /**
     * Getter for the image file
     * @return {Image}
     */
    get file () {
        return this.json.meta.file;
    }

    /**
     * Return all the frames corresponding to a selector
     * @param {String|Function|RegExp} [selector="*"] - Match against the spritesheet images name using a glob pattern, a validation function or a regular expression
     * @return {Array}
     */
    get (selector = "*") {
        const filter = ((matcher) => {
            if (typeof matcher === "function") {
                return matcher;
            }
            if (typeof matcher === "string") {
                const glob = picomatch(matcher, {
                    contains: true,
                });
                return string => matcher === string || glob(string);
            }
            if (matcher instanceof RegExp) {
                return string => matcher.test(string);
            }
            return () => false;
        })(selector);

        const { frames } = this.json;
        return Object.keys(frames)
            .filter(filter)
            .map(key => frames[key]);
    }

    /**
     * Group images from the spritesheet into a single sprite
     * @param {PositionDefinition} position - Position of the sprite
     * @param {String|Function|RegExp} [selector="*"] - Match against the spritesheet images name using a glob pattern, a validation function or a regular expression
     * @param {ImageOptions} [options] - Options of the sprite
     * @return {Sprite}
     */
    extract (position, selector, options) {
        return new Sprite(position, this.file, this.get(selector), options);
    }
}
