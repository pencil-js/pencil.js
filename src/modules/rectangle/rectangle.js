import Component from "@pencil.js/component";
import Position from "@pencil.js/position";

/**
 * @module Rectangle
 */

/**
 * Basic rectangle
 * <br><img src="./media/examples/rectangle.png" alt="rectangle demo"/>
 * @class
 * @extends {module:Component}
 */
export default class Rectangle extends Component {
    /**
     * Rectangle constructor
     * @param {PositionDefinition} positionDefinition - Position in space
     * @param {Number} [width=0] - Horizontal size
     * @param {Number} [height=0] - Vertical size
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (positionDefinition, width = 0, height = 0, options) {
        super(positionDefinition, options);

        /**
         * @type {Number}
         */
        this.width = width;
        /**
         * @type {Number}
         */
        this.height = height;
    }

    /**
     * Draw the rectangle
     * @param {path} path - Drawing context
     * @return {Rectangle} Itself
     */
    trace (path) {
        const { rounded } = this.options;
        if (rounded) {
            path.roundRect(0, 0, this.width, this.height, ...(Array.isArray(rounded) ? rounded : [rounded]));
        }
        else {
            path.rect(0, 0, this.width, this.height);
        }
        return this;
    }

    /**
     * @inheritDoc
     */
    getOrigin () {
        const { origin } = this.options;
        if (typeof origin === "string") {
            const { origins } = Rectangle;
            const position = new Position();
            // Horizontal
            if ([origins.topRight, origins.centerRight, origins.bottomRight].includes(origin)) {
                position.x = -this.width;
            }
            else if ([origins.topCenter, origins.center, origins.bottomCenter].includes(origin)) {
                position.x = -this.width / 2;
            }
            // Vertical
            if ([origins.bottomLeft, origins.bottomCenter, origins.bottomRight].includes(origin)) {
                position.y = -this.height;
            }
            else if ([origins.centerLeft, origins.center, origins.centerRight].includes(origin)) {
                position.y = -this.height / 2;
            }
            return position;
        }

        return super.getOrigin();
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const { width, height } = this;
        return {
            ...super.toJSON(),
            width,
            height,
        };
    }

    /**
     * @inheritDoc
     * @param {Object} definition - Rectangle definition
     * @return {Rectangle}
     */
    static from (definition) {
        return new Rectangle(definition.position, definition.width, definition.height, definition.options);
    }

    /**
     * @typedef {Object} RectangleOptions
     * @extends ComponentOptions
     * @prop {Number|Array<Number>} rounded - Corner radius or an array of radii [top-left, top-right, bottom-right, bottom-left]
     */
    /**
     * @type {RectangleOptions}
     */
    static get defaultOptions () {
        return {
            ...super.defaultOptions,
            rounded: 0,
        };
    }

    /**
     * @typedef {Object} RectangleOrigins
     * @prop {String} topLeft
     * @prop {String} topRight
     * @prop {String} topCenter
     * @prop {String} center
     * @prop {String} centerLeft
     * @prop {String} centerRight
     * @prop {String} bottomLeft
     * @prop {String} bottomRight
     * @prop {String} bottomCenter
     */
    /**
     * @type {RectangleOrigins}
     */
    static get origins () {
        return {
            topLeft: "topLeft",
            topRight: "topRight",
            topCenter: "topCenter",
            center: "center",
            centerLeft: "centerLeft",
            centerRight: "centerRight",
            bottomLeft: "bottomLeft",
            bottomRight: "bottomRight",
            bottomCenter: "bottomCenter",
        };
    }
}
