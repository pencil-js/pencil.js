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
     * @param {ComponentOptions} [options] - Drawing options
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
            const position = new Position();
            if (origin === Rectangle.origins.center) {
                position.set(this.width / 2, this.height / 2);
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
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        return Object.assign(super.toJSON(), {
            width: this.width,
            height: this.height,
        });
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
     * @enum {String}
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
