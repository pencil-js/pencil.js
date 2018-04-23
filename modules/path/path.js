import Component from "@pencil.js/component";
import Spline from "@pencil.js/spline";
import Line from "@pencil.js/line";
import { truncate } from "@pencil.js/math";

/**
 * Instruction class
 * @class
 */
class Instruction {
    /**
     * Instruction constructor
     * @param {Function} action - Function to execute
     * @param {Position} target - Position to go to
     */
    constructor (action, target) {
        this.action = action.bind(this);
        this.target = target;
    }

    /**
     * Follow the instruction
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @param {Position} previousCoordinates - Position from where the instruction start
     * @return {Position} The position reached
     */
    execute (ctx, previousCoordinates) {
        this.action(ctx, this.target, previousCoordinates);
        return this.target;
    }
}

/**
 * Path class
 * @class
 * @extends Component
 */
export default class Path extends Component {
    /**
     * Path constructor
     * @param {Position} position - Starting position of the Path
     * @param {Array<Instruction>} instructions - Set of instructions to follow to draw it
     * @param {Boolean} [isClosed=true] - Should the path close itself (add a line to the starting position)
     * @param {ComponentOptions|LineOptions} [options] - Drawing options
     */
    constructor (position, instructions, isClosed = true, options) {
        super(position, options);

        if (!isClosed) {
            this.options = Object.assign(Line.defaultOptions, options);
        }

        this.instructions = instructions;
        this.isClosed = isClosed;
        this.closing = Path.lineTo(this.position);
    }

    /**
     * Draw the path
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Path} Itself
     */
    trace (ctx) {
        ctx.save();
        ctx.translate(-truncate(this.position.x), -truncate(this.position.y));
        let lastCoordinates = this.position;
        const instructions = this.instructions.slice();

        if (this.isClosed) {
            const lastTarget = this.instructions[this.instructions.length - 1].target;
            ctx.moveTo(lastTarget.x, lastTarget.y);
            instructions.unshift(this.closing);
            instructions.push(this.closing);
            lastCoordinates = lastTarget;
        }

        instructions.forEach((instruction) => {
            lastCoordinates = instruction.execute(ctx, lastCoordinates);
        });

        ctx.restore();

        if (!this.isClosed) {
            ctx.lineJoin = this.options.join;
            ctx.lineCap = this.options.cap;
        }

        return this;
    }

    /**
     * // Fixme: Should work like Polygon.isHover and ask every instructions for intersection
     * Can't hover an open path
     * @return {Boolean}
     */
    isHover () { // eslint-disable-line class-methods-use-this
        return false;
    }

    /**
     * Draw a line to a position
     * @param {Position} position - Any position
     * @return {Instruction}
     */
    static lineTo (position) {
        return new Instruction(ctx => ctx.lineTo(position.x, position.y), position);
    }

    /**
     * Move the pencil without drawing
     * @param {Position} position - Any position
     * @return {Instruction}
     */
    static moveTo (position) {
        return new Instruction(ctx => ctx.moveTo(position.x, position.y), position);
    }

    /**
     * Draw an quarter circle arc to a position
     * @param {Position} position - Any position
     * @param {Boolean} [antiClockwise=false] - Should the arc be clockwise or not
     * @return {Instruction}
     */
    static quarterTo (position, antiClockwise = false) {
        return Path.arcTo(position, 0.25, (4 / 3) * (Math.sqrt(2) - 1), antiClockwise);
    }

    /**
     * Draw an quarter circle arc to a position
     * @param {Position} position - Any position
     * @param {Boolean} [antiClockwise=false] - Should the arc be clockwise or not
     * @return {Instruction}
     */
    static halfTo (position, antiClockwise = false) {
        return Path.arcTo(position, 0.5, 4 / 3, antiClockwise);
    }

    /**
     * Try to approximate an arc between two points
     * @param {Position} position - Any position
     * @param {Number} angle - Arc angle in ratio of a full circle (should be less than 0.5)
     * @param {Number} magicRatio - Control points ratio to approximate a circle
     * @param {Boolean} [antiClockwise=false] - Should the arc be clockwise or not
     * @return {Instruction}
     */
    static arcTo (position, angle, magicRatio, antiClockwise = false) {
        return new Instruction((ctx, pos, lc) => {
            const distance = lc.distance(pos);
            const radius = distance / 2;

            const direction = antiClockwise ? 1 : -1;
            const alpha = (angle / 2) * direction;
            const ctrl1 = pos.clone()
                .subtract(lc).rotate(-alpha)
                .divide(distance)
                .multiply(magicRatio * radius)
                .add(lc);
            const ctrl2 = lc.clone()
                .subtract(pos).rotate(alpha)
                .divide(distance)
                .multiply(magicRatio * radius)
                .add(pos);

            // Approximate a arc with a bezier curve
            ctx.bezierCurveTo(ctrl1.x, ctrl1.y, ctrl2.x, ctrl2.y, pos.x, pos.y);
        }, position);
    }

    /**
     * Draw a quadratic curve to a position
     * @param {Position} position - Any position
     * @param {Position} controlPoint - Point that control the curve
     * @return {Instruction}
     */
    static quadTo (position, controlPoint) {
        return new Instruction((ctx) => {
            ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, position.x, position.y);
        }, position);
    }

    /**
     * Draw a bezier curve to a position
     * @param {Position} position - Any position
     * @param {Position} firstControlPoint - First point to control the curve
     * @param {Position} secondControlPoint - Second point to control the curve
     * @return {Instruction}
     */
    static bezierTo (position, firstControlPoint, secondControlPoint) {
        return new Instruction((ctx) => {
            ctx.bezierCurveTo(
                firstControlPoint.x, firstControlPoint.y,
                secondControlPoint.x, secondControlPoint.y,
                position.x, position.y,
            );
        }, position);
    }

    /**
     *
     * @param {Array<Position>} positions - Any position
     * @param {Number} [tension] - Ratio of tension
     * @return {Instruction}
     */
    static splineThrough (positions, tension) {
        return new Instruction((ctx, pos, ls) => {
            Spline.splineThrough(ctx, [ls].concat(positions), tension);
        }, positions[positions.length - 1]);
    }

    /**
     *
     * @param {Position} position - Any position
     * @param {Number} nbWaves - Number of waves to draw
     * @return {Instruction}
     */
    static waveTo (position, nbWaves) {
        throw new ReferenceError("This function has yet to be implemented.");
        return new Instruction((ctx, pos, lc) => {
            // TODO
        }, position);
    }

    /**
     *
     * @param {Position} position - Any position
     * @param {Number} nbSins - Number of sinusoid to draw
     * @param {Number} sinsHeight - Height of the sinusoid
     * @return {Instruction}
     */
    static sinTo (position, nbSins, sinsHeight) {
        throw new ReferenceError("This function has yet to be implemented.");
        return new Instruction((ctx, pos, lc, nb) => {
            // TODO
        }, position);
    }
}
