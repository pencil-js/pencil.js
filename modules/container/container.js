import EventEmitter from "@pencil.js/event-emitter";
import BaseEvent from "@pencil.js/base-event";
import Position from "@pencil.js/position";
import { radianCircle } from "@pencil.js/math";

const scenePromiseKey = Symbol("_scenePromise");

/**
 * Container class
 * @class
 * @extends EventEmitter
 */
export default class Container extends EventEmitter {
    /**
     * Container constructor
     * @param {PositionDefinition} [positionDefinition] - Position in its container
     * @param {ContainerOptions} [options] - Specific options
     */
    constructor (positionDefinition = new Position(), options) {
        super();

        /**
         * @type {Position}
         */
        this.position = Position.from(positionDefinition);
        /**
         * @type {ContainerOptions}
         */
        this.options = this.constructor.defaultOptions;
        this.setOptions(options);
        /**
         * @type {Array<Container>}
         */
        this.children = [];
        /**
         * @type {Container}
         */
        this.parent = null;
        /**
         * @type {Number}
         */
        this.frameCount = 0;

        /**
         * @type {Promise<Scene>}
         * @private
         */
        this[scenePromiseKey] = new Promise((resolve) => {
            this.on(Container.events.attach, () => {
                const root = this.getRoot();
                if (root.isScene) {
                    resolve(root);
                }
                else {
                    root.getScene().then(scene => resolve(scene));
                }
            });
        });
    }

    /**
     * Define options for this container
     * @param {ContainerOptions} options - Options to override
     * @return {Container} Itself
     */
    setOptions (options) {
        this.options = {
            ...this.options,
            ...options,
        };
        this.options.rotationCenter = Position.from(this.options.rotationCenter);
        if (typeof this.options.scale !== "number") {
            this.options.scale = Position.from(this.options.scale);
        }

        return this;
    }

    /**
     * Container can't be hovered
     * @return {Boolean}
     */
    isHover () { // eslint-disable-line class-methods-use-this
        return false;
    }

    /**
     * Add another container as a child
     * @param {...Container} child - Another container
     * @return {Container} Itself
     */
    add (...child) {
        child.forEach((one) => {
            if (one === this) {
                throw new RangeError("A container can't contain itself.");
            }

            if (one.isScene) {
                throw new RangeError("A scene can't be contained in another container.");
            }

            if (one.parent) {
                one.parent.remove(one);
            }
            one.parent = this;
            this.children.push(one);
            one.fire(new BaseEvent(Container.events.attach, one));
        });

        return this;
    }

    /**
     * Remove a child from the list
     * @param {...Container} child - Child to remove
     * @return {Container} Itself
     */
    remove (...child) {
        child.forEach((one) => {
            if (this.children.includes(one)) {
                const removed = this.children.splice(this.children.indexOf(one), 1)[0];
                removed.parent = null;
                removed.fire(new BaseEvent(Container.events.detach, removed));
            }
        });

        return this;
    }

    /**
     * Remove all its children
     * @return {Container} Itself
     */
    empty () {
        return this.remove(...this.children);
    }

    /**
     * Remove itself from its parent
     * @return {Container} Itself
     */
    delete () {
        if (this.parent) {
            this.parent.remove(this);
        }

        return this;
    }

    /**
     * Return a promise for the associated scene
     * @return {Promise<Scene>}
     */
    getScene () {
        return this[scenePromiseKey];
    }

    /**
     * Return its highest parent
     * @return {Container}
     */
    getRoot () {
        if (this.parent) {
            return this.parent.getRoot();
        }

        return this;
    }

    /**
     * Get this container's absolute position (up to it's utmost parent)
     * @return {Position}
     */
    getAbsolutePosition () {
        const position = new Position();

        this.climbAncestry((ancestor) => {
            position.rotate(ancestor.options.rotation, ancestor.options.rotationCenter).add(ancestor.position);
        });

        return position;
    }

    /**
     * Bubble the event to its parent
     * @param {BaseEvent} event - Event to fire
     * @return {Container} Itself
     */
    fire (event) {
        super.fire(event);
        if (this.parent) {
            this.parent.fire(event);
        }
        return this;
    }

    /**
     * Find the target at a position
     * @param {Position} position - Any position
     * @param {CanvasRenderingContext2D} ctx - Drawing context to apply paths
     * @return {Container}
     */
    getTarget (position, ctx) {
        if (!this.options.shown) {
            return null;
        }

        const relativePosition = position.clone()
            .subtract(this.position)
            .rotate(-this.options.rotation, this.options.rotationCenter);

        let lastHovered = null;
        let lookup = this.children.length - 1;
        while (!lastHovered && lookup >= 0) {
            lastHovered = this.children[lookup].getTarget(relativePosition, ctx);
            --lookup;
        }

        if (lastHovered) {
            if (lastHovered.options.zIndex < 0 && this === lastHovered.parent) {
                return (this.isHover(position, ctx) && this) || lastHovered;
            }

            return lastHovered;
        }

        return (this.isHover(position, ctx) && this) || null;
    }

