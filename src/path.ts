import Component, { type ComponentOptions } from "./component.js";
import type { ContainerJSON } from "./container.js";
import Line, { type LineOptions } from "./line.js";
import Position, { type PositionDefinition } from "./position.js";
import Spline from "./spline.js";

/**
 * Function executed by an instruction
 * @param path - Current drawing path
 * @param target - Target position
 * @param previousPosition - Position from where instruction started
 * @param args - Additional arguments of the instruction
 */
export type InstructionCallback = (path: Path2D, target: Position, previousPosition: Position, ...args: Array<never>) => void;

/**
 * JSON representation of an instruction
 */
export interface InstructionJSON {
    /** Name of the instruction */
    type: string;
    /** Position to go to */
    target: [number, number];
    /** Additional arguments */
    args?: Array<unknown>;
}

/**
 * Single drawing step of a Path
 */
export class Instruction {
    /** Function to execute */
    action: InstructionCallback;

    /** Position to go to */
    target: Position;

    /** Name of the instruction (null for custom instruction) */
    type: string | null;

    /** Additional arguments */
    args: Array<unknown>;

    /**
     * Instruction constructor
     * @param action - Function to execute
     * @param target - Position to go to
     * @param type - Name of the instruction (needed for serialization)
     * @param args - Additional arguments passed to the action
     */
    constructor (action: InstructionCallback, target: PositionDefinition, type: string | null = null, args: Array<unknown> = []) {
        this.action = action;
        this.target = Position.from(target);
        this.type = type;
        this.args = args;
    }

    /**
     * Follow the instruction
     * @param path - Current drawing path
     * @param previousPosition - Position from where the instruction start
     * @returns The position reached
     */
    execute (path: Path2D, previousPosition: Position): Position {
        (this.action as (...params: Array<unknown>) => void).call(this, path, this.target, previousPosition, ...this.args);
        return this.target;
    }

    /**
     * Return a json ready object (only for instructions created with Path's static methods)
     */
    toJSON (): InstructionJSON {
        if (!this.type) {
            throw new ReferenceError("Custom instructions can't be serialized, use Path's static methods to build instructions.");
        }
        const args = this.args.map(arg => (arg && typeof (arg as Position).toJSON === "function" ? (arg as Position).toJSON() : arg));
        return {
            type: this.type,
            target: this.target.toJSON(),
            ...(args.length ? { args } : {}),
        };
    }

    /**
     * Return an instance from a generic object
     * @param definition - Instruction definition
     */
    static from (definition: InstructionJSON | Instruction): Instruction {
        if (definition instanceof Instruction) {
            return definition;
        }

        const builder = (Path as unknown as Record<string, (...params: Array<unknown>) => Instruction>)[definition.type];
        if (typeof builder !== "function") {
            throw new ReferenceError(`Unknown instruction type "${definition.type}".`);
        }
        return builder(definition.target, ...(definition.args ?? []));
    }
}

/**
 * Draw a bezier curve from a position to another
 * @param path - Current drawing path
 * @param target - Ending position
 * @param control1 - First control point
 * @param control2 - Second control point
 */
const bezier = (path: Path2D, target: Position, control1: Position, control2: Position) => {
    path.bezierCurveTo(control1.x, control1.y, control2.x, control2.y, target.x, target.y);
};

/**
 * Approximate an arc between two positions with a bezier curve
 * @param path - Current drawing path
 * @param target - Ending position
 * @param from - Starting position
 * @param angle - Arc angle in ratio of a full circle (should be at most 0.5)
 * @param magicRatio - Control points "openness" ratio
 * @param clockwise - Should the arc be clockwise or not
 */
const arc = (path: Path2D, target: Position, from: Position, angle: number, magicRatio: number, clockwise: boolean) => {
    const distance = target.distance(from);
    if (!distance) {
        return;
    }
    const radius = distance / 2;
    const alpha = (angle / 2) * (clockwise ? 1 : -1);
    const ctrl1 = target.clone()
        .subtract(from).rotate(-alpha)
        .divide(distance)
        .multiply(magicRatio * radius)
        .add(from);
    const ctrl2 = from.clone()
        .subtract(target).rotate(alpha)
        .divide(distance)
        .multiply(magicRatio * radius)
        .add(target);
    bezier(path, target, ctrl1, ctrl2);
};

