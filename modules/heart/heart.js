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

        if (radius > 0) {
            this.radius = radius;
        }
        else {
            this.radius = 0;
        }
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const json = super.toJSON();
        delete json.radius;
        return json;
    }

    /**
     * Draw the arc
     * @param {Path2D} path - Drawing context
     * @return {Heart} Itself
     */
    trace (path) {
        path.moveTo(75 * this.radius, 40 * this.radius);
        path.bezierCurveTo(75 * this.radius, 37 * this.radius, 70 * this.radius, 25 * this.radius,
            50 * this.radius, 25 * this.radius);
        path.bezierCurveTo(20 * this.radius, 25 * this.radius, 20 * this.radius, 62.5 * this.radius,
            20 * this.radius, 62.5 * this.radius);
        path.bezierCurveTo(20 * this.radius, 80 * this.radius, 40 * this.radius, 102 * this.radius,
            75 * this.radius, 120 * this.radius);
        path.bezierCurveTo(110 * this.radius, 102 * this.radius, 130 * this.radius, 80 * this.radius,
            130 * this.radius, 62.5 * this.radius);
        path.bezierCurveTo(130 * this.radius, 62.5 * this.radius, 130 * this.radius, 25 * this.radius,
            100 * this.radius, 25 * this.radius);
        path.bezierCurveTo(85 * this.radius, 25 * this.radius, 75 * this.radius, 37 * this.radius,
            75 * this.radius, 40 * this.radius);

        return this;
    }

    /**
     * @return {ComponentOptions}
     */
    static get defaultOptions () {
        return Component.defaultOptions;
    }
}
