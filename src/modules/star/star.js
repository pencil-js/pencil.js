import RegularPolygon from "@pencil.js/regular-polygon";

const bevelRatioKey = Symbol("_bevelKey");

/**
 * @module Star
 */

/**
 * Star class
 * @class
 * @extends RegularPolygon
 */
export default class Star extends RegularPolygon {
    /**
     * Star constructor
     * @param {PositionDefinition} positionDefinition - Center of the star
     * @param {Number} [nbBranches=5] - Number of branches to create (can't be less than 2)
     * @param {Number} outerRadius - Distance of branches from center
     * @param {Number} [bevelRatio=0.5] - Ratio between branches length and bevel between them
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (positionDefinition, nbBranches = 5, outerRadius, bevelRatio = 0.5, options) {
        super(positionDefinition, nbBranches * 2, outerRadius, options);

        this[bevelRatioKey] = bevelRatio;
        this.radius = outerRadius;
    }

    /**
     * Get the number of branches
     * @return {Number}
     */
    get nbBranches () {
        return this.points.length / 2;
    }

    /**
     * Change the number of branches
     * @param {Number} nbBranches - New number of branches
     */
    set nbBranches (nbBranches) {
        this.points = RegularPolygon.getRotatingPoints(nbBranches * 2, this.radius);
        this.rebuild();
    }

    /**
     * Get the outer radius
     * @return {Number}
     */
    get radius () {
        return super.radius;
    }

    /**
     * Change the outer radius
     * @param {Number} radius - New radius value
     */
    set radius (radius) {
        super.radius = radius;
        this.rebuild();
    }

    /**
     * Get the bevel ratio
     * @return {Number}
     */
    get bevelRatio () {
        return this[bevelRatioKey];
    }

    /**
     * Change the bevel ratio
     * @param {Number} bevelRatio - New bevel ratio value
     */
    set bevelRatio (bevelRatio) {
        this[bevelRatioKey] = bevelRatio;
        this.rebuild();
    }

    /**
     * Compute the position for the points from the internal properties
     */
    rebuild () {
        const innerRadius = this.radius * this.bevelRatio;
        const innerPoints = RegularPolygon.getRotatingPoints(this.nbBranches, innerRadius, 0.5 / this.nbBranches);
        this.points.forEach((point, index) => {
            if (index % 2) {
                point.set(innerPoints[(index - 1) / 2]);
            }
        });
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const { bevelRatio } = this;
        const json = {
            ...super.toJSON(),
            bevelRatio,
        };
        json.nbBranches = json.nbSides / 2;
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
            definition.nbBranches, definition.radius, definition.bevelRatio,
            definition.options,
        );
    }
}
