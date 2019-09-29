import Component from "@pencil.js/component";

/**
 * Heart class
 * @class
 * @extends Component
 */
export default class Heart extends Component {
    /**
     * Heart constructor
     * @param {PositionDefinition} positionDefinition - Position of the center of the heart
     * @param {Number} radius - radius The distance from center of heart
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (positionDefinition, radius, options) {
        super(positionDefinition, options);
        this.radius = radius;
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const { radius } = this;
        return {
            ...super.toJSON(),
            radius,
        };
    }

    /**
     * Draw the Heart
     * @param {Path2D} path - Drawing context
     * @return {Heart} Itself
     */
    trace (path) {
        path.bezierCurveTo(
            0,
            -0.3859 * this.radius,
            0,
            -0.7368 * this.radius,
            -0.4385 * this.radius,
            -0.7368 * this.radius,
        );
        path.bezierCurveTo(
            -0.9649 * this.radius,
            -0.7017 * this.radius,
            -0.9649 * this.radius,
            -0.1052 * this.radius,
            -0.9649 * this.radius,
            -0.1052 * this.radius,
        );
        path.bezierCurveTo(
            -0.9649 * this.radius,
            0.2631 * this.radius,
            -0.614 * this.radius,
            0.6491 * this.radius,
            0,
            this.radius,
        );
        path.bezierCurveTo(
            0.614 * this.radius,
            0.6491 * this.radius,
            0.9649 * this.radius,
            0.2631 * this.radius,
            0.9649 * this.radius,
            -0.1052 * this.radius,
        );
        path.bezierCurveTo(
            0.9649 * this.radius,
            -0.1052 * this.radius,
            0.9649 * this.radius,
            -0.7368 * this.radius,
            0.4385 * this.radius,
            -0.7368 * this.radius,
        );
        path.bezierCurveTo(
            0.4385 * this.radius,
            -0.7368 * this.radius,
            0,
            -0.7368 * this.radius,
            -0.01754 * this.radius,
            -0.3859 * this.radius,
        );

        return this;
    }

    /**
     * @inheritDoc
     * @param {Object} definition - Heart definition
     * @return {Heart}
     */
    static from (definition) {
        return new Heart(definition.position, definition.radius, definition.options);
    }
}
