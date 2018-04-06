import BaseEvent from "@pencil.js/base-event";
import Container from "@pencil.js/container";
import Component from "@pencil.js/component";
import EventEmitter from "@pencil.js/event-emitter";
import MouseEvent from "@pencil.js/mouse-event";
import Position from "@pencil.js/position";

/**
 * @typedef {Object} SceneOptions
 * @extends {ContainerOptions}
 * @prop {String} [fill=null] -
 * @prop {String} [cursor="default"] -
 */

/**
 * Wrapper
 * @class
 * @extends Container
 */
export default class Scene extends Container {
    /**
     * Scene constructor
     * @param {HTMLElement} [container=document.body] - Container of the renderer
     * @param {SceneOptions} [options] -
     */
    constructor (container = document.body, options) {
        super(undefined, options);

        container.innerHTML = "";
        let canvas;
        if (container instanceof HTMLCanvasElement) {
            canvas = container;
        }
        else {
            canvas = document.createElement("canvas");
            container.appendChild(canvas);
        }
        const measures = container.getBoundingClientRect();
        canvas.width = measures.width;
        canvas.height = measures.height;
        /**
         * @type {CanvasRenderingContext2D}
         */
        this.ctx = canvas.getContext("2d");

        /**
         * @type {Position}
         */
        this.center = new Position(this.width / 2, this.height / 2);
        /**
         * @type {Position}
         */
        this.containerPosition = new Position(measures.left + window.scrollX, measures.top + window.scrollY);

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

        EventEmitter.bindEvents(this);

        let hovered = null;
        this.on("mousemove", (event) => {
            event.target.isHovered = true;
            if (event.target !== hovered) {
                if (hovered) {
                    hovered.isHovered = false;
                    hovered.fire(new MouseEvent(hovered, "leave", event.position));
                }
                hovered = event.target;
            }
            hovered.fire(new MouseEvent(hovered, "hover", event.position));
            this.setCursor(event.target.options.cursor);
        });
    }

    /**
     *
     * @param {String} [cursor=Component.cursors.default] - Cursor string
     */
    setCursor (cursor = Component.cursors.default) {
        this.ctx.canvas.style.cursor = cursor;
    }

    /**
     * Draw the whole scene
     * @return {Scene} Itself
     */
    render () {
        const animationId = this.isLooped ? requestAnimationFrame(this.render.bind(this)) : null;

        this.clear();

        const now = performance.now();
        if (this.isLooped && this.lastTick) {
            this.fps = 1000 / (now - this.lastTick);
        }
        this.lastTick = now;

        this.fire(new BaseEvent(this, "draw"));
        try {
            return super.render(this.ctx);
        }
        catch (error) {
            cancelAnimationFrame(animationId);
            throw error;
        }
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
     */
    clear () {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        if (this.options.fill) {
            this.ctx.fillStyle = this.options.fill;
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        }
    }

    /**
     * Start to render the scene each frame
     */
    startLoop () {
        this.isLooped = true;
        this.render();
    }

    /**
     * Stop scene from being rendered
     */
    stopLoop () {
        this.isLooped = false;
        this.fps = 0;
    }

    /**
     * Hide the scene
     */
    hide () {
        this.ctx.canvas.style.visibility = "hidden";
    }

    /**
     * Show the scene
     */
    show () {
        this.ctx.canvas.style.visibility = "";
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
     * @return {SceneOptions}
     */
    static get defaultOptions () {
        return Object.assign(super.defaultOptions, {
            fill: null,
            cursor: Component.cursors.defaultOptions,
        });
    }
}
