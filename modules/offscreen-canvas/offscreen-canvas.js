/**
 * Off-screen canvas class
 * @class
 */
export default class OffScreenCanvas {
    /**
     * Off-screen canvas constructor
     * @param {Number} [width=1] - Width of the canvas
     * @param {Number} [height=1] - Height of the canvas
     */
    constructor (width = 1, height = 1) {
        this.ctx = window.document.createElement("canvas").getContext("2d");
        this.width = width;
        this.height = height;
    }

    /**
     * @return {Number}
     */
    get width () {
        return this.ctx.canvas.width;
    }

    /**
     * @param {Number} width - New width value
     */
    set width (width) {
        this.ctx.canvas.width = +width;
    }

    /**
     * @return {Number}
     */
    get height () {
        return this.ctx.canvas.height;
    }

    /**
     * @param {Number} height - New height value
     */
    set height (height) {
        this.ctx.canvas.height = +height;
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
     * @return {OffScreenCanvas} Itself
     */
    clear () {
        this.ctx.clearRect(0, 0, this.width, this.height);
        return this;
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
        return this.ctx.getImageData(0, 0, this.width, this.height);
    }

    /**
     *
     * @param {String} type -
     * @return {HTMLImageElement}
     */
    toImage (type = "image/png") {
        const img = window.document.createElement("img");
        img.width = this.width;
        img.height = this.height;
        img.src = this.ctx.canvas.toDataURL(type);
        return img;
    }
}
