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
     * @param {String} [url] - Link to an image file
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (position, url = null, options) {
        super(position, 0, 0, options);

        this.file = null;
        /**
         * @type {String}
         * @private
         */
        this._url = null;
        this.url = url;
    }

    /**
     * Tell if the image is loaded
     * @return {Boolean}
     */
    isLoaded () {
        return this.file !== null;
    }

    /**
     * Change the image URL
     * @param {String} url - Link to an image file
     */
    set url (url) {
        this.file = null;
        if (url) {
            this._url = url;
            Image.load(url).then((img) => {
                this.file = img;
                this.restoreSize();
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
        if (this.isLoaded()) {
            super.trace(ctx);
            ctx.drawImage(this.file, 0, 0, truncate(this.width), truncate(this.height));
        }
        return this;
    }

    /**
     * Use image width and height for drawing width and height
     */
    restoreSize () {
        if (this.isLoaded()) {
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

        return fetch(url)
        .then(response => response.ok ? response.blob() : Promise.reject(new URIError(`Fail to load ${url}.`)))
        .then((blob) => {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(blob);
            return img;
        });
    }
}
