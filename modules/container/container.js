import EventEmitter from "@pencil.js/event-emitter";
import BaseEvent from "@pencil.js/base-event";
import Position from "@pencil.js/position";
import { radianCircle } from "@pencil.js/math";
import stableSort from "stable";
import OffScreenCanvas from "@pencil.js/offscreen-canvas";
import Vector from "@pencil.js/vector";

/**
 * Container class
 * @class
 * @extends EventEmitter
 */
export default class Container extends EventEmitter {
    /**
     * Container constructor
     * @param {PositionDefinition} [position] - Position in its container
     * @param {ContainerOptions} [options] -
     */
    constructor (position = new Position(), options) {
        super();

        /**
         * @type {Position}
         */
        this.position = Position.from(position);
        /**
         * @type {ContainerOptions}
         */
        this.options = Object.assign(this.constructor.defaultOptions, options);
        this.options.rotationAnchor = Position.from(this.options.rotationAnchor);
        /**
         * @type {Array<Container>}
         */
        this.children = [];
        /**
         * @type {Container}
         */
        this.parent = null;

        this._scenePromise = new Promise((resolve) => {
            this.on("attach", () => {
                const root = this.getRoot();
                if (root.isScene) {
                    resolve(root);
                }
                else {
                    root.getScene().then(scene => resolve(scene));
                }
            });
        });

        /**
         * @type {Boolean}
         */
        this.isClicked = false;
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
                throw new EvalError("A container can't contain itself.");
            }

            if (one.isScene) {
                throw new EvalError("A scene can't be contained in another container.");
            }

            if (one.parent) {
                one.parent.removeChild(one);
            }
            one.parent = this;
            this.children.push(one);
            one.fire(new BaseEvent(one, "attach"));
        });

        return this;
    }

    /**
     * Remove a child from the list
     * @param {Container} child -
     * @return {Container} Itself
     */
    removeChild (child) {
        if (this.children.includes(child)) {
            const removed = this.children.splice(this.children.indexOf(child), 1)[0];
            removed.parent = null;
            removed.fire(new BaseEvent(removed, "detach"));
        }

        return this;
    }

    /**
     * Remove all its children
     */
    empty () {
        this.children.forEach(child => child.parent = null);
        this.children = [];
    }

    /**
     * Remove itself from its parent
     */
    remove () {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    /**
     * Return the associated scene or null if none
     * @return {Scene}
     */
    hasScene () {
        const root = this.getRoot();
        return root.isScene ? root : null;
    }

    /**
     * Return a promise for the associated scene
     * @return {Promise<Scene>}
     */
    getScene () {
        return this._scenePromise;
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
        if (this.parent) {
            const parentAbsolutePosition = this.parent.getAbsolutePosition();
            return parentAbsolutePosition.add(this.position);
        }

        return new Position();
    }

    /**
     * Bubble the event to its parent
     * @param {BaseEvent} event -
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
        const relativePosition = position.clone().subtract(this.position);

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
     * @param {Function} [drawing] - Callback that draw the child
     * @return {Container} Itself
     */
    render (ctx, drawing) {
        if (this.options.shown) {
            ctx.save();
            ctx.translate(this.position.x, this.position.y);

            if (this.options.clip) {
                const clipping = new Path2D();
                const clipper = this.options.clip === Container.ITSELF ? this : this.options.clip;
                const { x, y } = clipper.position;
                ctx.translate(x, y);
                clipper.trace(clipping);
                ctx.clip(clipping);
                ctx.translate(-x, -y);
            }

            if (this.options.rotation) {
                const anchorX = this.options.rotationAnchor.x;
                const anchorY = this.options.rotationAnchor.y;
                ctx.translate(anchorX, anchorY);
                ctx.rotate(this.options.rotation * radianCircle);
                ctx.translate(-anchorX, -anchorY);
            }

            stableSort.inplace(this.children, (a, b) => a.options.zIndex - b.options.zIndex);

            if (this.options.opacity !== null && ctx.globalAlpha !== this.options.opacity) {
                ctx.globalAlpha = this.options.opacity;
            }

            const pivotIndex = this.children.filter(child => child.options.zIndex < 0).length;
            for (let i = 0, l = pivotIndex; i < l; ++i) {
                this.children[i].render(ctx);
            }

            if (drawing) {
                drawing();
            }

            for (let i = pivotIndex, l = this.children.length; i < l; ++i) {
                this.children[i].render(ctx);
            }

            ctx.restore();
        }

        return this;
    }

    /**
     * Display it
     */
    show () {
        this.options.shown = true;
    }

    /**
     * Hide it
     */
    hide () {
        this.options.shown = false;
    }

    /**
     * Define if this is an ancestor of another container
     * @param {Container} container - Any container
     * @return {Boolean}
     */
    isAncestorOf (container) {
        if (container.parent) {
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
        if (this.parent && this.parent !== until) {
            this.parent.climbAncestry(callback);
        }

        callback(this);
    }

    /**
     * Returns a off-screen canvas painted with this
     * @param {VectorDefinition} [vectorDefinition] - Define a range, use its width and height if available by default
     * @return {OffScreenCanvas}
     */
    getTaintedCanvas (vectorDefinition) {
        let vector;
        if (vectorDefinition) {
            vector = Vector.from(vectorDefinition);
        }
        else if (this.width && this.height) {
            vector = new Vector(new Position(), [this.width, this.height]);
        }
        if (vector) {
            const size = vector.getDelta();
            const offScreen = new OffScreenCanvas(size.x, size.y);
            offScreen.ctx.translate(-this.position.x, -this.position.y);
            this.render(offScreen.ctx);
            return offScreen;
        }

        return null;
    }

    /**
     * Returns an image of this container
     * @param {VectorDefinition} [vectorDefinition] - Define a range for the image, use its width and height if available by default
     * @return {HTMLImageElement}
     */
    toImg (vectorDefinition) {
        const offScreen = this.getTaintedCanvas(vectorDefinition);
        return offScreen ? offScreen.toImg() : null;
    }

    /**
     * @inheritDoc
     */
    toJSON () {
        const { defaultOptions } = this.constructor;
        const optionsCopy = {};

        Object.keys(this.options).forEach((key) => {
            const value = this.options[key];
            if (!(value && value.equals ? value.equals(defaultOptions[key]) : Object.is(value, defaultOptions[key]))) {
                optionsCopy[key] = value && value.toJSON ? value.toJSON() : value;
            }
        });

        const json = Object.assign(super.toJSON(), {
            position: this.position.toJSON(),
        });
        if (this.children.length) {
            json.children = this.children.map(child => child.toJSON());
        }
        if (Object.keys(optionsCopy).length) {
            json.options = optionsCopy;
        }
        return json;
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
     * @prop {PositionDefinition} [rotationAnchor=new Position(0, 0)] - Center of rotation relative to this position
     * @prop {Number} [zIndex=1] - Depth ordering
     * @prop {Component} [clip=null] -
     */
    /**
     * @return {ContainerOptions}
     */
    static get defaultOptions () {
        return {
            shown: true,
            opacity: null,
            rotation: 0,
            rotationAnchor: new Position(),
            zIndex: 1,
            clip: null,
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