/**
 * Free shape following a list of instructions (or a SVG path string)
 * @module Path
 */
export default class Path<O extends ComponentOptions = ComponentOptions> extends Component<O> {
    static override get className (): string {
        return "Path";
    }

    /** Set of instructions (or a SVG path string) */
    instructions: Array<Instruction> | string;

    /** Should the path close itself */
    isClosed: boolean;

    /**
     * Path constructor
     * @param positionDefinition - Starting position of the Path
     * @param instructions - Set of instructions to follow to draw it (or a SVG path string)
     * @param isClosed - Should the path close itself (add a line to the starting position)
     * @param options - Drawing options
     * @example
     * new Path([0, 0], [
     *     Path.lineTo([100, 0]),
     *     Path.quarterTo([100, 100]),
     * ]);
     * new Path([0, 0], "l100 0 a50 50 0 0 1 0 100");
     */
    constructor (
        positionDefinition?: PositionDefinition,
        instructions: Array<Instruction> | string = [],
        isClosed = true,
        options?: Partial<O | LineOptions>,
    ) {
        super(positionDefinition, options as Partial<O>);

        if (!isClosed) {
            // Use line options when not closed
            this.options = {
                ...Line.defaultOptions,
                ...options,
            } as unknown as O;
            this.setOptions();
        }

        this.instructions = instructions;
        this.isClosed = isClosed;
    }

    /**
     * Draw the path
     * @param path - Drawing path
     * @returns Itself
     */
    trace (path: Path2D): this {
        const { instructions } = this;

        if (typeof instructions === "string") {
            path.addPath(new Path2D(`M0 0 ${instructions}${this.isClosed ? " Z" : ""}`));
            return this;
        }

        path.moveTo(0, 0);
        let lastPosition = new Position();
        for (const instruction of instructions) {
            lastPosition = instruction.execute(path, lastPosition);
        }
        if (this.isClosed) {
            path.closePath();
        }

        return this;
    }

    override toJSON (): ContainerJSON {
        const { instructions, isClosed } = this;
        return {
            ...super.toJSON(),
            instructions: typeof instructions === "string" ? instructions : instructions.map(instruction => instruction.toJSON()),
            isClosed,
        };
    }

    /**
     * Return an instance from a generic object
     * @param definition - Path definition
     */
    static override from (definition: ContainerJSON): Path {
        const instructions = Array.isArray(definition.instructions) ?
            definition.instructions.map((instruction: InstructionJSON) => Instruction.from(instruction)) :
            definition.instructions;
        return new this(definition.position, instructions, definition.isClosed, definition.options);
    }

    /**
     * Draw a line to a position
     * @param position - Any position
     */
    static lineTo (position: PositionDefinition): Instruction {
        return new Instruction((path, target) => path.lineTo(target.x, target.y), position, "lineTo");
    }

    /**
     * Move the pencil without drawing
     * @param position - Any position
     */
    static moveTo (position: PositionDefinition): Instruction {
        return new Instruction((path, target) => path.moveTo(target.x, target.y), position, "moveTo");
    }

    /**
     * Draw a quarter circle to a position
     * @param position - Any position
     * @param clockwise - Should the arc be clockwise or not
     */
    static quarterTo (position: PositionDefinition, clockwise = true): Instruction {
        return new Instruction((path, target, from) => {
            arc(path, target, from, 0.25, (4 / 3) * (Math.sqrt(2) - 1), clockwise);
        }, position, "quarterTo", [clockwise]);
    }

    /**
     * Draw a half circle to a position
     * @param position - Any position
     * @param clockwise - Should the arc be clockwise or not
     */
    static halfTo (position: PositionDefinition, clockwise = true): Instruction {
        return new Instruction((path, target, from) => {
            arc(path, target, from, 0.5, 4 / 3, clockwise);
        }, position, "halfTo", [clockwise]);
    }

    /**
     * Try to approximate an arc between two points
     * @param position - Any position
     * @param angle - Arc angle in ratio of a full circle (should be less than 0.5)
     * @param magicRatio - Control points "openness" ratio
     * @param clockwise - Should the arc be clockwise or not
     */
    static arcTo (position: PositionDefinition, angle: number, magicRatio: number, clockwise = true): Instruction {
        return new Instruction((path, target, from) => {
            arc(path, target, from, angle, magicRatio, clockwise);
        }, position, "arcTo", [angle, magicRatio, clockwise]);
    }