    /**
     * Call the render method of all children
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Container} Itself
     */
    render (ctx) {
        if (!this.options.shown) {
            return this;
        }

        this.frameCount++;
        this.fire(new BaseEvent(Container.events.draw, this));
        ctx.save();
        ctx.translate(this.position.x, this.position.y);

        if (this.options.clip) {
            const clipping = new window.Path2D();
            const clipper = this.options.clip === Container.ITSELF ? this : this.options.clip;
            const { x, y } = clipper.position;
            ctx.translate(x, y);
            if (clipper.trace) {
                clipper.trace(clipping);
            }
            ctx.clip(clipping);
            ctx.translate(-x, -y);
        }

        if (this.options.rotation) {
            const anchor = Position.from(this.options.rotationCenter);
            ctx.translate(anchor.x, anchor.y);
            ctx.rotate(this.options.rotation * radianCircle);
            ctx.translate(-anchor.x, -anchor.y);
        }

        if (typeof this.options.scale === "number") {
            ctx.scale(this.options.scale, this.options.scale);
        }
        else {
            const scale = Position.from(this.options.scale);
            ctx.scale(scale.x, scale.y);
        }

        this.children.sort((a, b) => a.options.zIndex - b.options.zIndex);

        Container.setOpacity(ctx, this.options.opacity);

        const firstPositiveIndex = this.children.findIndex(child => child.options.zIndex >= 0);
        const pivotIndex = firstPositiveIndex === -1 ? this.children.length : firstPositiveIndex;
        // Render children behind
        for (let i = 0, l = pivotIndex; i < l; ++i) {
            this.children[i].render(ctx);
        }

        this.makePath(ctx);

        // Render children in front
        for (let i = pivotIndex, l = this.children.length; i < l; ++i) {
            this.children[i].render(ctx);
        }

        ctx.restore();

        return this;
    }

    /**
     * Do nothing on Container, override it to add behavior
     * @return {Container} Itself
     */
    makePath () {
        return this;
    }

    /**
     * Display it
     * @return {Container} Itself
     */
    show () {
        this.options.shown = true;
        this.fire(new BaseEvent(Container.events.show, this));
        return this;
    }

    /**
     * Hide it
     * @return {Container} Itself
     */
    hide () {
        this.options.shown = false;
        this.fire(new BaseEvent(Container.events.hide, this));
        return this;
    }

    /**
     * Define if this is an ancestor of another container
     * @param {Container} container - Any container
     * @return {Boolean}
     */
    isAncestorOf (container) {
        if (container && container.parent) {
            if (container.parent === this) {
                return true;
            }

            return this.isAncestorOf(container.parent);
        }

        return false;
    }

    /**
     * @callback ancestryCallback
     * @param {Container} ancestor
     */
    /**
     * Execute an action on every ancestor of this
     * @param {ancestryCallback} callback - Function to execute on each ancestor
     * @param {Container} [until=null] - Define a ancestor where to stop the climbing
     */
    climbAncestry (callback, until) {
        callback(this);

        if (this.parent && this.parent !== until) {
            this.parent.climbAncestry(callback);
        }
    }

    /**
     * Return a json ready object
     * @return {Object}
     */
    toJSON () {
        const { defaultOptions } = this.constructor;
        const optionsCopy = {};

        Object.keys(this.options).forEach((key) => {
            const value = this.options[key];
            if (!(value && value.equals ? value.equals(defaultOptions[key]) : Object.is(value, defaultOptions[key]))) {
                optionsCopy[key] = value;
            }
        });

        const json = {
            constructor: this.constructor.name,
            position: this.position,
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
     * Create a copy of any descendant of Container
     * @return {Container}
     */
    clone () {
        return this.constructor.from(this.toJSON());
    }

    /**
     * Define context opacity
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @param {Number} opacity - Opacity value
     */
    static setOpacity (ctx, opacity) {
        if (opacity !== null && ctx.globalAlpha !== opacity) {
            ctx.globalAlpha = opacity;
        }
    }

    /**
     * Return an instance from a generic object
     * @param {Object} definition - Container definition
     * @return {Container}
     */
    static from (definition) {
        return new Container(definition.position, definition.options);
    }

    /**
     * @typedef {Object} ContainerOptions
     * @prop {Boolean} [shown=true] - Is shown
     * @prop {Number} [opacity=null] - Opacity level from 0 to 1 (null mean inherited from parent)
     * @prop {Number} [rotation=0] - Rotation ratio from 0 to 1 (clockwise)
     * @prop {PositionDefinition} [rotationCenter=[0, 0]] - Center of rotation relative to this position
     * @prop {Number|PositionDefinition} [scale=1] - Scaling ratio or a pair of value for horizontal and vertical scaling
     * @prop {Number} [zIndex=1] - Depth ordering
     * @prop {Component} [clip=null] - Other component used to clip the rendering
     */
    /**
     * @return {ContainerOptions}
     */
    static get defaultOptions () {
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
     * @typedef {Object} ContainerEvent
     * @extends EventEmitterEvents
     * @prop {String} attach - Container is append to a new parent
     * @prop {String} detach - Container remove from it's parent
     * @prop {String} draw - Container is drawn
     * @prop {String} hide -
     * @prop {String} show -
     */
    /**
     * @return {ContainerEvent}
     */
    static get events () {
        return {
            ...super.events,
            attach: "attach",
            detach: "detach",
            draw: "draw",
            hide: "hide",
            show: "show",
        };
    }

    /**
     * Keyword to mean itself
     * @return {String}
     * @const
     */
    static get ITSELF () {
        return "itself";
    }
}
