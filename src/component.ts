import Container, { type ContainerOptions } from "./container.js";
import Position, { type PositionDefinition } from "./position.js";
import { getSandbox, setStyle, toStyle, type StyleLike } from "./internal/canvas.js";
import { isTracked, set, state } from "./internal/render-state.js";

const NO_DASH: Array<number> = [];

const cacheableClasses = new WeakMap<object, boolean>();

/**
 * Find the prototype defining a property
 * @param prototype - Starting prototype
 * @param key - Name of the property
 */
const findOwner = (prototype: object | null, key: string): object | null => {
    let current = prototype;
    while (current && !Object.hasOwn(current, key)) {
        current = Object.getPrototypeOf(current);
    }
    return current;
};

/**
 * Tell if the path of a component can be kept between renders:
 * its path dependencies must be declared by the class defining its "trace" method (or a subclass of it)
 * @param component - Any component
 */

const isCacheable = (component: Component): boolean => {
    if (Object.hasOwn(component, "trace")) {
        return false;
    }
    const prototype = Object.getPrototypeOf(component) as object;
    let result = cacheableClasses.get(prototype);
    if (result === undefined) {
        const traceOwner = findOwner(prototype, "trace");
        const dependenciesOwner = findOwner(prototype, "pathDependencies");

        result = Boolean(traceOwner && dependenciesOwner && dependenciesOwner !== Component.prototype &&
            (dependenciesOwner === traceOwner || Object.prototype.isPrototypeOf.call(traceOwner, dependenciesOwner)));
        cacheableClasses.set(prototype, result);
    }
    return result;
};

/**
 * Anything usable as fill or stroke (color string, Color, gradient, pattern …)
 */
export type { StyleLike };

export type Style = StyleLike | string | null;

/**
 * Shadow options
 */
export interface ShadowOptions {
    /** Spread of the shadow around the component */
    blur: number;
    /** Position of the shadow relative to the component */
    position: PositionDefinition;
    /** Color of the shadow */
    color: Style;
}

/**
 * Component options
 */
export interface ComponentOptions extends ContainerOptions {
    /** Color used to fill, set to null for transparent */
    fill: Style;
    /** Color used to stroke, set to null for transparent */
    stroke: Style;
    /** Stroke line thickness in pixels */
    strokeWidth: number;
    /** Should the line be dashed, you can also specify the dash pattern (ex: [4, 4] or Component.dashes.dots) */
    dashed: boolean | Array<number>;
    /** Cursor to use when hover */
    cursor: string | null;
    /** How lines join between them */
    join: CanvasLineJoin;
    /** How lines end */
    cap?: CanvasLineCap;
    /** Relative offset (Rectangle based shapes also accept named origins like "center") */
    origin: PositionDefinition | string;
    /** Set of options to set a shadow */
    shadow: Partial<ShadowOptions>;
}

/**
 * Abstract class for visual component
 */
export abstract class Component<O extends ComponentOptions = ComponentOptions> extends Container<O> {
    static override get className (): string {
        return "Component";
    }

    /** Last traced path */
    path: Path2D | null;

    /** Is currently clicked */
    isClicked: boolean;

    /** Is currently hovered */
    isHovered: boolean;

    /** Values used to trace the current path */
    #pathDependencies: Array<unknown> = [];

    /**
     * Component constructor
     * @param positionDefinition - Position in space
     * @param options - Drawing options
     */
    constructor (positionDefinition?: PositionDefinition, options?: Partial<O>) {
        super(positionDefinition, options);

        this.path = null;
        this.isClicked = false;
        this.isHovered = false;
    }

    /**
     * Return the relative origin position of draw
     */
    getOrigin (): Position {
        const { origin } = this.options;
        return typeof origin === "string" ? new Position() : Position.from(origin);
    }

    /**
     * Define options for this component
     * @param options - Options to override
     * @returns Itself
     */
    override setOptions (options: Partial<O> = {}): this {
        const previousShadow = this.options?.shadow;
        super.setOptions(options);
        if (typeof this.options.origin !== "string") {
            this.options.origin = Position.from(this.options.origin);
        }
        const shadow = {
            ...Component.defaultOptions.shadow,
            ...previousShadow,
            ...options.shadow,
        };
        shadow.position = Position.from(shadow.position);
        this.options.shadow = shadow;
        return this;
    }

