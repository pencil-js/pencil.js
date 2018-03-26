import EventEmitter from "@pencil.js/event-emitter";
import Position from "@pencil.js/position";
import { truncate } from "@pencil.js/math";

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
     * @param {Container} child - Another container
     * @return {Container} Itself
     */
    addChild (child) {
        if (child.parent) {
            child.parent.removeChild(child);
        }
        child.parent = this;
        this.children.push(child);
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
        }
        return this;
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
     * Bubble the event to its parent
     * @param {BaseEvent} event -
     */
    fire (event) {
        super.fire(event);
        if (this.parent) {
            this.parent.fire(event);
        }
    }

    /**
     * Find the target at a position
     * @param {Position} position - Any position
     * @return {Container}
     */
    getTarget (position) {
        const relativePosition = position.subtract(this.position);

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
                const { x, y } = this.options.rotationAnchor;
                ctx.translate(x, y);
                ctx.rotate(this.options.rotation * (Math.PI / 180));
                ctx.translate(-x, -y);
            }

            this.children.sort((a, b) => a.options.zIndex - b.options.zIndex);
            const pivotIndex = this.children.filter(child => child.options.zIndex < 0).length;
            this.children.slice(0, pivotIndex).forEach(child => child.render(ctx));

            if (drawing) {
                drawing.call(this);
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
