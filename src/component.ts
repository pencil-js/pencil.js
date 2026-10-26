import Container, { type ContainerOptions } from "./container.js";
import Position, { type PositionDefinition } from "./position.js";
import { getSandbox, toStyle, type StyleLike } from "./internal/canvas.js";

/**
 * Anything usable as fill or stroke (color string, Color, gradient, pattern …)
 */
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
 * @module Component
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
        ctx.lineJoin = join;
        if (cap) {
            ctx.lineCap = cap;
        }
        ctx.lineWidth = strokeWidth;
        if (dashed) {
            const pattern = Array.isArray(dashed) ? dashed : Component.dashes.default;
            ctx.setLineDash(pattern.map(value => value * strokeWidth));
        }
        else {
            ctx.setLineDash([]);
        }
    }

    /**
     * Set drawing variables of the context according to specified options
     * @param ctx - Drawing context
     * @returns Itself
     */
    override setContext (ctx: CanvasRenderingContext2D): this {
        const { shadow, fill, stroke } = this.options;
        if (shadow.color) {
            const shadowPosition = Position.from(shadow.position);
            ctx.shadowColor = String(toStyle(shadow.color, ctx));
            ctx.shadowBlur = shadow.blur ?? 0;
            ctx.shadowOffsetX = shadowPosition.x;
            ctx.shadowOffsetY = shadowPosition.y;
        }
        else {
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }

        if (this.willFill && fill) {
            ctx.fillStyle = toStyle(fill, ctx);
        }

        if (this.willStroke && stroke) {
            ctx.strokeStyle = toStyle(stroke, ctx);
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
     * Make the path and trace it
     * @param ctx - Drawing context
     * @returns Itself
     */
    override makePath (ctx: CanvasRenderingContext2D): this {
        if (this.willFill || this.willStroke) {
            this.setContext(ctx);

            const origin = this.getOrigin();
            ctx.translate(origin.x, origin.y);

            const path = this.buildPath();

            if (this.willFill) {
                ctx.fill(path);
            }

            if (this.willStroke) {
                ctx.stroke(path);
            }

            ctx.translate(-origin.x, -origin.y);
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

        const path = this.path ?? this.buildPath();

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
