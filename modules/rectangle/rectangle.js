import Component from "@pencil.js/component";
import Position from "@pencil.js/position";

/**
 * Basic rectangle
 * @class
 * @extends Component
 */
export default class Rectangle extends Component {
    /**
     * Rectangle constructor
     * @param {PositionDefinition} positionDefinition - Position in space
     * @param {Number} [width=0] - Horizontal size
     * @param {Number} [height=0] - Vertical size
     * @param {RectangleOptions} [options] - Drawing options
     */
    constructor (positionDefinition, width = 0, height = 0, options) {
        super(positionDefinition, options);
        this.width = width;
        this.height = height;
    }

    /**
     * Draw the rectangle
     * @param {path} path - Drawing context
     * @return {Rectangle} Itself
     */
    trace (path) {
        const originPos = this.getOriginPosition();
        path.rect(-originPos.x, -originPos.y, this.width, this.height);
        return this;
    }

    /**
     * Get this origin position relative to the top-left corner
     * @return {Position}
     */
    getOriginPosition () {
        try {
            return Position.from(this.options.origin);
        }
        catch (e) {
            const { origin } = this.options;
            const { origins } = Rectangle;
            const position = new Position();
            if (origin === origins.center) {
                position.set(this.width / 2, this.height / 2);
            }
            else {
                position.set(
                    [origins.topRight, origins.bottomRight].includes(origin) && this.width,
                    [origins.bottomLeft, origins.bottomRight].includes(origin) && this.height,
                );
            }
            return position;
        }
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
     * @prop {String|PositionDefinition} [origin=Rectangle.origins.topLeft] - Origin of the rectangle's position
     */
    /**
     * @return {RectangleOptions}
     */
    static get defaultOptions () {
        return {
            ...super.defaultOptions,
            origin: Rectangle.origins.topLeft,
        };
    }

    /**
     * @typedef {Object} RectangleOrigins
     * @enum {String}
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