    /**
     * Tell if a component will need to be filled
     */
    get willFill (): boolean {
        return Boolean(this.options.fill);
    }

    /**
     * Tell if a component will need to be stroked
     */
    get willStroke (): boolean {
        return Boolean(this.options.stroke) && this.options.strokeWidth > 0;
    }

    /**
     * Set line related variables of the context
     * @param ctx - Drawing context
     */
    protected setLineContext (ctx: CanvasRenderingContext2D): void {
        const { join, cap, strokeWidth, dashed } = this.options;
        set(ctx, "lineJoin", join);
        if (cap) {
            set(ctx, "lineCap", cap);
        }
        set(ctx, "lineWidth", strokeWidth);
        if (isTracked(ctx)) {
            if (state.dash === dashed && state.dashWidth === strokeWidth) {
                return;
            }
            state.dash = dashed;
            state.dashWidth = strokeWidth;
        }
        if (dashed) {
            const pattern = Array.isArray(dashed) ? dashed : Component.dashes.default;
            ctx.setLineDash(pattern.map(value => value * strokeWidth));
        }
        else {
            ctx.setLineDash(NO_DASH);
        }
    }

    /**
     * Set drawing variables of the context according to specified options
     * @param ctx - Drawing context
     * @returns Itself
     */
    override setContext (ctx: CanvasRenderingContext2D): this {
        const { shadow, fill, stroke } = this.options;
        const isKnown = isTracked(ctx);
        if (shadow.color) {
            const shadowPosition = Position.from(shadow.position);
            ctx.shadowColor = String(toStyle(shadow.color, ctx));
            ctx.shadowBlur = shadow.blur ?? 0;
            ctx.shadowOffsetX = shadowPosition.x;
            ctx.shadowOffsetY = shadowPosition.y;
            if (isKnown) {
                state.hasShadow = true;
            }
        }
        else if (!isKnown || state.hasShadow !== false) {
            // No blur and no offset means no shadow
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            if (isKnown) {
                state.hasShadow = false;
            }
        }

        if (this.willFill && fill) {
            setStyle(ctx, "fillStyle", fill);
        }

        if (this.willStroke && stroke) {
            setStyle(ctx, "strokeStyle", stroke);
            this.setLineContext(ctx);
        }

        return this;
    }

    /**
     * Trace and return a new path
     */
    protected buildPath (): Path2D {
        const path = new Path2D();
        this.trace(path);
        this.path = path;
        return path;
    }

    /**
     * Values the path depends on (the path is kept between renders while they don't change).
     * Return null when the path must be traced at every render (the default).
     * Override it alongside "trace" when the traced path only depends on a few values.
     * @example
     * protected override get pathDependencies () {
     *     return [this.width, this.height];
     * }
     */
    protected get pathDependencies (): ReadonlyArray<unknown> | null {
        return null;
    }

    /**
     * Tell if the path needs to be traced again
     */
    protected isPathDirty (): boolean {
        const dependencies = isCacheable(this) ? this.pathDependencies : null;
        if (!dependencies) {
            return true;
        }
        const known = this.#pathDependencies;
        let isDirty = known.length !== dependencies.length;
        for (let i = 0; i < dependencies.length; ++i) {
            if (!Object.is(known[i], dependencies[i])) {
                known[i] = dependencies[i];
                isDirty = true;
            }
        }
        known.length = dependencies.length;
        return isDirty;
    }

    /**
     * Return the path of this component, traced again only when needed
     */
    getPath (): Path2D {
        if (this.isPathDirty() || !this.path) {
            return this.buildPath();
        }
        return this.path;
    }

    /**
     * Fill and stroke the component (the context is already set)
     * @param ctx - Drawing context
     */
    protected paint (ctx: CanvasRenderingContext2D): void {
        const path = this.getPath();

        if (this.willFill) {
            ctx.fill(path);
        }

        if (this.willStroke) {
            ctx.stroke(path);
        }
    }

    /**
     * Tell if drawing only change the context through the render state (so it stays known)
     * @internal
     */
    override get hasPureDrawing (): boolean {
        return this.makePath === Component.prototype.makePath &&
            this.setContext === Component.prototype.setContext &&
            this.paint === Component.prototype.paint;
    }

