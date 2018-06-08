import RegularPolygon from "@pencil.js/regular-polygon";

/**
 * Star class
 * @class
 * @extends RegularPolygon
 */
export default class Star extends RegularPolygon {
    /**
     * Star constructor
     * @param {PositionDefinition} positionDefinition - Center of the star
     * @param {Number} outerRadius - Distance of branches from center
     * @param {Number} [nbBranches=5] - Number of branches to create (can't be less than 2)
     * @param {Number} [bevelRatio=0.5] - Ratio between branches length and bevel between them
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (positionDefinition, outerRadius, nbBranches = 5, bevelRatio = 0.5, options) {
        super(positionDefinition, nbBranches, outerRadius, options);

        const innerRadius = this.radius * bevelRatio;
        const innerPoints = RegularPolygon.getRotatingPoint(nbBranches, innerRadius, 0.5 / nbBranches);
        innerPoints.forEach((point, index) => this.points.splice((index * 2) + 1, 0, point));

        this.bevelRatio = bevelRatio;
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const json = Object.assign(super.toJSON(), {
            nbBranches: this.points.length / 2,
            bevelRatio: this.bevelRatio,
        });
        delete json.nbSides;
        return json;
    }

    /**
     * @inheritDoc
     * @param {Object} definition - Star definition
     * @return {Star}
     */
    static from (definition) {
        return new Star(
            definition.position,
            definition.radius, definition.nbBranches, definition.bevelRatio,
            definition.options,
        );
    }
}