    /**
     * Draw a quadratic curve to a position
     * @param position - Any position
     * @param controlPoint - Point that control the curve
     */
    static quadTo (position: PositionDefinition, controlPoint: PositionDefinition): Instruction {
        const control = Position.from(controlPoint);
        return new Instruction((path, target) => {
            path.quadraticCurveTo(control.x, control.y, target.x, target.y);
        }, position, "quadTo", [control]);
    }

    /**
     * Draw a bezier curve to a position
     * @param position - Any position
     * @param firstControlPoint - First point to control the curve
     * @param secondControlPoint - Second point to control the curve
     */
    static bezierTo (
        position: PositionDefinition,
        firstControlPoint: PositionDefinition,
        secondControlPoint: PositionDefinition,
    ): Instruction {
        const control1 = Position.from(firstControlPoint);
        const control2 = Position.from(secondControlPoint);
        return new Instruction((path, target) => {
            bezier(path, target, control1, control2);
        }, position, "bezierTo", [control1, control2]);
    }

    /**
     * Draw a smooth curve going through a set of positions
     * @param points - Any set of positions (the last one being the target)
     * @param tension - Ratio of tension
     */
    static splineThrough (points: Array<PositionDefinition>, tension?: number): Instruction;
    /**
     * Draw a smooth curve going through a set of positions (serialized form)
     * @param target - Last position
     * @param points - Every positions to go through before the target
     * @param tension - Ratio of tension
     */
    static splineThrough (target: PositionDefinition, points: Array<PositionDefinition>, tension?: number): Instruction;
    static splineThrough (
        first: Array<PositionDefinition> | PositionDefinition,
        second?: Array<PositionDefinition> | number,
        third?: number,
    ): Instruction {
        // Support both the public signature and the serialized one
        const isSerialized = Array.isArray(second);
        const allPoints = (isSerialized ? [...second, first] : first) as Array<PositionDefinition>;
        const tension = (isSerialized ? third : second as number | undefined) ?? Spline.defaultTension;
        const points = allPoints.map(point => Position.from(point));
        const target = points[points.length - 1];
        return new Instruction((path, _target, from) => {
            Spline.splineThrough(path, [from, ...points], tension);
        }, target, "splineThrough", [points.slice(0, -1), tension]);
    }

    /**
     * Draw a series of half circles to a position
     * @param position - Any position
     * @param nbWaves - Number of waves to draw
     */
    static waveTo (position: PositionDefinition, nbWaves = 1): Instruction {
        const count = Math.max(1, Math.round(nbWaves));
        return new Instruction((path, target, from) => {
            let previous = from;
            for (let i = 1; i <= count; ++i) {
                const next = from.clone().lerp(target, i / count);
                arc(path, next, previous, 0.5, 4 / 3, true);
                previous = next;
            }
        }, position, "waveTo", [count]);
    }

    /**
     * Draw a sinusoid to a position
     * @param position - Any position
     * @param nbSins - Number of sinusoid to draw
     * @param sinsHeight - Height of the sinusoid
     */
    static sinTo (position: PositionDefinition, nbSins = 1, sinsHeight = 10): Instruction {
        return new Instruction((path, target, from) => {
            const halves = Math.max(1, Math.round(nbSins * 2));
            const delta = target.clone().subtract(from);
            const length = delta.length;
            if (!length) {
                return;
            }
            // Perpendicular unit vector
            const normal = new Position(-delta.y / length, delta.x / length);
            const step = delta.clone().divide(halves);
            // Bezier approximation of a half sine: control points at 1/3 and 2/3 with a 4/3 height ratio
            const peak = sinsHeight * (4 / 3);
            let previous = from;
            for (let i = 0; i < halves; ++i) {
                const direction = i % 2 ? -1 : 1;
                const next = from.clone().add(step.clone().multiply(i + 1));
                const offset = normal.clone().multiply(peak * direction);
                const control1 = previous.clone().add(step.clone().divide(3)).add(offset);
                const control2 = previous.clone().add(step.clone().multiply(2 / 3)).add(offset);
                bezier(path, next, control1, control2);
                previous = next;
            }
        }, position, "sinTo", [nbSins, sinsHeight]);
    }
}
