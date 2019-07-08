import Component from "@pencil.js/component";
import Container from "@pencil.js/container";
import KeyboardEvent from "@pencil.js/keyboard-event";
import MouseEvent from "@pencil.js/mouse-event";
import Position from "@pencil.js/position";
import { random } from "@pencil.js/math";

const listenForEventsKey = Symbol("_listenForEvents");

/**
 * Scene class
 * @class
 * @extends Container
 */
export default class Scene extends Container {
    /**
     * Scene constructor
     * @param {HTMLElement} [container=document.body] - Container of the renderer
     * @param {SceneOptions} [options] - Specific options
     */
    constructor (container = window.document.body, options) {
        const measures = container.getBoundingClientRect();
        super([measures.left + window.scrollX, measures.top + window.scrollY], options);

        let canvas;
        if (container instanceof window.HTMLCanvasElement) {
            canvas = container;
        }
        else {
            canvas = window.document.createElement("canvas");
            container.appendChild(canvas);
            canvas.style.display = "block";
            canvas.style.position = "absolute";
            canvas.width = container.scrollWidth;
            canvas.height = container.scrollHeight;
        }
        /**
         * @type {CanvasRenderingContext2D}
         */
        this.ctx = canvas.getContext("2d");
        /**
         * @type {Position}
         */
        this.cursorPosition = new Position();
        /**
         * @type {Boolean}
         */
        this.isScene = true;
        /**
         * @type {Boolean}
         */
        this.isLooped = false;
        /**
         * @type {Number}
         */
        this.fps = 0;
        /**
         * @type {Number}
         */
        this.lastTick = null;

        this[listenForEventsKey](container);
    }

    /**
     *
     * @param {String} [cursor=Component.cursors.default] - Cursor string
     * @return {Scene} Itself
     */
    setCursor (cursor = Component.cursors.default) {
        this.ctx.canvas.style.cursor = cursor;
        return this;
    }

    /**
     * Draw the whole scene
     * @param {CanvasRenderingContext2D|OffScreenCanvas} [onto=this.ctx] - Context to render scene
     * @return {Scene} Itself
     */
    render (onto = this.ctx) {
        const animationId = this.isLooped ? window.requestAnimationFrame(this.render.bind(this, undefined)) : null;

        const context = (onto && onto.ctx) || onto;
        this.clear(context);

        try {
            super.render(context);
        }
        catch (error) {
            window.cancelAnimationFrame(animationId);
            this.stopLoop();
            throw error;
        }

        const now = window.performance.now();
        if (this.isLooped && this.lastTick) {
            this.fps = 1000 / (now - this.lastTick);
        }
        this.lastTick = now;

        return this;
    }

    /**
     * Define if is hovered
     * @return {Boolean}
     */
    isHover () {
        return this.options.shown;
    }

    /**
     * Erase everything on scene
     * @param {CanvasRenderingContext2D} [context=this.ctx] -
     * @return {Scene} Itself
     */
    clear (context = this.ctx) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        if (this.options.fill) {
            context.fillStyle = this.options.fill.toString(context);
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        }
        return this;
    }

    /**
     * Start to render the scene each frame
     * @return {Scene} Itself
     */
    startLoop () {
        this.isLooped = true;
        this.render();
        return this;
    }

    /**
     * Stop scene from being rendered
     * @return {Scene} Itself
     */
    stopLoop () {
        this.isLooped = false;
        this.fps = 0;
        return this;
    }

    /**
     * @inheritDoc
     * @return {Scene} Itself
     */
    hide () {
        this.ctx.canvas.style.visibility = "hidden";
        return super.hide();
    }

    /**
     * @inheritDoc
     * @return {Scene} Itself
     */
    show () {
        this.ctx.canvas.style.visibility = "";
        return super.show();
    }

    /**
     * Return this scene width
     * @returns {Number}
     */
    get width () {
        return this.ctx.canvas.width;
    }

    /**
     * Return this scene height
     * @returns {Number}
     */
    get height () {
        return this.ctx.canvas.height;
    }

    /**
     * Return the whole scene size
     * @returns {Position}
     */
    get size () {
        return new Position(this.width, this.height);
    }

    /**
     * Return this scene center point
     * @return {Position}
     */
    get center () {
        return this.size.divide(2);
    }

    /**
     * Return a random position within the scene
     * @return {Position}
     */
    getRandomPosition () {
        return new Position(random(this.width), random(this.height));
    }

    /**
     * @inheritDoc
     * @param {Object} definition - Scene definition
     * @return {Scene}
     */
    static from (definition) {
        return new Scene(undefined, definition.options);
    }

    /**
     * @typedef {Object} SceneOptions
     * @extends {ContainerOptions}
     * @prop {String} [fill=null] - Background of the scene
     * @prop {Number} [opacity=1] - Global opacity
     * @prop {String} [cursor=Component.cursors.defaultOptions] - Cursor on hover
     */
    /**
     * @return {SceneOptions}
     */
    static get defaultOptions () {
        return {
            ...super.defaultOptions,
            fill: null,
            opacity: 1,
            cursor: Component.cursors.default,
        };
    }
}

