import Container from "@pencil.js/container";
import Position from "@pencil.js/position";
import Vector from "@pencil.js/vector";
import { random } from "@pencil.js/math";

/**
 * @module OffscreenCanvas
 */

/**
 * Off-screen canvas class
 * @class
 */
export default class OffScreenCanvas extends Container {
    /**
     * Off-screen canvas constructor
     * @param {Number} [width=1] - Width of the canvas
     * @param {Number} [height=1] - Height of the canvas
     * @param {ContainerOptions} [options] - Specific options
     */
    constructor (width = 1, height = 1, options) {
        super(undefined, options);
        /**
         * @type {CanvasRenderingContext2D}
         */
        this.ctx = this.constructor.getDrawingContext(width, height);
    }

    /**
     * Change the behavior for upscaled images, smoothing is good for pictures but bad for pixel-art
     * @param {Boolean} enable - Should the smoothing be active or not
     * @return {OffScreenCanvas} Itself
     */
    setImageSmoothing (enable) {
        this.ctx.imageSmoothingEnabled = enable;
        return this;
    }

    /**
     * Erase the canvas
     * @return {OffScreenCanvas} Itself
     */
    clear () {
        this.ctx.clearRect(0, 0, this.width, this.height);

        if (this.options.fill) {
            OffScreenCanvas.setOpacity(this.ctx, this.options.opacity);
            const { width, height } = this;
            this.ctx.fillStyle = this.options.fill.toString(this.ctx);
            this.ctx.fillRect(0, 0, width, height);
        }
        return this;
    }

    /**
     * Render a container and its children into the canvas
     * @return {OffScreenCanvas} Itself
     */
    render () {
        this.clear();
        super.render(this.ctx);

        return this;
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
     * Return the whole scene size
     * @return {Position}
     */
    get size () {
        return new Position(this.width, this.height);
    }

    /**
     * Return this scene center point
     * @return {Position}
     */
    get center () {
        return this.size.divide(2);
    }

    /**
     * Return a random position within the scene
     * @return {Position}
     */
    getRandomPosition () {
        return new Position(random(this.width), random(this.height));
    }

    /**
     * Return the whole canvas as data
     * @param {VectorDefinition} [vectorDefinition] - Box of data to extract
     * @return {ImageData}
     */
    getImageData (vectorDefinition) {
        let vector;
        if (vectorDefinition) {
            vector = Vector.from(vectorDefinition);
        }
        else {
            vector = new Vector(undefined, this.size);
        }

        this.render();
        return this.ctx.getImageData(vector.start.x, vector.start.y, vector.end.x, vector.end.y);
    }

    /**
     * Put data into the canvas
     * @param {ImageData} imageData - Data to add to the canvas
     * @param {PositionDefinition} [positionDefinition] - Position of the data
     */
    setImageData (imageData, positionDefinition) {
        const position = Position.from(positionDefinition);
        this.ctx.putImageData(imageData, position.x, position.y);
    }

    /**
     * Return an image composed of its content
     * @param {VectorDefinition} [vectorDefinition] - Box to restrict exported data
     * @param {String} [type="image/png"] - Data format. Supported format depend on the browser implementation (png or jpeg are the only safe choices)
     * @return {HTMLImageElement}
     */
    toImage (vectorDefinition, type = "image/png") {
        let vector;
        if (vectorDefinition) {
            vector = Vector.from(vectorDefinition);
        }
        else {
            vector = new Vector(undefined, [this.width, this.height]);
        }

        const img = window.document.createElement("img");

        const { width, height } = this;
        const size = vector.getDelta();
        this.width = size.x;
        this.height = size.y;
        img.width = this.width;
        img.height = this.height;
        this.ctx.translate(-vector.start.x, -vector.start.y);
        this.render();
        img.src = this.ctx.canvas.toDataURL(type);

        this.width = width;
        this.height = height;

        return img;
    }

    /**
     * Build a canvas context and returns it
     * @param {Number} width - Width of the canvas
     * @param {Number} height - Height of the canvas
     * @return {CanvasRenderingContext2D}
     */
    static getDrawingContext (width = 1, height = 1) {
        const canvas = window.document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        return canvas.getContext("2d");
    }

    /**
     * @typedef {Object} OffscreenCanvasOptions
     * @prop {String|Color} [fill=null] - Background color
     * @prop {Number} [opacity=1] - Global opacity
     */
    /**
     * @type {OffscreenCanvasOptions}
     */
    static get defaultOptions () {
        return {
            ...super.defaultOptions,
            fill: null,
            opacity: 1,
        };
    }
}
