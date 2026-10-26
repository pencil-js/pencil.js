import BaseEvent from "./base-event.js";
import EventEmitter from "./event-emitter.js";
import Position, { type PositionDefinition } from "./position.js";
import { radianCircle } from "./math.js";
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

/**
 * Something that can be serialized
 */
interface Serializable {
    toJSON (): unknown;
}

const isSerializable = (value: unknown): value is Serializable => typeof (value as Serializable | null)?.toJSON === "function";

/**
 * Basic node in the scene graph, holding children and their common transformations
 * @module Container
 */
export default class Container<O extends ContainerOptions = ContainerOptions> extends EventEmitter {
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
    readonly isScene: boolean = false;

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
     * Call the render method of all children
     * @param ctx - Drawing context
     * @returns Itself
     */
    render (ctx: CanvasRenderingContext2D): this {
        if (!this.options.shown) {
            return this;
        }

        this.frameCount++;
        this.fire(new BaseEvent(Container.events.draw, this));

        ctx.save();

        this.applyTransform(ctx);

        const { opacity } = this.options;
        if (opacity != null && opacity !== 1) {
            ctx.globalAlpha *= opacity;
        }

        this.sortChildren();
        const { children } = this;

        let index = 0;
        // Render children behind
        for (; index < children.length && children[index].options.zIndex < 0; ++index) {
            children[index].render(ctx);
        }

        this.makePath(ctx);

        // Render children in front
        for (; index < children.length; ++index) {
            children[index].render(ctx);
        }

        ctx.restore();

        return this;
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
                Object.is(value, defaultValue) || (isSerializable(value) && isSerializable(defaultValue) &&
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
        const copy = ctor.from({
            ...this.toJSON(),
            children: undefined,
            options: {
                ...this.options,
            },
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
        return {
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
    }
}
