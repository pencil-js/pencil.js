import Component from "@pencil.js/component";

/**
 * @module Heart
 */

/**
 * Heart class
 * <br><img src="./media/examples/heart.png" alt="heart demo"/>
 * @class
 * @extends {module:Component}
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

        /**
         * @type {Number}
         */
        this.radius = radius;
    }

    /**
     * Draw the Heart
     * @param {Path2D} path - Drawing context
     * @return {Heart} Itself
     */
    trace (path) {
        path.moveTo(0, -0.4 * this.radius);
        const curves = [
            [-0.4, -0.9, -1, -0.6, -1, 0],
            [-1, 0.4, -0.6, 0.6, 0, 1],
            [0.6, 0.6, 1, 0.4, 1, 0],
            [1, -0.6, 0.4, -0.9, 0, -0.4],
        ];
        curves.concat(curves.slice(0, 1)).forEach(points => path.bezierCurveTo(...points.map(x => x * this.radius)));

        return this;
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
     * @inheritDoc
     * @param {Object} definition - Heart definition
     * @return {Heart}
     */
    static from (definition) {
        return new Heart(definition.position, definition.radius, definition.options);
    }
}
