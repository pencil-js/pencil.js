import RegularPolygon from "@pencil.js/regular-polygon";

/**
 * Star class
 * @class
 * @extends RegularPolygon
 */
export default class Star extends RegularPolygon {
    /**
     * Star constructor
     * @param {Position} position - Center of the star
     * @param {Number} outerRadius - Distance of branches from center
     * @param {Number} [nbBranches=5] - Number of branches to create (can't be less than 2)
     * @param {Number} [bevelRatio=0.5] - Ratio between branches length and bevel between them
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (position, outerRadius, nbBranches = 5, bevelRatio = 0.5, options) {
        super(position, nbBranches, outerRadius, options);

        const innerRadius = outerRadius * bevelRatio;
        const innerPoints = RegularPolygon.getRotatingPoint(nbBranches, innerRadius, 0.5 / nbBranches);
        innerPoints.forEach((point, index) => this.points.splice((index * 2) + 1, 0, point.add(position)));

        this.nbPoints *= 2;
        this.bevelRatio = bevelRatio;
    }

    /**
     * @inheritDoc
     */
    isHover (position) {
        return position.distance(this.position) < (this.radius * this.bevelRatio) || super.isHover(position);
    }
}
