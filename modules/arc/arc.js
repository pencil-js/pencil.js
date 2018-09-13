import Component from "@pencil.js/component";
import Line from "@pencil.js/line";
import { radianCircle } from "@pencil.js/math";

/**
 * Arc class
 * @class
 * @extends Component
 */
export default class Arc extends Component {
    /**
     * Arc constructor
     * @param {PositionDefinition} positionDefinition - Center of arc
     * @param {Number} [horizontalRadius=0] - Horizontal radius
     * @param {Number} [verticalRadius=0] - Vertical radius
     * @param {Number} [startAngle=0] - Angle to start from (0 is top, 0.5 is bottom and 1 is full circle back to top)
     * @param {Number} [endAngle=0.5] - Angle to end to (from startAngle and in clockwise rotation)
     * @param {LineOptions} [options] - Drawing options
     */
    constructor (positionDefinition, horizontalRadius = 0, verticalRadius = 0, startAngle = 0, endAngle = 0.5, options) {
        super(positionDefinition, options);
        this.horizontalRadius = horizontalRadius;
        this.verticalRadius = verticalRadius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }

    /**
     * Draw the arc
     * @param {Path2D} path - Drawing context
     * @return {Arc} Itself
     */
    trace (path) {
        const correction = -0.25;
        const startAngle = (this.startAngle + correction) * radianCircle;
        const endAngle = (this.endAngle + correction) * radianCircle;
        path.ellipse(0, 0, this.horizontalRadius, this.verticalRadius, 0, startAngle, endAngle);
        return this;
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        return Object.assign(super.toJSON(), {
            horizontalRadius: this.horizontalRadius,
            verticalRadius: this.verticalRadius,
            startAngle: this.startAngle,
            endAngle: this.endAngle,
        });
    }

    /**
     * @inheritDoc
     * @param {Object} definition - Arc definition
     * @return {Arc}
     */
    static from (definition) {
        return new Arc(
            definition.position,
            definition.horizontalRadius, definition.verticalRadius,
            definition.startAngle, definition.endAngle,
            definition.options,
        );
    }

    /**
     * @return {LineOptions}
     */
    static get defaultOptions () {
        return Object.assign(Line.defaultOptions, {
            join: null,
        });
    }

    /**
     * @return {LineCaps}
     */
    static get caps () {
        return Line.caps;
    }
}