/**
 * Bind events and call them on targets (can't be called twice)
 * @param {HTMLElement} container - Container to bind event to
 * @memberOf Scene#
 */
Scene.prototype[listenForEventsKey] = function listenForEvents (container) {
    if (this.isReady) {
        throw new EvalError("Can't rebind event a second time.");
    }

    let hovered = null;
    let startPosition = null;
    const mouseListeners = {
        [MouseEvent.events.down]: (target, eventPosition) => {
            target.isClicked = true;
            startPosition = eventPosition;
        },
        [MouseEvent.events.move]: (target, eventPosition) => {
            if (startPosition) {
                target.isClicked = target.isClicked && eventPosition.distance(startPosition) < 10;
            }
            if (target !== hovered) {
                if (hovered) {
                    hovered.isHovered = false;
                    if (!hovered.isAncestorOf(target)) {
                        hovered.fire(new MouseEvent(MouseEvent.events.leave, hovered, eventPosition));
                    }
                }
                hovered = target;
            }
            if (!target.isHovered) {
                target.isHovered = true;
                target.fire(new MouseEvent(MouseEvent.events.hover, target, eventPosition));
            }
            this.setCursor(target.options.cursor);
            this.cursorPosition.set(eventPosition);
        },
        [MouseEvent.events.up]: (target, eventPosition) => {
            startPosition = null;
            if (target.isClicked) {
                target.fire(new MouseEvent(MouseEvent.events.click, target, eventPosition));
            }
            target.isClicked = false;
        },
        [MouseEvent.events.wheel]: (target, eventPosition, event) => {
            const mouseEvents = MouseEvent.events;
            const events = event.deltaY > 0 ?
                [mouseEvents.scrollDown, mouseEvents.zoomOut] :
                [mouseEvents.scrollUp, mouseEvents.zoomIn];
            target.fire(new MouseEvent(events[0], target, eventPosition))
                .fire(new MouseEvent(events[1], target, eventPosition));
        },
        mouseout: (target, eventPosition) => {
            target.fire(new MouseEvent(MouseEvent.events.leave, target, eventPosition));
        },
    };
    Object.keys(mouseListeners).forEach((eventName) => {
        container.addEventListener(eventName, (event) => {
            if (this.options.shown) {
                const eventPosition = (new Position(event.clientX, event.clientY))
                    .subtract(this.position)
                    .add(window.scrollX, window.scrollY);
                const target = this.getTarget(eventPosition, this.ctx);
                if (target) {
                    target.fire(new MouseEvent(eventName, target, eventPosition));
                    if (mouseListeners[eventName] instanceof Function) {
                        mouseListeners[eventName](target, eventPosition, event);
                    }
                }
            }
        }, {
            passive: true,
        });
    });
    const keyboardListener = {
        [KeyboardEvent.events.down]: null,
        [KeyboardEvent.events.up]: null,
    };
    Object.keys(keyboardListener).forEach((eventName) => {
        container.addEventListener(eventName, (event) => {
            if (this.options.shown) {
                this.fire(new KeyboardEvent(eventName, this, event.key));
                if (keyboardListener[eventName] instanceof Function) {
                    keyboardListener[eventName](event);
                }
            }
        });
    });
};
