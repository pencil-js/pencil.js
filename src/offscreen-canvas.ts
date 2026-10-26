import Container, { type ContainerJSON, type ContainerOptions } from "./container.js";
import Position, { type PositionDefinition } from "./position.js";
import Vector, { type VectorDefinition } from "./vector.js";
import { random } from "./math.js";
import { createContext, toStyle } from "./internal/canvas.js";
import type { Style } from "./component.js";

/**
 * Off-screen canvas options
 */
export interface OffScreenCanvasOptions extends ContainerOptions {
    /** Background color */
    fill: Style;
}

/**
 * Canvas not displayed on screen, useful to pre-render or export
 * @module OffScreenCanvas
 */
export default class OffScreenCanvas<O extends OffScreenCanvasOptions = OffScreenCanvasOptions> extends Container<O> {
    static override get className (): string {
        return "OffScreenCanvas";
    }

    /** Drawing context */
    ctx: CanvasRenderingContext2D;

    /**
     * Off-screen canvas constructor
     * @param width - Width of the canvas
     * @param height - Height of the canvas
     * @param options - Specific options
     */
    constructor (width = 1, height = 1, options?: Partial<O>) {
        super(undefined, options);
        this.ctx = createContext(width, height);
    }

    /**
     * Change the behavior for upscaled images, smoothing is good for pictures but bad for pixel-art
     * @param enable - Should the smoothing be active or not
     * @returns Itself
     */
    setImageSmoothing (enable: boolean): this {
        this.ctx.imageSmoothingEnabled = enable;
        return this;
    }

    /**
     * Erase the canvas
     * @returns Itself
     */
    clear (): this {
        const { ctx, width, height } = this;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, width, height);

        const { fill, opacity } = this.options;
        if (fill) {
            ctx.globalAlpha = opacity ?? 1;
            ctx.fillStyle = toStyle(fill, ctx);
            ctx.fillRect(0, 0, width, height);
        }
        ctx.restore();
        return this;
    }

    /**
     * Render a container and its children into the canvas
     * @param ctx - Drawing context (default to its own)
     * @returns Itself
     */
    override render (ctx: CanvasRenderingContext2D = this.ctx): this {
        if (ctx === this.ctx) {
            this.clear();
        }
        super.render(ctx);

        return this;
    }

    /**
     * Width of the canvas
     */
    get width (): number {
        return this.ctx.canvas.width;
    }

    set width (width: number) {
        this.ctx.canvas.width = +width;
    }

    /**
     * Height of the canvas
     */
    get height (): number {
        return this.ctx.canvas.height;
    }

    set height (height: number) {
        this.ctx.canvas.height = +height;
    }

    /**
     * Return the whole canvas size
     */
    get size (): Position {
        return new Position(this.width, this.height);
    }

    /**
     * Return this canvas center point
     */
    get center (): Position {
        return this.size.divide(2);
    }

    /**
     * Return a random position within the canvas
     */
    getRandomPosition (): Position {
        return new Position(random(this.width), random(this.height));
    }

    /**
     * Render and return the canvas content as data
     * @param vectorDefinition - Box of data to extract
     */
    getImageData (vectorDefinition?: VectorDefinition): ImageData {
        const vector = vectorDefinition ? Vector.from(vectorDefinition) : new Vector(undefined, this.size);
        const { x, y } = vector.start;
        const { x: width, y: height } = vector.getDelta();

        this.render();
        return this.ctx.getImageData(x, y, width, height);
    }

    /**
     * Put data into the canvas
     * @param imageData - Data to add to the canvas
     * @param positionDefinition - Position of the data
     * @returns Itself
     */
    setImageData (imageData: ImageData, positionDefinition?: PositionDefinition): this {
        const position = Position.from(positionDefinition);
        this.ctx.putImageData(imageData, position.x, position.y);
        return this;
    }

    /**
     * Return an image composed of its content
     * @param vectorDefinition - Box to restrict exported data
     * @param type - Data format. Supported format depend on the browser implementation (png or jpeg are the only safe choices)
     */
    toImage (vectorDefinition?: VectorDefinition, type = "image/png"): HTMLImageElement {
        const vector = vectorDefinition ? Vector.from(vectorDefinition) : new Vector(undefined, this.size);

        const img = window.document.createElement("img");

        const { width, height } = this;
        const size = vector.getDelta();
        this.width = size.x;
        this.height = size.y;
        img.width = size.x;
        img.height = size.y;
        this.ctx.translate(-vector.start.x, -vector.start.y);
        this.render();
        img.src = this.ctx.canvas.toDataURL(type);

        this.width = width;
        this.height = height;

        return img;
    }

    override toJSON () {
        const { width, height } = this;
        return {
            ...super.toJSON(),
            width,
            height,
        };
    }

    /**
     * Return an instance from a generic object
     * @param definition - OffScreenCanvas definition
     */
    static override from (definition: ContainerJSON): OffScreenCanvas {
        return new this(definition.width, definition.height, definition.options);
    }

    /**
     * Build a canvas context and returns it
     * @param width - Width of the canvas
     * @param height - Height of the canvas
     */
    static getDrawingContext (width: number | HTMLElement = 1, height = 1): CanvasRenderingContext2D {
        return createContext(Number(width) || 1, height);
    }

    /**
     * Default options for this class
     */
    static override get defaultOptions (): OffScreenCanvasOptions {
        return {
            ...super.defaultOptions,
            fill: null,
            opacity: 1,
        };
    }
}
