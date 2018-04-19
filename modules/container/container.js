import EventEmitter from "@pencil.js/event-emitter";
import BaseEvent from "@pencil.js/base-event";
import Position from "@pencil.js/position";
import { truncate } from "@pencil.js/math";
import stableSort from "stable";

/**
 * Container class
 * @class
 * @extends EventEmitter
 */
export default class Container extends EventEmitter {
    /**
     * Container constructor
     * @param {Position} [position] - Position in its container
     * @param {ContainerOptions} [options] -
     */
    constructor (position = new Position(), options) {
        super();
        /**
         * @type {Position}
         */
        this.position = position;
        /**
         * @type {ContainerOptions}
         */
        this.options = Object.assign(this.constructor.defaultOptions, options);
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
     * @return {Container}
     */
    getTarget (position) {
        const relativePosition = position.clone().subtract(this.position);

        let lastHovered = null;
        let lookup = this.children.length - 1;
        while (!lastHovered && lookup >= 0) {
            lastHovered = this.children[lookup].getTarget(relativePosition);
            --lookup;
        }

        if (lastHovered) {
            if (lastHovered.options.zIndex < 0 && this === lastHovered.parent) {
                return (this.isHover(position) && this) || lastHovered;
            }

            return lastHovered;
        }

        return (this.isHover(position) && this) || null;
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
            ctx.translate(truncate(this.position.x), truncate(this.position.y));

            if (this.options.rotation) {
                const anchorX = truncate(this.options.rotationAnchor);
                const anchorY = truncate(this.options.rotationAnchor);
                ctx.translate(anchorX, anchorY);
                ctx.rotate(this.options.rotation * (Math.PI / 180));
                ctx.translate(-anchorX, -anchorY);
            }

            stableSort.inplace(this.children, (a, b) => a.options.zIndex - b.options.zIndex);

            const pivotIndex = this.children.filter(child => child.options.zIndex < 0).length;
            this.children.slice(0, pivotIndex).forEach(child => child.render(ctx));

            if (drawing) {
                drawing();
            }

            this.children.slice(pivotIndex).forEach(child => child.render(ctx));
            ctx.restore();
        }

        return this;
    }

    /**
     * @typedef {Object} ContainerOptions
     * @prop {Boolean} [shown=true] - Is shown
     * @prop {Number} [rotation=0] - Rotation in degree (clockwise)
     * @prop {Position} [rotationAnchor=new Position(0, 0)] - Center of rotation relative to this position
     * @prop {Number} [zIndex=0] -
     */
    /**
     * @return {ContainerOptions}
     */
    static get defaultOptions () {
        return {
            shown: true,
            rotation: 0,
            rotationAnchor: new Position(),
            zIndex: 1,
        };
    }
}
