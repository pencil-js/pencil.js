import Component from "@pencil.js/component";
import OffscreenCanvas from "@pencil.js/offscreen-canvas";
import KeyboardEvent from "@pencil.js/keyboard-event";
import MouseEvent from "@pencil.js/mouse-event";
import Position from "@pencil.js/position";

const listenForEventsKey = Symbol("_listenForEvents");

/**
 * Scene class
 * @class
 * @extends OffscreenCanvas
 */
export default class Scene extends OffscreenCanvas {
    /**
     * Scene constructor
     * @param {HTMLElement} [container=document.body] - Container of the renderer
     * @param {SceneOptions} [options] - Specific options
     */
    constructor (container = window.document.body, options) {
        if (container === window.document.body) {
            container.style.margin = 0;
            container.style.height = `${window.innerHeight}px`;
        }
        const measures = container.getBoundingClientRect();

        if (container instanceof window.HTMLCanvasElement) {
            super(null, 0, options);
            this.ctx = container.getContext("2d");
        }
        else {
            super(container, 0, options);
            container.appendChild(this.ctx.canvas);
        }
        /**
         * @type {Position}
         */
        this.cursorPosition = new Position();
        /**
         * @type {Position}
         */
        this.containerPosition = new Position(measures.left + window.scrollX, measures.top + window.scrollY);
        /**
         * @type {Boolean}
         */
        this.isScene = true;
        /**
         * @type {Boolean}
         */
        this.isLooped = false;
        /**
         * @type {Boolean}
         */
        this.isClicked = false;
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
     * @return {Scene} Itself
     */
    render () {
        const animationId = this.isLooped ? window.requestAnimationFrame(this.render.bind(this, undefined)) : null;

        try {
            super.render(this.ctx);
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
     * @inheritDoc
     * @param {Object} definition - Scene definition
     * @return {Scene}
     */
    static from (definition) {
        return new Scene(undefined, definition.options);
    }

    /**
     * Build a canvas and set it to fill the entire document.body
     * @param {HTMLElement} container - Element holding the canvas
     * @inheritDoc
     */
    static buildCanvas (container = window.document.body) {
        if (container) {
            const { scrollWidth, scrollHeight } = container;
            const ctx = super.buildCanvas(scrollWidth, scrollHeight);
            ctx.canvas.style.display = "block";
            ctx.canvas.style.position = "absolute";
            return ctx;
        }

        return null;
    }

    /**
     * @typedef {Object} SceneOptions
     * @extends {OffscreenCanvasOptions}
     * @prop {String} [cursor=Component.cursors.defaultOptions] - Cursor on hover
     */
    /**
     * @return {SceneOptions}
     */
    static get defaultOptions () {
        return {
            ...super.defaultOptions,
            cursor: Component.cursors.default,
        };
    }

    /**
     * @typedef {Object} SceneEvents
     * @extends ContainerEvent
     * @prop {String} change -
     */
    /**
     * @return {SceneEvents}
     */
    static get events () {
        return {
            ...super.events,
            change: "change-scene",
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
                target.isClicked = false;
            }
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
        mouseenter: (target, eventPosition) => {
            target.fire(new MouseEvent(MouseEvent.events.hover, target, eventPosition));
        },
    };
    Object.keys(mouseListeners).forEach((eventName) => {
        container.addEventListener(eventName, (event) => {
            if (this.options.shown) {
                const eventPosition = (new Position(event.clientX, event.clientY))
                    .subtract(this.containerPosition)
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
