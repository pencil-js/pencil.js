import Container from "@pencil.js/container";

/**
 * Abstract class for visual component
 * @abstract
 * @class
 * @extends Container
 */
export default class Component extends Container {
    /**
     * Component constructor
     * @param {PositionDefinition} positionDefinition - Position in space
     * @param {ComponentOptions} [options] - Drawing options
     */
    constructor (positionDefinition, options) {
        super(positionDefinition, options);


        /**
         * @type {Boolean}
         */
        this.isClicked = false;
        /**
         * @type {Boolean}
         */
        this.isHovered = false;
    }

    /**
     * Make the path and trace it
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Component} Itself
     */
    makePath (ctx) {
        const path = new Path2D();
        this.trace(path);

        if (this.options.fill) {
            ctx.fillStyle = this.options.fill;
            ctx.fill(path);
        }

        if (this.options.stroke) {
            ctx.lineJoin = this.options.join;
            ctx.lineCap = this.options.cap;
            ctx.strokeStyle = this.options.stroke;
            ctx.lineWidth = this.options.strokeWidth;
            ctx.stroke(path);
        }

        return this;
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
     * @param {Position} position - Any position
     * @param {CanvasRenderingContext2D} ctx -
     * @returns {Boolean}
     */
    isHover (position, ctx) {
        if (!this.options.shown) {
            return false;
        }

        const relative = position.clone().subtract(this.position);
        const rotated = relative.clone().rotate(-this.options.rotation, this.options.rotationAnchor);

        const path = new Path2D();
        this.trace(path);
        let result = ctx.isPointInPath(path, rotated.x, rotated.y) || ctx.isPointInStroke(path, rotated.x, rotated.y);

        if (this.options.clip) {
            const clipper = this.options.clip === Container.ITSELF ? this : this.options.clip;
            result = result && clipper.isHover(relative, ctx);
        }

        return result;
    }

    /**
     * @typedef {Object} ComponentOptions
     * @extends ContainerOptions
     * @prop {String} [fill="#000"] - Color used to fill, set to null for transparent
     * @prop {String} [stroke=null] - Color used to stroke, set to null for transparent
     * @prop {Number} [strokeWidth=1] - Stroke line thickness in pixels
     * @prop {String} [cursor=null] - Cursor to use when hover
     */
    /**
     * @return {ComponentOptions}
     */
    static get defaultOptions () {
        return Object.assign(super.defaultOptions, {
            fill: "#000",
            stroke: null,
            strokeWidth: 2,
            cursor: Component.cursors.default,
            join: Component.joins.miter,
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

    /**
     * @typedef {Object} LineJoins
     * @prop {String} miter - Join segment by extending the line edges until they meet
     * @prop {String} round - Join with a circle tangent to line edges
     * @prop {String} bevel - Join with a straight line between the line edges
     */
    /**
     * @return {LineJoins}
     */
    static get joins () {
        return {
            miter: "miter",
            round: "round",
            bevel: "bevel",
        };
    }
}
