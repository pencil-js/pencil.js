import Polygon from "@pencil.js/polygon";
import Position from "@pencil.js/position";

/**
 * Star class
 * @class
 * @extends Polygon
 */
export default class Star extends Polygon {
    /**
     * Star constructor
     * @param {Position} position - Center of the star
     * @param {Number} outerRadius - Distance of branches from center
     * @param {Number} [nbBranches=5] - Number of branches to create (can't be less than 2)
     * @param {Number} [bevelRatio=0.5] - Ratio between branches length and bevel between them
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (position, outerRadius, nbBranches = 5, bevelRatio = 0.5, options) {
        if (nbBranches < Star.MIN_NB_BRANCHES) {
            throw new RangeError(`Star can't have less than ${Star.MIN_NB_BRANCHES} branches, ${nbBranches} asked.`);
        }

        let innerRadius = outerRadius * bevelRatio;
        let points = [];

        let nbPoints = nbBranches * 2;
        for (let i = 0; i < nbPoints; ++i) {
            let distance = i % 2 ? innerRadius : outerRadius;
            let rotation = (i / nbPoints - 1 / 4) * Math.PI * 2;
            points.push(new Position(Math.cos(rotation) * distance, Math.sin(rotation) * distance));
        }

        super(points, options);
        this.position = position;
    }

    /**
     * Minimum number of branches for a star
     * @return {Number}
     * @constant
     */
    static get MIN_NB_BRANCHES () {
        return 2;
    }
}
