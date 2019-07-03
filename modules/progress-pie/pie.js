import Arc from "@pencil.js/arc";

/**
 * @class
 */
export default class Pie extends Arc {
    constructor (positionDefinition, radius, startAngle, endAngle, options) {
        super(positionDefinition, radius, radius, startAngle, endAngle, options);
    }

    trace (path) {
        path.moveTo(0, 0);
        return super.trace(path);
    }
}
