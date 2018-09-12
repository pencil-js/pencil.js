import BaseEvent from "@pencil.js/base-event";
import Component from "@pencil.js/component";
import Container from "@pencil.js/container";
import KeyboardEvent from "@pencil.js/keyboard-event";
import MouseEvent from "@pencil.js/mouse-event";
import Position from "@pencil.js/position";
import { random } from "@pencil.js/math";

/**
 * Wrapper
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
        super(undefined, options);

        container.innerHTML = "";
        let canvas;
        if (container instanceof HTMLCanvasElement) {
            canvas = container;
        }
        else {
            canvas = window.document.createElement("canvas");
            container.appendChild(canvas);
            canvas.style.display = "block";
        }
        const measures = container.getBoundingClientRect();
        canvas.width = measures.width;
        canvas.height = measures.height;
        /**
         * @type {CanvasRenderingContext2D}
         */
        this.ctx = canvas.getContext("2d");

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
         * @type {Number}
         */
        this.fps = 0;
        /**
         * @type {Number}
         */
        this.lastTick = null;

        /**
         * @type {Boolean}
         */
        this.isReady = false;

        this._listenForEvents();
    }

    /**
     * Bind window event and call them on targets (can't be called twice)
     */
    _listenForEvents () {
        if (this.isReady) {
            throw new EvalError("Can't rebind event a second time.");
        }

        let hovered = null;
        const mouseListeners = {
            [MouseEvent.events.down]: target => target.isClicked = true,
            [MouseEvent.events.move]: (target, eventPosition) => {
                target.isClicked = false;
                if (target !== hovered) {
                    if (hovered) {
                        hovered.isHovered = false;
                        if (!hovered.isAncestorOf(target)) {
                            hovered.fire(new MouseEvent(hovered, MouseEvent.events.leave, eventPosition));
                        }
                    }
                    hovered = target;
                }
                if (!target.isHovered) {
                    target.isHovered = true;
                    target.fire(new MouseEvent(target, MouseEvent.events.hover, eventPosition));
                }
                this.setCursor(target.options.cursor);
                this.cursorPosition.set(eventPosition);
            },
            [MouseEvent.events.up]: (target, eventPosition) => {
                if (target.isClicked) {
                    target.fire(new MouseEvent(target, MouseEvent.events.click, eventPosition));
                }
                target.isClicked = false;
            },
            [MouseEvent.events.wheel]: (target, eventPosition, event) => {
                const mouseEvents = MouseEvent.events;
                const events = event.deltaY > 0 ?
                    [mouseEvents.scrollDown, mouseEvents.zoomOut] :
                    [mouseEvents.scrollUp, mouseEvents.zoomIn];
                target.fire(new MouseEvent(target, events[0], eventPosition))
                    .fire(new MouseEvent(target, events[1], eventPosition));
            },
            mouseout: (target, eventPosition) => {
                target.fire(new MouseEvent(target, MouseEvent.events.leave, eventPosition));
            },
        };
        Object.keys(mouseListeners).forEach((eventName) => {
            window.addEventListener(eventName, (event) => {
                const eventPosition = (new Position(event.clientX, event.clientY))
                    .subtract(this.containerPosition)
                    .add(window.scrollX, window.scrollY);
                const target = this.getTarget(eventPosition, this.ctx);
                if (target) {
                    target.fire(new MouseEvent(target, eventName, eventPosition));
                    if (mouseListeners[eventName] instanceof Function) {
                        mouseListeners[eventName](target, eventPosition, event);
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
            window.addEventListener(eventName, (event) => {
                this.fire(new KeyboardEvent(this, eventName, event.key));
                if (keyboardListener[eventName] instanceof Function) {
                    keyboardListener[eventName](event);
                }
            });
        });
        this.isReady = true;
        this.fire(new BaseEvent(this, Scene.events.ready));
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
     * @param {CanvasRenderingContext2D|OffScreenCanvas} [onto] -
     * @return {Scene} Itself
     */
    render (onto) {
        const animationId = this.isLooped ? requestAnimationFrame(this.render.bind(this, undefined)) : null;

        const context = (onto && onto.ctx) || onto || this.ctx;
        this.clear(context);

        try {
            super.render(context);
        }
        catch (error) {
            cancelAnimationFrame(animationId);
            throw error;
        }

        const now = performance.now();
        if (this.isLooped && this.lastTick) {
            this.fps = 1000 / (now - this.lastTick);
        }
        this.lastTick = now;

        return this;
    }

    /**
     * Define if is hovered (always true on scene as a fallback)
     * @return {Boolean}
     */
    isHover () { // eslint-disable-line class-methods-use-this
        return true;
    }

    /**
     * Erase everything on scene
     * @param {CanvasRenderingContext2D} [context=this.ctx] -
     * @return {Scene} Itself
     */
    clear (context = this.ctx) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        if (this.options.fill) {
            context.fillStyle = this.options.fill;
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
     * Return this scene center point
     * @return {Position}
     */
    get center () {
        return new Position(this.width / 2, this.height / 2);
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
        return Object.assign(super.defaultOptions, {
            fill: null,
            opacity: 1,
            cursor: Component.cursors.default,
        });
    }

    /**
     * @typedef {Object} SceneEvent
     * @enum {String}
     * @prop {String} ready - Scene enter ready state
     */
    /**
     * @return {SceneEvent}
     */
    static get events () {
        return {
            ready: "ready",
        };
    }
}
