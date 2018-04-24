import Component from "@pencil.js/component";
import Position from "@pencil.js/position";
import { truncate } from "@pencil.js/math";

/**
 * Basic rectangle
 * @class
 * @extends Component
 */
export default class Rectangle extends Component {
    /**
     * Rectangle constructor
     * @param {Position} position - Position in space
     * @param {Number} [width=0] - Horizontal size
     * @param {Number} [height=0] - Vertical size
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (position, width = 0, height = 0, options) {
        super(position, options);
        this.width = width;
        this.height = height;
    }

    /**
     * Draw the rectangle
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Rectangle} Itself
     */
    trace (ctx) {
        const originPos = this.getOriginPosition();
        ctx.rect(truncate(-originPos.x), truncate(-originPos.y), truncate(this.width), truncate(this.height));
        return this;
    }

    /**
     * Get this origin position relative to the top-left corner
     * @return {Position}
     */
    getOriginPosition () {
        const { origin } = this.options;

        if (origin instanceof Position) {
            return origin;
        }

        const position = new Position();
        if (origin === Rectangle.origins.center) {
            position.x = this.width / 2;
            position.y = this.height / 2;
        }
        else {
            if (origin === Rectangle.origins.topRight || origin === Rectangle.origins.bottomRight) {
                position.x = this.width;
            }
            if (origin === Rectangle.origins.bottomLeft || origin === Rectangle.origins.bottomRight) {
                position.y = this.height;
            }
        }
        return position;
    }

    /**
     * @inheritDoc
     */
    isHover (position) {
        const originPos = this.getOriginPosition();
        const x = truncate(this.position.x - originPos.x);
        const y = truncate(this.position.y - originPos.y);
        const width = truncate(this.width);
        const height = truncate(this.height);
        return super.isHover(position) &&
            x <= position.x && position.x <= x + width &&
            y <= position.y && position.y <= y + height;
    }

    /**
     * @typedef {Object} RectangleOptions
     * @extends ComponentOptions
     * @prop {String} [origin=Rectangle.origins.topLeft] - Origin of the rectangle's position
     */
    /**
     * @return {RectangleOptions}
     */
    static get defaultOptions () {
        return Object.assign({
            origin: Rectangle.origins.topLeft,
        }, super.defaultOptions);
    }

    /**
     * @typedef {Object} RectangleOrigins
     * @prop {String} topLeft
     * @prop {String} topRight
     * @prop {String} bottomLeft
     * @prop {String} bottomRight
     * @prop {String} center
     */
    /**
     * @return {RectangleOrigins}
     */
    static get origins () {
        return {
            topLeft: "topLeft",
            topRight: "topRight",
            center: "center",
            bottomLeft: "bottomLeft",
            bottomRight: "bottomRight",
        };
    }
}
