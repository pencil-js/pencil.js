import Container from "@pencil.js/container";
import EventEmitter from "@pencil.js/event-emitter";
import MouseEvent from "@pencil.js/mouse-event";
import BaseEvent from "@pencil.js/base-event";
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

        const canvas = document.createElement("canvas");
        const measures = container.getBoundingClientRect();
        canvas.width = measures.width;
        canvas.height = measures.height;
        /**
         * @type {CanvasRenderingContext2D}
         */
        this.ctx = canvas.getContext("2d");
        container.innerHTML = "";
        container.appendChild(canvas);

        /**
         * @type {Position}
         */
        this.containerPosition = new Position(measures.left, measures.top);

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
     * @param {String} cursor -
     */
    setCursor (cursor = "") {
        this.ctx.canvas.style.cursor = cursor;
    }

    /**
     *
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

        try {
            this.fire(new BaseEvent(this, "draw"));
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
        if (this.options.fill) {
            this.ctx.fillStyle = this.options.fill;
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        }
        else {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
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
     * @return {SceneOptions}
     */
    static get defaultOptions () {
        return Object.assign({
            fill: null,
            cursor: "default",
        }, super.defaultOptions);
    }
}
