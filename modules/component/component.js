import Container from "@pencil.js/container";

/**
 * @typedef {Object} ComponentOptions
 * @extends ContainerOptions
 * @prop {Number} [alpha=1] - Opacity level (alias: opacity)
 * @prop {String} [fill="#000"] - Color used to fill, set to null for transparent
 * @prop {String} [stroke=null] - Color used to stroke, set to null for transparent
 * @prop {Number} [strokeWidth=1] - Stroke line thickness in pixels
 * @prop {String} [cursor=null] - Cursor to use when hover
 */

/**
 * Abstract class for visual component
 * @abstract
 * @class
 * @extends Container
 */
export default class Component extends Container {
    /**
     * Component constructor
     * @param {Position} position - Position in space
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (position, options) {
        super(position, options);
        this.options.alpha = this.options.opacity || this.options.alpha;

        /**
         * @type {Boolean}
         */
        this.isShown = this.options.shown === undefined || this.options.shown;
        /**
         * @type {Boolean}
         */
        this.isHovered = false;
    }

    /**
     * Draw it on a context
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Component} Itself
     */
    render (ctx) {
        return super.render(ctx, () => {
            ctx.beginPath();
            ctx.globalAlpha = this.options.alpha;

            this.trace(ctx);

            if (this.options.fill) {
                ctx.fillStyle = this.options.fill;
                ctx.fill();
            }

            if (this.options.stroke) {
                ctx.strokeStyle = this.options.stroke;
                ctx.lineWidth = this.options.strokeWidth;
                ctx.stroke();
            }
            ctx.closePath();
        });
    }

    /**
     * Every component should have a trace function
     * @throws {ReferenceError}
     */
    trace () {
        throw new ReferenceError(`Unimplemented trace function in ${this.constructor.name}`);
    }

    /**
     * Define if is hover a position
     * @returns {Boolean}
     */
    isHover () {
        return this.isShown;
    }

    /**
     * Display this component
     */
    show () {
        this.isShown = true;
    }

    /**
     * Hide this component
     */
    hide () {
        this.isShown = false;
    }

    /**
     * @return {ComponentOptions}
     */
    static get defaultOptions () {
        return Object.assign(super.defaultOptions, {
            alpha: 1,
            fill: "#000",
            stroke: null,
            strokeWidth: 2,
            cursor: Component.cursors.default,
        });
    }

    /**
     * All available cursors
     * https://www.w3.org/TR/2017/WD-css-ui-4-20171222/#cursor
     * @return {Object}
     */
    static get cursors () {
        const cursors = {
            default: "default",
            none: "none",
            contextMenu: "context-menu",
            help: "help",
            pointer: "pointer",
            progress: "progress",
            wait: "wait",
            cell: "cell",
            crosshair: "crosshair",
            text: "text",
            textVertical: "vertical-text",
            alias: "alias",
            copy: "copy",
            move: "move",
            noDrop: "no-drop",
            notAllowed: "not-allowed",
            grab: "grab",
            grabbing: "grabbing",
            allScroll: "all-scroll",
            colResize: "col-resize",
            rowResize: "row-resize",
            nResize: "n-resize",
            eResize: "e-resize",
            sResize: "s-resize",
            wResize: "w-resize",
            neResize: "ne-resize",
            seResize: "se-resize",
            swResize: "sw-resize",
            nwResize: "nw-resize",
            ewResize: "ew-resize",
            nsResize: "ns-resize",
            neswResize: "nesw-resize",
            nwseResize: "nwse-resize",
            zoomIn: "zoom-in",
            zoomOut: "zoom-out",
        };

        // While Blink don't support "grab" and "grabbing", let's //FIXME
        if (!CSS.supports("cursor", cursors.grab)) {
            cursors.grab = "-webkit-grab";
        }
        if (!CSS.supports("cursor", cursors.grabbing)) {
            cursors.grabbing = "-webkit-grabbing";
        }

        cursors.link = cursors.alias;
        cursors.verticalResize = cursors.rowResize;
        cursors.horizontalResize = cursors.colResize;
        cursors.topResize = cursors.nResize;
        cursors.rightResize = cursors.eResize;
        cursors.bottomResize = cursors.sResize;
        cursors.leftResize = cursors.wResize;
        return cursors;
    }
}
