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
     * @param {PositionDefinition} position - Center of arc
     * @param {Number} radius - Distance from center to outer edge
     * @param {Number} [startAngle=0] - Angle to start from (0 is top, 0.5 is bottom and 1 is full circle back to top)
     * @param {Number} [endAngle=0.5] - Angle to end to (from startAngle and in clockwise rotation)
     * @param {LineOptions} [options] - Drawing options
     */
    constructor (position, radius, startAngle = 0, endAngle = 0.5, options) {
        super(position, options);
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }

    /**
     * Draw the arc
     * @param {path} path - Drawing context
     * @return {Arc} Itself
     */
    trace (path) {
        path.lineCap = this.options.cap;
        const correction = -0.25;
        const startAngle = (this.startAngle + correction) * radianCircle;
        const endAngle = (this.endAngle + correction) * radianCircle;
        path.arc(0, 0, this.radius, startAngle, endAngle);
        return this;
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        return Object.assign(super.toJSON(), {
            radius: this.radius,
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
            definition.position, definition.radius,
            definition.startAngle, definition.endAngle,
            definition.options,
        );
    }

    /**
     * @return {LineOptions}
     */
    static get defaultOptions () {
        const options = Line.defaultOptions;
        delete options.join;
        return options;
    }

    /**
     * @return {LineCaps}
     */
    static get caps () {
        return Line.caps;
    }
}
