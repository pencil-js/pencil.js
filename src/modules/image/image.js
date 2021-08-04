import Rectangle from "@pencil.js/rectangle";
import NetworkEvent from "@pencil.js/network-event";

/**
 * @module Image
 */

const urlKey = Symbol("_url");

/**
 * Image class
 * <br><img src="./media/examples/image.png" alt="image demo"/>
 * @class
 * @extends Rectangle
 */
export default class Image extends Rectangle {
    /**
     * Image constructor
     * @param {PositionDefinition} positionDefinition - Top-left corner of the image
     * @param {String|Image|HTMLImageElement} source - Link to an image file, another Image instance or the image file itself
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (positionDefinition, source, options) {
        super(positionDefinition, undefined, undefined, options);

        /**
         * @type {HTMLImageElement}
         */
        this.file = null;
        /**
         * @type {Boolean}
         */
        this.isLoaded = false;
        /**
         * @type {String}
         * @private
         */
        this[urlKey] = null;
        this.url = source;
    }

    /**
     * Change the image URL
     * @param {String|Image|HTMLImageElement} source - Link to an image file, another Image instance or the image file itself
     */
    set url (source) {
        if (this.url === source) {
            return;
        }

        this.file = null;
        this.isLoaded = false;
        this[urlKey] = source;
        if (source) {
            const done = (img) => {
                this[urlKey] = img.src;
                this.file = img;
                this.isLoaded = true;
                this.width = img.width;
                this.height = img.height;
                this.fire(new NetworkEvent(NetworkEvent.events.ready, this));
            };
            if (source instanceof window.HTMLImageElement) {
                done(source);
            }
            else if (source instanceof Image) {
                if (source.isLoaded) {
                    done(source.file);
                }
                else {
                    source.on(NetworkEvent.events.ready, () => done(source.file));
                }
            }
            else {
                Image.load(source).then(done).catch(() => {
                    this.fire(new NetworkEvent(NetworkEvent.events.error, this));
                });
            }
        }
    }

    /**
     * Get the image URL
     * @return {String}
     */
    get url () {
        return this[urlKey];
    }

    /**
     * Draw it on a context
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Image} Itself
     */
    makePath (ctx) {
        if (this.isLoaded) {
            ctx.save();

            const origin = this.getOrigin();
            ctx.translate(origin.x, origin.y);

            const path = new window.Path2D();
            this.trace(path);
            this.path = path;

            if (this.willFill) {
                ctx.fill(path);
                ctx.shadowBlur = 0;
            }

            if (this.willStroke) {
                ctx.stroke(path);
            }

            this.draw(ctx);

            ctx.restore();
        }

        return this;
    }

    /**
     * Draw the image itself
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Image} Itself
     */
    draw (ctx) {
        ctx.drawImage(this.file, 0, 0, this.width, this.height);
        return this;
    }

    /**
     * @inheritDoc
     */
    isHover (...args) {
        if (!this.isLoaded) {
            return false;
        }

        const previous = this.options.fill;
        this.options.fill = true;
        const result = super.isHover(...args);
        this.options.fill = previous;

        return result;
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const json = super.toJSON();
        delete json.width;
        delete json.height;
        const { url } = this;
        return {
            ...json,
            url,
        };
    }

    /**
     * @inheritDoc
     * @param {Object} definition - Image definition
     * @return {Image}
     */
    static from (definition) {
        return new Image(definition.position, definition.url, definition.options);
    }

    /**
     * Promise to load an image file.
     * @param {String|Array<String>} url - Link or an array of links to image files
     * @return {Promise<HTMLImageElement>}
     */
    static load (url) {
        if (Array.isArray(url)) {
            return Promise.all(url.map(singleUrl => Image.load(singleUrl)));
        }

        return new Promise((resolve, reject) => {
            const img = window.document.createElement("img");
            img.crossOrigin = "Anonymous";
            img.src = url;
            img.addEventListener("load", () => resolve(img));
            img.addEventListener("error", () => reject(new URIError(`Fail to load ${url}.`)));
        });
    }

    /**
     * @typedef {Object} ImageOptions
     * @extends ComponentOptions
     * @prop {String|ColorDefinition} [fill=null] - Color used as background
     * @prop {String} [description=""] - Description of the image (can be used to for better accessibility)
     */
    /**
     * @type {ImageOptions}
     */
    static get defaultOptions () {
        return {
            ...super.defaultOptions,
            fill: null,
            description: "",
        };
    }
}
