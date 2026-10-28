import Component, { type ComponentOptions } from "./component.js";
import type { ContainerJSON } from "./container.js";
import Position, { type PositionDefinition } from "./position.js";

/**
 * Rectangle options
 */
export interface RectangleOptions extends ComponentOptions {
    /** Radius of the corners (or a list of radii, see https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/roundRect) */
    rounded: number | DOMPointInit | Array<number | DOMPointInit>;
}

/**
 * Tell if a style is a plain color (string or Color), not a gradient nor a pattern
 * @param style - Any style
 */
const isPlainColor = (style: unknown): boolean => style == null || typeof style === "string" ||
    typeof (style as { hex?: unknown }).hex === "string";

/**
 * Something with a width, a height and an origin
 */
interface Sized {
    width: number;
    height: number;
    options: {
        origin?: PositionDefinition | string;
    };
}

/**
 * Compute the origin of a sized element according to named origins
 * @param sized - Anything with a width, a height and an origin option
 * @internal
 */
export function getRectangleOrigin (sized: Sized): Position {
    const { origin } = sized.options;
    if (typeof origin !== "string") {
        return Position.from(origin);
    }

    const position = new Position();
    const lower = origin.toLowerCase();
    // Horizontal
    if (lower.endsWith("right")) {
        position.x = -sized.width;
    }
    else if (lower === "center" || lower.endsWith("center")) {
        position.x = -sized.width / 2;
    }
    // Vertical
    if (lower.startsWith("bottom")) {
        position.y = -sized.height;
    }
    else if (lower.startsWith("center")) {
        position.y = -sized.height / 2;
    }
    return position;
}

/**
 * Rectangle shape
 */
export class Rectangle<O extends RectangleOptions = RectangleOptions> extends Component<O> {
    static override get className (): string {
        return "Rectangle";
    }

    #width = 0;

    #height = 0;

    /** Geometry used to trace the cached path */
    #pathKey: [number, number, number] = [NaN, NaN, NaN];

    /**
     * Rectangle constructor
     * @param positionDefinition - Top-left corner (depending on the origin)
     * @param width - Horizontal size
     * @param height - Vertical size
     * @param options - Drawing options
     */
    constructor (positionDefinition?: PositionDefinition, width = 0, height = 0, options?: Partial<O>) {
        super(positionDefinition, options);

        this.width = width;
        this.height = height;
    }

    /**
     * Horizontal size
     */
    get width (): number {
        return this.#width;
    }

    set width (width: number) {
        this.#width = width;
    }

    /**
     * Vertical size
     */
    get height (): number {
        return this.#height;
    }

    set height (height: number) {
        this.#height = height;
    }

    /**
     * Draw the rectangle
     * @param path - Drawing path
     * @returns Itself
     */
    trace (path: Path2D): this {
        const { rounded } = this.options;
        if (rounded && typeof path.roundRect === "function") {
            path.roundRect(0, 0, this.width, this.height, rounded);
        }
        else {
            path.rect(0, 0, this.width, this.height);
        }
        return this;
    }

    /**
     * Keep the path while the size don't change
     */
    protected override isPathDirty (): boolean {
        const { rounded } = this.options;
        if (this.trace !== Rectangle.prototype.trace || typeof rounded !== "number") {
            return true;
        }
        const key = this.#pathKey;
        const { width, height } = this;
        if (key[0] === width && key[1] === height && key[2] === rounded) {
            return false;
        }
        key[0] = width;
        key[1] = height;
        key[2] = rounded;
        return true;
    }

    /**
     * Use the fast fillRect and strokeRect for plain rectangles
     * @param ctx - Drawing context
     */
    protected override paint (ctx: CanvasRenderingContext2D): void {
        if (this.trace !== Rectangle.prototype.trace || this.options.rounded) {
            super.paint(ctx);
            return;
        }
        const { width, height } = this;
        if (this.willFill) {
            ctx.fillRect(0, 0, width, height);
        }
        if (this.willStroke) {
            ctx.strokeRect(0, 0, width, height);
        }
    }

    /**
     * Plain rectangles draw in their parent space with an offset, avoiding a change of transformation
     * @internal
     */
    protected override canDrawInParentSpace (): boolean {
        const { rounded, fill, stroke } = this.options;
        // Gradients and patterns are positioned relative to the component, they need its own space
        return this.hasPureDrawing && this.trace === Rectangle.prototype.trace && !rounded &&
            isPlainColor(fill) && isPlainColor(stroke);
    }

    /**
     * Draw with fillRect and strokeRect using an offset
     * @param ctx - Drawing context, with the parent transformation
     * @param x - Horizontal offset
     * @param y - Vertical offset
     * @internal
     */
    override drawInParentSpace (ctx: CanvasRenderingContext2D, x: number, y: number): boolean {
        if (this.willFill || this.willStroke) {
            this.setContext(ctx);
            const origin = this.getOrigin();
            const left = x + origin.x;
            const top = y + origin.y;
            const { width, height } = this;
            if (this.willFill) {
                ctx.fillRect(left, top, width, height);
            }
            if (this.willStroke) {
                // Much faster than stroking a path (corners anti-aliasing can differ slightly)
                ctx.strokeRect(left, top, width, height);
            }
        }
        return true;
    }

    /**
     * @internal
     */
    override get hasPureDrawing (): boolean {
        return this.makePath === Component.prototype.makePath &&
            this.setContext === Component.prototype.setContext &&
            this.paint === Rectangle.prototype.paint;
    }

    /**
     * Return the relative origin position of draw (accepting named origins like "center" or "bottomRight")
     */
    override getOrigin (): Position {
        return getRectangleOrigin(this);
    }

    override toJSON (): ContainerJSON {
        const { width, height } = this;
        return {
            ...super.toJSON(),
            width,
            height,
        };
    }

    /**
     * Return an instance from a generic object
     * @param definition - Rectangle definition
     */
    static override from (definition: ContainerJSON): Rectangle {
        return new this(definition.position, definition.width, definition.height, definition.options);
    }

    static override get defaultOptions (): RectangleOptions {
        return {
            ...super.defaultOptions,
            rounded: 0,
        };
    }

    /**
     * Set of named origins
     */
    static get origins () {
        return {
            topLeft: "topLeft",
            topRight: "topRight",
            topCenter: "topCenter",
            center: "center",
            centerLeft: "centerLeft",
            centerRight: "centerRight",
            bottomLeft: "bottomLeft",
            bottomRight: "bottomRight",
            bottomCenter: "bottomCenter",
        } as const;
    }
}

export default Rectangle;
