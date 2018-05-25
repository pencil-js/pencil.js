/**
 * Off-screen canvas class
 * @class
 */
export default class OffScreenCanvas {
    /**
     * Off-screen canvas constructor
     * @param {Number} width - Width of the canvas
     * @param {Number} height - Height of the canvas
     */
    constructor (width, height) {
        this.canvas = document.createElement("canvas");
        this.setSize(width, height);

        this.ctx = this.canvas.getContext("2d");
    }

    /**
     *
     * @param {Number} width - New width for the canvas
     * @param {Number} height - New height for the canvas
     */
    setSize (width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    /**
     * Render a container and its children into the canvas
     * @param {Container} container - Any container
     * @return {OffScreenCanvas} Itself
     */
    render (container) {
        this.clear();
        container.render(this.ctx);
        return this;
    }

    /**
     * Erase the canvas
     */
    clear () {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    /**
     * Put data into the canvas
     * @param {ImageData} imageData - Data to add to the canvas
     */
    set imageData (imageData) {
        this.ctx.putImageData(imageData, 0, 0);
    }

    /**
     * Return the whole canvas as data
     * @return {ImageData}
     */
    get imageData () {
        return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     *
     * @param {String} type -
     * @return {HTMLImageElement}
     */
    toImg (type = "image/png") {
        const img = document.createElement("img");
        img.src = this.canvas.toDataURL(type);
        return img;
    }
}
