import Rectangle from "@pencil.js/rectangle";
import BaseEvent from "@pencil.js/base-event";

/**
 * Image class
 * @class
 * @extends Rectangle
 */
export default class Image extends Rectangle {
    /**
     * Image constructor
     * @param {PositionDefinition} positionDefinition - Top-left corner of the image
     * @param {String} url - Link to an image file
     * @param {Number} [width] - Width to draw the image, or width and height if height omitted
     * @param {Number} [height] - Height to draw the image, use file height and width if both omitted
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (positionDefinition, url, width = null, height = null, options) {
        super(positionDefinition, width, height, options);

        /**
         * @type {HTMLImageElement}
         */
        this.file = null;
        /**
         * @type {Boolean}
         */
        this.isLoaded = false;
        /**
         * @type {Number}
         */
        this.ratio = 0;
        /**
         * @type {String}
         * @private
         */
        this._url = null;
        this.url = url;
    }

    /**
     * Change the image URL
     * @param {String} url - Link to an image file
     */
    set url (url) {
        this.file = null;
        this.isLoaded = false;
        if (url) {
            this._url = url;
            Image.load(url).then((img) => {
                this.file = img;
                this.isLoaded = true;
                this.ratio = img.width / img.height;
                if (this.width === null && this.height === null) {
                    this.restoreSize();
                }
                else if (this.width === null) {
                    this.width = this.height * this.ratio;
                }
                else if (this.height === null) {
                    this.height = this.width / this.ratio;
                }
                this.fire(new BaseEvent(this, "load"));
            }).catch(() => {
                this.fire(new BaseEvent(this, "error"));
            });
        }
    }

    /**
     * Get the image URL
     * @return {String}
     */
    get url () {
        return this._url;
    }

    /**
     * Draw the image
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Image} Itself
     */
    trace (ctx) {
        if (this.isLoaded) {
            super.trace(ctx);
        }

        return this;
    }

    /**
     * Draw it on a context
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Image} Itself
     */
    render (ctx) {
        super.render(ctx);
        if (this.isLoaded) {
            const originPos = this.getOriginPosition();
            ctx.drawImage(
                this.file,
                this.position.x - originPos.x,
                this.position.y - originPos.y,
                this.width,
                this.height,
            );
        }

        return this;
    }

    /**
     * Use image width and height for drawing width and height
     */
    restoreSize () {
        if (this.isLoaded) {
            this.width = this.file.width;
            this.height = this.file.height;
        }
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        return Object.assign(super.toJSON(), {
            url: this.url,
        });
    }

    /**
     * @inheritDoc
     * @param {Object} definition - Image definition
     * @return {Image}
     */
    static from (definition) {
        return new Image(definition.position, definition.url, definition.width, definition.height, definition.options);
    }

    /**
     * Promise to load an image file.
     * @param {String|Array<String>} url - Link or an array of links to image files
     * @return {Promise}
     */
    static load (url) {
        if (Array.isArray(url)) {
            return Promise.all(url.map(singleUrl => Image.load(singleUrl)));
        }

        return new Promise((resolve, reject) => {
            const img = document.createElement("img");
            img.crossOrigin = "Anonymous";
            img.src = url;
            img.addEventListener("load", () => resolve(img));
            img.addEventListener("error", () => reject(new URIError(`Fail to load ${url}.`)));
        });
    }

    /**
     * @return {RectangleOptions}
     */
    static get defaultOptions () {
        return Object.assign(super.defaultOptions, {
            fill: null,
        });
    }
}
