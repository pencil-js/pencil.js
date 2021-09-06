import Component from "@pencil.js/component";
import Line from "@pencil.js/line";
import Position from "@pencil.js/position";
import Spline from "@pencil.js/spline";
import Instruction from "./instruction";

/**
 * @module Path
 */

/**
 * Path class
 * <br><img src="./media/examples/path.png" alt="path demo"/>
 * @class
 * @extends Component
 */
export default class Path extends Component {
    /**
     * Path constructor
     * @param {PositionDefinition} positionDefinition - Starting position of the Path
     * @param {Array<Instruction>|String} instructions - Set of instructions to follow to draw it
     * @param {Boolean} [isClosed=true] - Should the path close itself (add a line to the starting position)
     * @param {ComponentOptions|LineOptions} [options] - Drawing options
     */
    constructor (positionDefinition, instructions, isClosed = true, options) {
        super(positionDefinition, options);

        if (!isClosed) {
            // Overrides options to work like a line if not closed
            this.options = (new Line(this.position, [], options)).options;
        }

        this.instructions = instructions;
        this.isClosed = isClosed;
        this.closing = Path.lineTo(new Position());
    }

    /**
     * Draw the path
     * @param {Path2D} path - Current drawing path
     * @return {Path} Itself
     */
    trace (path) {
        let lastPosition = new Position();
        const instructions = this.instructions.slice();

        if (Array.isArray(instructions)) {
            if (this.isClosed) {
                const lastTarget = this.instructions[this.instructions.length - 1].target;
                path.moveTo(lastTarget.x, lastTarget.y);
                instructions.unshift(this.closing);
                instructions.push(this.closing);
                lastPosition = lastTarget;
            }
            else {
                path.moveTo(0, 0);
            }

            instructions.forEach(instruction => lastPosition = instruction.execute(path, lastPosition));
        }
        else if (typeof instructions === "string") {
            const svg = new window.Path2D(`M0 0 ${instructions}${this.isClosed ? " Z" : ""}`);
            path.addPath(svg);
        }

        return this;
    }

    /**
     * @inheritDoc
     */
    isHover (positionDefinition, ctx) {
        return super.isHover(positionDefinition, ctx);
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const { instructions, isClosed } = this;
        return {
            ...super.toJSON(),
            instructions,
            isClosed,
        };
    }

    /**
     * @inheritDoc
     * @param {Object} definition - Path definition
     * @return {Path}
     */
    static from (definition) {
        const instructions = Array.isArray(definition.instructions) ?
            definition.instructions.map(instruction => Instruction.from(instruction)) :
            undefined;
        return new Path(
            definition.position,
            instructions,
            definition.isClosed,
            definition.options,
        );
    }

    /**
     * Draw a line to a position
     * @param {PositionDefinition} position - Any position
     * @return {Instruction}
     */
    static lineTo (position) {
        return new Instruction((path, pos) => path.lineTo(pos.x, pos.y), position);
    }

    /**
     * Move the pencil without drawing
     * @param {PositionDefinition} position - Any position
     * @return {Instruction}
     */
    static moveTo (position) {
        return new Instruction((path, pos) => path.moveTo(pos.x, pos.y), position);
    }

    /**
     * Draw an quarter circle arc to a position
     * @param {PositionDefinition} position - Any position
     * @param {Boolean} [clockwise=true] - Should the arc be clockwise or not
     * @return {Instruction}
     */
    static quarterTo (position, clockwise) {
        return Path.arcTo(position, 0.25, (4 / 3) * (Math.sqrt(2) - 1), clockwise);
    }

    /**
     * Draw an quarter circle arc to a position
     * @param {PositionDefinition} position - Any position
     * @param {Boolean} [clockwise=true] - Should the arc be clockwise or not
     * @return {Instruction}
     */
    static halfTo (position, clockwise) {
        return Path.arcTo(position, 0.5, 4 / 3, clockwise);
    }

    /**
     * Try to approximate an arc between two points
     * @param {PositionDefinition} position - Any position
     * @param {Number} angle - Arc angle in ratio of a full circle (should be less than 0.5)
     * @param {Number} magicRatio - Control points "openness" ratio
     * @param {Boolean} [clockwise=true] - Should the arc be clockwise or not
     * @return {Instruction}
     */
    static arcTo (position, angle, magicRatio, clockwise = true) {
        return new Instruction((path, pos, lp) => {
            const distance = pos.distance(lp);
            const radius = distance / 2;

            const direction = clockwise ? 1 : -1;
            const alpha = (angle / 2) * direction;
            const ctrl1 = pos.clone()
                .subtract(lp).rotate(-alpha)
                .divide(distance)
                .multiply(magicRatio * radius)
                .add(lp);
            const ctrl2 = lp.clone()
                .subtract(pos).rotate(alpha)
                .divide(distance)
                .multiply(magicRatio * radius)
                .add(pos);

            // Approximate a arc with a bezier curve
            Path.bezierTo(pos, ctrl1, ctrl2).execute(path, lp);
        }, position);
    }

    /**
     * Draw a quadratic curve to a position
     * @param {PositionDefinition} position - Any position
     * @param {PositionDefinition} controlPoint - Point that control the curve
     * @return {Instruction}
     */
    static quadTo (position, controlPoint) {
        const control = Position.from(controlPoint);
        return new Instruction((path, pos) => {
            path.quadraticCurveTo(control.x, control.y, pos.x, pos.y);
        }, position);
    }

    /**
     * Draw a bezier curve to a position
     * @param {PositionDefinition} position - Any position
     * @param {PositionDefinition} firstControlPoint - First point to control the curve
     * @param {PositionDefinition} secondControlPoint - Second point to control the curve
     * @return {Instruction}
     */
    static bezierTo (position, firstControlPoint, secondControlPoint) {
        const control1 = Position.from(firstControlPoint);
        const control2 = Position.from(secondControlPoint);
        return new Instruction((path, pos) => {
            path.bezierCurveTo(
                control1.x, control1.y,
                control2.x, control2.y,
                pos.x, pos.y,
            );
        }, position);
    }

    /**
     *
     * @param {Array<PositionDefinition>} points - Any set of positions
     * @param {Number} [tension] - Ratio of tension
     * @return {Instruction}
     */
    static splineThrough (points, tension) {
        const last = points[points.length - 1];
        return new Instruction((path, current, previousPosition) => {
            Spline.splineThrough(path, [previousPosition, ...points], tension);
        }, last);
    }

    /* eslint-disable */
    /**
     *
     * @param {PositionDefinition} position - Any position
     * @param {Number} nbWaves - Number of waves to draw
     * @return {Instruction}
     */
    static waveTo (position, nbWaves) {
        throw new ReferenceError("This function has yet to be implemented.");
        return new Instruction((path, pos, lp) => {
            // TODO
        }, position);
    }

    /**
     *
     * @param {PositionDefinition} position - Any position
     * @param {Number} nbSins - Number of sinusoid to draw
     * @param {Number} sinsHeight - Height of the sinusoid
     * @return {Instruction}
     */
    static sinTo (position, nbSins, sinsHeight) {
        throw new ReferenceError("This function has yet to be implemented.");
        return new Instruction((path, pos, lp) => {
            // TODO
        }, position);
    }
    /* eslint-enable */
}
