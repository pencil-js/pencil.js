import BaseEvent from "./base-event.js";
import EventEmitter from "./event-emitter.js";
import Position, { type PositionDefinition } from "./position.js";
import { radianCircle } from "./math.js";
import { end, invalidate, start, state } from "./internal/render-state.js";
import type Scene from "./scene.js";
import type Component from "./component.js";

/**
 * Container options
 */
export interface ContainerOptions {
    /** Is shown */
    shown: boolean;
    /** Opacity level from 0 to 1 (multiplied with its parents opacity, null means 1) */
    opacity: number | null;
    /** Rotation ratio from 0 to 1 (clockwise) */
    rotation: number;
    /** Center of rotation relative to this position */
    rotationCenter: PositionDefinition;
    /** Scaling ratio or a pair of value for horizontal and vertical scaling */
    scale: number | PositionDefinition;
    /** Depth ordering */
    zIndex: number;
    /** Other component used to clip the rendering */
    clip: Component | null;
}

/**
 * JSON representation of a container
 */
export interface ContainerJSON {
    /** Name of the class */
    constructor: string;
    /** Position in its parent */
    position: PositionDefinition;
    /** Options different from the default ones */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: Record<string, any>;
    /** Children definitions */
    children?: Array<ContainerJSON>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

const DRAW = "draw";

/** Pair of values reused to avoid allocations */
const pair: [number, number] = [0, 0];

/**
 * Read a number or a position-like value without allocating
 * @param value - Number, Position, array or object with x and y
 * @param fallback - Value when undefined
 */
function readPair (value: number | PositionDefinition | null | undefined, fallback: number): [number, number] {
    if (typeof value === "number") {
        pair[0] = value;
        pair[1] = value;
    }
    else if (value == null) {
        pair[0] = fallback;
        pair[1] = fallback;
    }
    else if (Array.isArray(value)) {
        pair[0] = value[0] ?? fallback;
        pair[1] = value[1] ?? fallback;
    }
    else {
        pair[0] = (value as Position).x ?? fallback;
        pair[1] = (value as Position).y ?? fallback;
    }
    return pair;
}

/**
 * Tell if an event fired by a container would reach any listener (itself or its ancestors)
 * @param container - Starting container
 * @param name - Name of the event
 */
function hasListener (container: Container, name: string): boolean {
    const own = container.eventListeners[name];
    if (own?.length) {
        return true;
    }
    // Targeted listeners of ancestors only react to their own events
    for (let current = container.parent; current; current = current.parent) {
        const listeners = current.eventListeners[name];
        if (listeners) {
            for (let i = 0; i < listeners.length; ++i) {
                if (!listeners[i].isTargeted) {
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * Something that can be serialized
 */
interface Serializable {
    toJSON (): unknown;
}

const isSerializable = (value: unknown): value is Serializable => typeof (value as Serializable | null)?.toJSON === "function";

/**
 * Tell if a value can be compared through its JSON (serializable instance or plain object like shadow)
 * @param value - Any value
 */
const isComparable = (value: unknown): boolean => isSerializable(value) ||
    (Boolean(value) && Object.getPrototypeOf(value) === Object.prototype);

let containerEvents: Record<string, string> | undefined;

/**
 * Basic node in the scene graph, holding children and their common transformations
 */
export class Container<O extends ContainerOptions = ContainerOptions> extends EventEmitter {
    /** Name used when serializing (survive minification) */
    static get className (): string {
        return "Container";
    }

    /** Position in its container */
    position: Position;

    /** Set of options */
    options!: O;

    /** List of children */
    children: Array<Container>;

    /** Parent container (null when not attached) */
    parent: Container | null;

    /** Number of time this container has been rendered */
    frameCount: number;

    /** Is this the root scene */
    get isScene (): boolean {
        return false;
    }

    /**
     * Absolute transformation [a, b, c, d, e, f] computed during the last render
     * (only kept for containers with children, they need it to render their children)
     * @internal
     */
    worldMatrix: Float64Array | null = null;

    #scenePromise?: Promise<Scene>;

    /**
     * Container constructor
     * @param positionDefinition - Position in its container
     * @param options - Specific options
     */
    constructor (positionDefinition?: PositionDefinition, options?: Partial<O>) {
        super();

        this.position = Position.from(positionDefinition);
        this.options = {} as O;
        this.setOptions(options);
        this.children = [];
        this.parent = null;
        this.frameCount = 0;
    }

    /**
     * Define options for this container
     * @param options - Options to override
     * @returns Itself
     */
    setOptions (options: Partial<O> = {}): this {
        const { defaultOptions } = this.constructor as typeof Container;
        this.options = {
            ...defaultOptions,
            ...this.options,
            ...options,
        } as O;
        this.options.rotationCenter = Position.from(this.options.rotationCenter);
        if (typeof this.options.scale !== "number") {
            this.options.scale = Position.from(this.options.scale);
        }

        return this;
    }

    /**
     * Container can't be hovered
     * @param _positionDefinition - Any position
     * @param _ctx - Drawing context
     */
    isHover (_positionDefinition?: PositionDefinition, _ctx?: CanvasRenderingContext2D): boolean {
        return false;
    }

    /**
     * Add other containers as children
     * @param children - Other containers
     * @returns Itself
     */
    add (...children: Array<Container>): this {
        for (const child of children) {
            if (child === this) {
                throw new RangeError("A container can't contain itself.");
            }

            if (child.isScene) {
                throw new RangeError("A scene can't be contained in another container.");
            }

            if (child.isAncestorOf(this)) {
                throw new RangeError("A container can't contain one of its ancestor.");
            }

            child.parent?.remove(child);
            child.parent = this;
            this.children.push(child);
            child.fire(new BaseEvent(Container.events.attach, child));
        }

        return this;
    }

    /**
     * Remove children from the list
     * @param children - Children to remove
     * @returns Itself
     */
    remove (...children: Array<Container>): this {
        for (const child of children) {
            const index = this.children.indexOf(child);
            if (index !== -1) {
                this.children.splice(index, 1);
                child.parent = null;
                child.fire(new BaseEvent(Container.events.detach, child));
            }
        }

        return this;
    }

    /**
     * Remove all its children
     * @returns Itself
     */
    empty (): this {
        return this.remove(...this.children);
    }

    /**
     * Remove itself from its parent
     * @returns Itself
     */
    delete (): this {
        this.parent?.remove(this);
        return this;
    }

    /**
     * Return a promise for the associated scene (resolved once attached to a scene)
     */
    getScene (): Promise<Scene> {
        if (!this.#scenePromise) {
            this.#scenePromise = new Promise((resolve) => {
                const root = this.getRoot();
                if (root.isScene) {
                    resolve(root as unknown as Scene);
                    return;
                }
                const listened = new Set<Container>();
                const listener = () => {
                    const newRoot = this.getRoot();
                    if (newRoot.isScene) {
                        listened.forEach(one => one.removeListener(Container.events.attach, listener));
                        resolve(newRoot as unknown as Scene);
                    }
                    else if (!listened.has(newRoot)) {
                        listened.add(newRoot);
                        newRoot.on(Container.events.attach, listener);
                    }
                };
                // Attach events bubble up, so listening on the current root catch any attachment above
                listened.add(this);
                this.on(Container.events.attach, listener);
                listener();
            });
        }
        return this.#scenePromise;
    }

    /**
     * Return its highest parent
     */
    getRoot (): Container {
        let root: Container = this;
        while (root.parent) {
            root = root.parent;
        }
        return root;
    }

    /**
     * Get the matrix of transformation applied by this container on its children (including its position)
     */
    getMatrix (): DOMMatrix {
        const matrix = new DOMMatrix().translateSelf(this.position.x, this.position.y);
        const { rotation, rotationCenter, scale } = this.options;
        if (rotation) {
            const center = Position.from(rotationCenter);
            matrix
                .translateSelf(center.x, center.y)
                .rotateSelf(rotation * 360)
                .translateSelf(-center.x, -center.y);
        }
        const { x, y } = typeof scale === "number" ? { x: scale, y: scale } : Position.from(scale);
        if (x !== 1 || y !== 1) {
            matrix.scaleSelf(x, y);
        }
        return matrix;
    }

    /**
     * Get the cumulated matrix of transformation from the root to this container
     */
    getAbsoluteMatrix (): DOMMatrix {
        const matrix = this.getMatrix();
        return this.parent ? this.parent.getAbsoluteMatrix().multiplySelf(matrix) : matrix;
    }

    /**
     * Get this container's absolute position (up to it's utmost parent), taking into account every transformation
     */
    getAbsolutePosition (): Position {
        const { e, f } = this.getAbsoluteMatrix();
        return new Position(e, f);
    }

    /**
     * Convert a position from the root (scene) space into this container's space
     * @param positionDefinition - Position relative to the root
     */
    toLocal (positionDefinition: PositionDefinition): Position {
        const { x, y } = Position.from(positionDefinition);
        const point = this.getAbsoluteMatrix().inverse().transformPoint({
            x,
            y,
        });
        return new Position(point.x, point.y);
    }

    /**
     * Convert a position from this container's space into the root (scene) space
     * @param positionDefinition - Position relative to this container
     */
    toGlobal (positionDefinition: PositionDefinition): Position {
        const { x, y } = Position.from(positionDefinition);
        const point = this.getAbsoluteMatrix().transformPoint({
            x,
            y,
        });
        return new Position(point.x, point.y);
    }

    /**
     * Fire an event and bubble it to its parent
     * @param event - Event to fire
     * @returns Itself
     */
    override fire (event: BaseEvent): this {
        super.fire(event);
        if (this.parent && event.bubble) {
            this.parent.fire(event);
        }
        return this;
    }

    /**
     * Sort children according to their zIndex
     */
    protected sortChildren (): void {
        const { children } = this;
        for (let i = 1; i < children.length; ++i) {
            if (children[i - 1].options.zIndex > children[i].options.zIndex) {
                // Array.sort is stable
                children.sort((a, b) => a.options.zIndex - b.options.zIndex);
                return;
            }
        }
    }

    /**
     * Find the target at a position
     * @param position - Any position
     * @param ctx - Drawing context to apply paths
     */
    getTarget (position: Position, ctx: CanvasRenderingContext2D): Container | null {
        if (!this.options.shown) {
            return null;
        }

        ctx.save();
        ctx.translate(this.position.x, this.position.y);

        if (this.options.clip && !this.isInClip(position, ctx)) {
            ctx.restore();
            return null;
        }

        this.applyRotationAndScale(ctx);

        this.sortChildren();

        let target: Container | null = null;
        for (let lookup = this.children.length - 1; lookup >= 0 && !target; --lookup) {
            target = this.children[lookup].getTarget(position, ctx);
        }

        // Not found or behind this
        if ((!target || (target.options.zIndex < 0 && target.parent === this)) && this.isHover(position, ctx)) {
            target = this;
        }

        ctx.restore();
        return target;
    }

    /**
     * Tell if a position is inside the clipping region
     * @param position - Any position (in the drawing context space)
     * @param ctx - Drawing context with this container's transformations applied
     */
    protected isInClip (position: Position, ctx: CanvasRenderingContext2D): boolean {
        const { clip } = this.options;
        if (!clip) {
            return true;
        }
        return ctx.isPointInPath(Container.getClipPath(clip), position.x, position.y);
    }

    /**
     * Apply position, clipping, rotation and scaling to the context
     * @param ctx - Drawing context
     * @returns Itself
     */
    applyTransform (ctx: CanvasRenderingContext2D): this {
        ctx.translate(this.position.x, this.position.y);

        const { clip } = this.options;

        if (clip) {
            ctx.clip(Container.getClipPath(clip));
        }

        return this.applyRotationAndScale(ctx);
    }

    /**
     * Apply rotation and scaling to the context
     * @param ctx - Drawing context
     * @returns Itself
     */
    protected applyRotationAndScale (ctx: CanvasRenderingContext2D): this {
        const { rotation, rotationCenter, scale } = this.options;

        if (rotation) {
            const anchor = Position.from(rotationCenter);
            ctx.translate(anchor.x, anchor.y);
            ctx.rotate(rotation * radianCircle);
            ctx.translate(-anchor.x, -anchor.y);
        }

        const { x, y } = typeof scale === "number" ? { x: scale, y: scale } : Position.from(scale);
        if (x !== 1 || y !== 1) {
            ctx.scale(x, y);
        }

        return this;
    }

    /**
     * Build the clipping path of a component, with its own transformations applied
     * @param clip - Component used as clip
     */
    static getClipPath (clip: Component): Path2D {
        const shape = new Path2D();
        clip.trace(shape);
        const origin = clip.getOrigin();
        const clipping = new Path2D();
        clipping.addPath(shape, clip.getMatrix().translateSelf(origin.x, origin.y));
        return clipping;
    }

    /**
     * Set variables of the context according to specified options (override it to add behavior)
     * @param _ctx - Drawing context
     * @returns Itself
     */
    setContext (_ctx: CanvasRenderingContext2D): this {
        return this;
    }

    /**
     * Draw itself and all its children
     * @param ctx - Drawing context (its current transformation and opacity are used as starting point)
     * @returns Itself
     */
    render (ctx: CanvasRenderingContext2D): this {
        if (!this.options.shown) {
            return this;
        }

        const { a, b, c, d, e, f } = ctx.getTransform();

        // Only one save/restore for the whole tree
        const previous = start(ctx);
        ctx.save();
        try {
            this.renderTree(ctx, [a, b, c, d, e, f], ctx.globalAlpha);
        }
        finally {
            ctx.restore();
            end(previous);
        }

        return this;
    }

    /**
     * Draw itself and its children from a parent transformation
     * Each element set its absolute transformation, which is a lot faster than saving and restoring the context.
     * @param ctx - Drawing context
     * @param parentMatrix - Absolute transformation of the parent [a, b, c, d, e, f]
     * @param parentAlpha - Absolute opacity of the parent
     * @internal
     */
    renderTree (ctx: CanvasRenderingContext2D, parentMatrix: ArrayLike<number>, parentAlpha: number): void {
        const { options } = this;
        if (!options.shown) {
            return;
        }

        this.frameCount++;
        if (hasListener(this, DRAW)) {
            this.fire(new BaseEvent(DRAW, this));
            // Listeners could do anything with the context
            invalidate();
        }

        let a = parentMatrix[0];
        let b = parentMatrix[1];
        let c = parentMatrix[2];
        let d = parentMatrix[3];
        let e = parentMatrix[4];
        let f = parentMatrix[5];

        // Position
        const { x, y } = this.position;
        e += (a * x) + (c * y);
        f += (b * x) + (d * y);

        // Clip (in the parent space, after position)
        const { clip } = options;
        if (clip) {
            ctx.save();
            ctx.setTransform(a, b, c, d, e, f);
            ctx.clip(Container.getClipPath(clip));
            state.matrix = null;
        }

        // Rotation around its center
        const { rotation } = options;
        if (rotation) {
            const center = readPair(options.rotationCenter, 0);
            const cx = center[0];
            const cy = center[1];
            e += (a * cx) + (c * cy);
            f += (b * cx) + (d * cy);
            const radian = rotation * radianCircle;
            const cos = Math.cos(radian);
            const sin = Math.sin(radian);
            const na = (a * cos) + (c * sin);
            const nb = (b * cos) + (d * sin);
            c = (c * cos) - (a * sin);
            d = (d * cos) - (b * sin);
            a = na;
            b = nb;
            e -= (a * cx) + (c * cy);
            f -= (b * cx) + (d * cy);
        }

        // Scale
        const scale = readPair(options.scale, 1);
        const sx = scale[0];
        const sy = scale[1];
        const isTranslation = !rotation && sx === 1 && sy === 1;
        if (!isTranslation) {
            a *= sx;
            b *= sx;
            c *= sy;
            d *= sy;
        }

        const { children } = this;
        let world: Float64Array | null = null;
        if (children.length) {
            world = this.worldMatrix ??= new Float64Array(6);
            world[0] = a;
            world[1] = b;
            world[2] = c;
            world[3] = d;
            world[4] = e;
            world[5] = f;
        }

        const { opacity } = options;
        const alpha = opacity == null ? parentAlpha : parentAlpha * opacity;

        this.sortChildren();

        let index = 0;
        // Render children behind
        for (; index < children.length && children[index].options.zIndex < 0; ++index) {
            children[index].renderTree(ctx, world as Float64Array, alpha);
        }

        if (this.makePath !== Container.prototype.makePath) {
            if (ctx.globalAlpha !== alpha) {
                ctx.globalAlpha = alpha;
            }
            const isTracked = state.ctx === ctx;
            if (isTracked && isTranslation && this.canDrawInParentSpace()) {
                // Draw with an offset in the parent space: no need to change the transformation
                if (state.matrix !== parentMatrix) {
                    ctx.setTransform(parentMatrix[0], parentMatrix[1], parentMatrix[2], parentMatrix[3], parentMatrix[4], parentMatrix[5]);
                    state.matrix = parentMatrix;
                }
                this.drawInParentSpace(ctx, x, y);
            }
            else {
                // Without children, no matrix is kept so it can't be recognized later
                if (!world || !isTracked || state.matrix !== world) {
                    ctx.setTransform(a, b, c, d, e, f);
                    state.matrix = world;
                }
                this.makePath(ctx);
                if (!this.hasPureDrawing) {
                    invalidate();
                }
            }
        }

        // Render children in front
        for (; index < children.length; ++index) {
            children[index].renderTree(ctx, world as Float64Array, alpha);
        }

        if (clip) {
            ctx.restore();
            invalidate();
        }
    }

    /**
     * Tell if drawing only change the context through the render state (so it stays known)
     * @internal
     */
    get hasPureDrawing (): boolean {
        return this.makePath === Container.prototype.makePath;
    }

    /**
     * Tell if it can draw itself in its parent space (see drawInParentSpace)
     * @internal
     */
    protected canDrawInParentSpace (): boolean {
        return false;
    }

    /**
     * Draw itself in its parent space, with its position as offset (only called when it has no rotation and no scale)
     * @param _ctx - Drawing context, with the parent transformation
     * @param _x - Horizontal offset
     * @param _y - Vertical offset
     * @internal
     */
    drawInParentSpace (_ctx: CanvasRenderingContext2D, _x: number, _y: number): void {
        // Only called when canDrawInParentSpace returns true
    }

    /**
     * Do nothing on Container, override it to add behavior
     * @param _ctx - Drawing context
     * @returns Itself
     */
    makePath (_ctx: CanvasRenderingContext2D): this {
        return this;
    }

    /**
     * Display it
     * @returns Itself
     */
    show (): this {
        this.options.shown = true;
        this.fire(new BaseEvent(Container.events.show, this));
        return this;
    }

    /**
     * Hide it
     * @returns Itself
     */
    hide (): this {
        this.options.shown = false;
        this.fire(new BaseEvent(Container.events.hide, this));
        return this;
    }

    /**
     * Define if this is an ancestor of another container
     * @param container - Any container
     */
    isAncestorOf (container?: Container | null): boolean {
        let current = container?.parent;
        while (current) {
            if (current === this) {
                return true;
            }
            current = current.parent;
        }
        return false;
    }

    /**
     * Execute an action on itself and every ancestor
     * @param callback - Function to execute on each ancestor
     * @param until - Define a ancestor where to stop the climbing (excluded)
     */
    climbAncestry (callback: (ancestor: Container) => void, until?: Container | null): void {
        let current: Container | null = this;
        while (current && current !== until) {
            callback(current);
            current = current.parent;
        }
    }

    /**
     * Return a json ready object
     */
    toJSON (): ContainerJSON {
        const ctor = this.constructor as typeof Container;
        const { defaultOptions } = ctor;
        const defaults = defaultOptions as unknown as Record<string, unknown>;
        const optionsCopy: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(this.options)) {
            const defaultValue = defaults[key];
            const isDefault = value && typeof (value as Position).equals === "function" ?
                (value as Position).equals(defaultValue as Position) :
                Object.is(value, defaultValue) || (isComparable(value) && isComparable(defaultValue) &&
                    JSON.stringify(value) === JSON.stringify(defaultValue));
            if (!isDefault) {
                optionsCopy[key] = isSerializable(value) ? value.toJSON() : value;
            }
        }

        const json: ContainerJSON = {
            constructor: Object.hasOwn(ctor, "className") ? ctor.className : ctor.name,
            position: this.position.toJSON(),
        };
        if (this.children.length) {
            json.children = this.children.map(child => child.toJSON());
        }
        if (Object.keys(optionsCopy).length) {
            json.options = optionsCopy;
        }
        return json;
    }

    /**
     * Create a deep copy of this container (and its children)
     */
    clone (): this {
        const ctor = this.constructor as typeof Container;
        // Positions are mutable, the copy needs its own (in nested objects like shadow too)
        const copyValue = (value: unknown): unknown => {
            if (value instanceof Position) {
                return value.clone();
            }
            if (value && Object.getPrototypeOf(value) === Object.prototype) {
                return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, copyValue(nested)]));
            }
            return value;
        };
        const copy = ctor.from({
            ...this.toJSON(),
            children: undefined,
            options: copyValue(this.options) as O,
        }) as this;
        copy.add(...this.children.map(child => child.clone()));
        return copy;
    }

    /**
     * Define context opacity (null means no change)
     * @param ctx - Drawing context
     * @param opacity - Opacity value
     */
    static setOpacity (ctx: CanvasRenderingContext2D, opacity: number | null): void {
        if (opacity !== null && ctx.globalAlpha !== opacity) {
            ctx.globalAlpha = opacity;
        }
    }

    /**
     * Return an instance from a generic object
     * @param definition - Container definition
     */
    static from (definition: ContainerJSON): Container {
        return new this(definition.position, definition.options);
    }

    /**
     * Default options for this class
     */
    static get defaultOptions (): ContainerOptions {
        return {
            shown: true,
            opacity: null,
            rotation: 0,
            rotationCenter: new Position(),
            scale: 1,
            zIndex: 1,
            clip: null,
        };
    }

    /**
     * Set of events for easy access
     */
    static override get events () {
        // Built once
        containerEvents ??= {
            ...super.events,
            /** Container is append to a new parent */
            attach: "attach",
            /** Container is removed from it's parent */
            detach: "detach",
            /** Container is drawn */
            draw: "draw",
            /** Container is hidden */
            hide: "hide",
            /** Container is shown */
            show: "show",
        };
        return containerEvents;
    }
}

export default Container;
