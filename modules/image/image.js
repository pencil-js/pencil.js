import { truncate } from "@pencil.js/math";
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
     * @param {Position} position - Top-left corner of the image
     * @param {String} url - Link to an image file
     * @param {Number} [width] - Width to draw the image, or width and height if height omitted
     * @param {Number} [height] - Height to draw the image, use file height and width if both omitted
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (position, url, width = null, height = null, options) {
        let realHeight = height;
        let realOptions = options;
        if (typeof width === "object") {
            realOptions = width;
        }
        else if (typeof realHeight === "object") {
            realOptions = height;
            realHeight = width;
        }
        super(position, width, realHeight, realOptions);

        this.file = null;
        this.isLoaded = false;
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
                if (this.width === null && this.height === null) {
                    this.restoreSize();
                }
                this.fire(new BaseEvent(this, "load"));
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
            ctx.drawImage(
                this.file,
                truncate(this.position.x),
                truncate(this.position.y),
                truncate(this.width),
                truncate(this.height),
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
            img.src = url;
            img.addEventListener("load", () => resolve(img));
            img.addEventListener("error", () => reject(new URIError(`Fail to load ${url}.`)));
        });
    }

    /**
     * @return {ComponentOptions}
     */
    static get defaultOptions () {
        return Object.assign({}, super.defaultOptions, {
            fill: null,
        });
    }
}
