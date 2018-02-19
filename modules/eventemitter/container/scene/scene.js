import Container from "@pencil.js/container";
import EventEmitter from "@pencil.js/eventemitter";
import MouseEvent from "@pencil.js/mouseevent";
import BaseEvent from "@pencil.js/baseevent";

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
     * @param {HTMLElement} container - Container of the renderer
     * @param {SceneOptions} [options] -
     */
    constructor (container, options) {
        super(undefined, options);
        let canvas = document.createElement("canvas");
        let measures = container.getBoundingClientRect();
        canvas.width = measures.width;
        canvas.height = measures.height;
        this.ctx = canvas.getContext("2d");
        container.innerHTML = "";
        container.appendChild(canvas);

        this.isLooped = false;
        this.fps = 0;
        this.lastTick = null;

        EventEmitter.bindEvents(this);

        let hovered = null;
        this.on("mousemove", function (event) {
            event.target.isHovered = true;
            if (event.target !== hovered) {
                if (hovered) {
                    hovered.isHovered = false;
                    hovered.fire(new MouseEvent(hovered, "leave", event.position));
                }
                hovered = event.target;
            }
            hovered.fire(new MouseEvent(hovered, "hover", event.position));
            this.ctx.canvas.style.cursor = hovered.options.cursor || "";
        });
    }

    /**
     *
     * @return {Scene} Itself
     */
    render () {
        let animationId = this.isLooped ? requestAnimationFrame(this.render.bind(this)) : null;

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
        catch (e) {
            cancelAnimationFrame(animationId);
            throw e;
        }
    }

    isHover () {
        return true;
    }

    clear () {
        if (this.options.fill) {
            this.ctx.fillStyle = this.options.fill;
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        }
        else {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        }
    }

    startLoop () {
        this.isLooped = true;
        this.render();
    }

    stopLoop () {
        this.isLooped = false;
    }

    hide () {
        this.ctx.canvas.style.visibility = "hidden";
    }

    show () {
        this.ctx.canvas.style.visibility = "";
    }

    static get defaultOptions () {
        return Object.assign({
            fill: null,
            cursor: "default"
        }, super.defaultOptions);
    }
}
