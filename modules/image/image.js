import { truncate } from "@pencil.js/math";
import Rectangle from "@pencil.js/rectangle";
import BaseEvent from "@pencil.js/baseevent";

/**
 * Image class
 * @class
 * @extends Rectangle
 */
export default class Image extends Rectangle {
    /**
     * Image constructor
     * @param {Position} position - Top-left corner of the image
     * @param {String} url - Link to the image file
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (position, url, options) {
        super(position, 0, 0, options);
        this.url = url;
        this.file = null;
        Image.load(url).then((img) => {
            this.file = img;
            this.restoreSize();
            this.fire(new BaseEvent(this, "load"));
        });
    }

    /**
     * Tell if the image is loaded
     * @return {Boolean}
     */
    isLoaded () {
        return this.file !== null;
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
            return Promise.all(url.map(u => Image.load(u)));
        }

        return fetch(url);
    }
}
