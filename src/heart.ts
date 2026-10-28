import Component, { type ComponentOptions } from "./component.js";
import type { ContainerJSON } from "./container.js";
import type { PositionDefinition } from "./position.js";

const curves: Array<[number, number, number, number, number, number]> = [
    [-0.4, -0.9, -1, -0.6, -1, 0],
    [-1, 0.4, -0.6, 0.6, 0, 1],
    [0.6, 0.6, 1, 0.4, 1, 0],
    [1, -0.6, 0.4, -0.9, 0, -0.4],
];

/**
 * Heart shape
 */
export class Heart<O extends ComponentOptions = ComponentOptions> extends Component<O> {
    static override get className (): string {
        return "Heart";
    }

    /** Size of the heart */
    radius: number;

    /**
     * Heart constructor
     * @param positionDefinition - Center of the heart
     * @param radius - Size of the heart
     * @param options - Drawing options
     */
    constructor (positionDefinition?: PositionDefinition, radius = 0, options?: Partial<O>) {
        super(positionDefinition, options);

        this.radius = radius;
    }

    #pathRadius = NaN;

    protected override isPathDirty (): boolean {
        if (this.trace !== Heart.prototype.trace || this.#pathRadius !== this.radius) {
            this.#pathRadius = this.radius;
            return true;
        }
        return false;
    }

    /**
     * Draw the heart
     * @param path - Drawing path
     * @returns Itself
     */
    trace (path: Path2D): this {
        const { radius } = this;
        path.moveTo(0, -0.4 * radius);
        for (const curve of curves) {
            const [c1x, c1y, c2x, c2y, x, y] = curve.map(value => value * radius);
            path.bezierCurveTo(c1x, c1y, c2x, c2y, x, y);
        }
        path.closePath();

        return this;
    }

    override toJSON (): ContainerJSON {
        return {
            ...super.toJSON(),
            radius: this.radius,
        };
    }

    /**
     * Return an instance from a generic object
     * @param definition - Heart definition
     */
    static override from (definition: ContainerJSON): Heart {
        return new this(definition.position, definition.radius, definition.options);
    }
}

export default Heart;
