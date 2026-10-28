import Ellipse from "./ellipse.js";
import type { ComponentOptions } from "./component.js";
import type { ContainerJSON } from "./container.js";
import type { PositionDefinition } from "./position.js";
import { radianCircle } from "./math.js";

/**
 * Circle shape
 */
export class Circle<O extends ComponentOptions = ComponentOptions> extends Ellipse<O> {
    static override get className (): string {
        return "Circle";
    }

    /**
     * Circle constructor
     * @param positionDefinition - Center of the circle
     * @param radius - Distance from center to outer edge
     * @param options - Drawing options
     */
    constructor (positionDefinition?: PositionDefinition, radius?: number, options?: Partial<O>) {
        super(positionDefinition, radius, radius, options);
    }

    /**
     * Distance from center to outer edge
     */
    get radius (): number {
        return this.width;
    }

    set radius (radius: number) {
        this.width = radius;
        this.height = radius;
    }

    protected override isPathDirty (): boolean {
        return this.trace !== Circle.prototype.trace || this.updatePathKey();
    }

    override trace (path: Path2D): this {
        path.arc(0, 0, Math.abs(this.radius), 0, radianCircle);
        return this;
    }

    override toJSON (): ContainerJSON {
        const { width: _width, height: _height, ...json } = super.toJSON();
        return {
            ...json,
            radius: this.radius,
        };
    }

    /**
     * Return an instance from a generic object
     * @param definition - Circle definition
     */
    static override from (definition: ContainerJSON): Circle {
        return new this(definition.position, definition.radius, definition.options);
    }
}

export default Circle;