    /**
     * Set the context and draw the component
     * @param ctx - Drawing context
     * @returns Itself
     */
    override makePath (ctx: CanvasRenderingContext2D): this {
        if (this.willFill || this.willStroke) {
            this.setContext(ctx);

            const origin = this.getOrigin();
            const { x, y } = origin;
            const isShifted = x !== 0 || y !== 0;
            if (isShifted) {
                ctx.translate(x, y);
            }

            this.paint(ctx);

            if (isShifted) {
                ctx.translate(-x, -y);
            }
        }

        return this;
    }

    /**
     * Every component should have a trace function
     * @param path - Drawing path
     */
    abstract trace (path: Path2D): this;

    /**
     * Define if is hover a position
     * @param positionDefinition - Any position
     * @param ctx - Context use for calculation (with transformations already applied)
     */
    override isHover (positionDefinition?: PositionDefinition, ctx: CanvasRenderingContext2D = getSandbox()): boolean {
        if (!this.options.shown || (!this.willFill && !this.willStroke)) {
            return false;
        }

        const position = Position.from(positionDefinition);

        ctx.save();

        const origin = this.getOrigin();
        ctx.translate(origin.x, origin.y);

        const path = this.getPath();

        let result = this.willFill && ctx.isPointInPath(path, position.x, position.y);
        if (!result && this.willStroke) {
            this.setLineContext(ctx);
            result = ctx.isPointInStroke(path, position.x, position.y);
        }

        ctx.restore();
        return result;
    }

    /**
     * Default options for this class
     */
    static override get defaultOptions (): ComponentOptions {
        return {
            ...super.defaultOptions,
            fill: "#000",
            stroke: null,
            strokeWidth: 2,
            dashed: false,
            cursor: Component.cursors.default,
            join: Component.joins.miter,
            origin: new Position(),
            shadow: {
                blur: 0,
                position: new Position(),
                color: null,
            },
        };
    }

    /**
     * All available cursors
     * {@link https://developer.mozilla.org/docs/Web/CSS/cursor}
     */
    static get cursors () {
        const cursors = {
            default: "default",
            none: "none",
            contextMenu: "context-menu",
            help: "help",
            pointer: "pointer",
            progress: "progress",
            wait: "wait",
            cell: "cell",
            crosshair: "crosshair",
            text: "text",
            textVertical: "vertical-text",
            alias: "alias",
            copy: "copy",
            move: "move",
            noDrop: "no-drop",
            notAllowed: "not-allowed",
            grab: "grab",
            grabbing: "grabbing",
            allScroll: "all-scroll",
            colResize: "col-resize",
            rowResize: "row-resize",
            nResize: "n-resize",
            eResize: "e-resize",
            sResize: "s-resize",
            wResize: "w-resize",
            neResize: "ne-resize",
            seResize: "se-resize",
            swResize: "sw-resize",
            nwResize: "nw-resize",
            ewResize: "ew-resize",
            nsResize: "ns-resize",
            neswResize: "nesw-resize",
            nwseResize: "nwse-resize",
            zoomIn: "zoom-in",
            zoomOut: "zoom-out",
        };

        return {
            ...cursors,
            // Aliases
            link: cursors.alias,
            verticalResize: cursors.rowResize,
            horizontalResize: cursors.colResize,
            topResize: cursors.nResize,
            rightResize: cursors.eResize,
            bottomResize: cursors.sResize,
            leftResize: cursors.wResize,
        };
    }

    /**
     * How lines join between them
     */
    static get joins () {
        return {
            /** Join segment by extending the line edges until they meet */
            miter: "miter",
            /** Join with a circle tangent to line edges */
            round: "round",
            /** Join with a straight line between the line edges */
            bevel: "bevel",
        } as const;
    }

    /**
     * Dash patterns
     */
    static get dashes () {
        const pattern = {
            /** Simple dash */
            default: [4, 4],
            /** Simple dots */
            dots: [1, 4],
            /** Longer dash */
            long: [9, 4],
        };
        return {
            ...pattern,
            /** Alternating pattern of short and long dash */
            sewing: [...pattern.default, ...pattern.dots],
        };
    }
}

export default Component;
