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
     * @typedef {Object} Cursors
     * @enum {String}
     * @prop {String} default - Normal behavior
     * @prop {String} none - No visible cursor
     * @prop {String} contextMenu - Possible to extends context-menu
     * @prop {String} help - Display help
     * @prop {String} pointer - Can be clicked
     * @prop {String} progress - Process running in background
     * @prop {String} wait - Process running in foreground
     * @prop {String} cell - Table cell selection
     * @prop {String} crosshair - Precise selection
     * @prop {String} text - Text selection
     * @prop {String} textVertical - Vertical test selection
     * @prop {String} alias - Can create a shortcut
     * @prop {String} copy - Can be copied
     * @prop {String} move - Move around
     * @prop {String} noDrop - Drop not allowed
     * @prop {String} notAllowed - Action not allowed
     * @prop {String} grab - Can be grabbed
     * @prop {String} grabbing - Currently grabbing
     * @prop {String} allScroll - Scroll in all direction
     * @prop {String} colResize - Horizontal resize
     * @prop {String} rowResize - Vertical resize
     * @prop {String} nResize - Resize the north border
     * @prop {String} eResize - Resize the east border
     * @prop {String} sResize - Resize the south border
     * @prop {String} wResize - Resize the west border
     * @prop {String} neResize - Resize the north-east corner
     * @prop {String} seResize - Resize the south-east corner
     * @prop {String} swResize - Resize the north-west corner
     * @prop {String} nwResize - Resize the north-west corner
     * @prop {String} ewResize - Horizontal resize
     * @prop {String} nsResize - Vertical resize
     * @prop {String} neswResize - Diagonal resize (top-right to bottom-left)
     * @prop {String} nwseResize - Diagonal resize (top-left to bottom-right)
     * @prop {String} zoomIn - Zoom in
     * @prop {String} zoomOut - Zoom out
     * @prop {String} link - Alias for "alias"
     * @prop {String} verticalResize - Alias for "rowResize"
     * @prop {String} horizontalResize - Alias for "colResize"
     * @prop {String} topResize - Alias for "nResize"
     * @prop {String} rightResize - Alias for "eResize"
     * @prop {String} bottomResize - Alias for "sResize"
     * @prop {String} leftResize - Alias for "wResize"
     */
    /**
     * All available cursors
     * https://www.w3.org/TR/2017/WD-css-ui-4-20171222/#cursor
     * @return {Cursors}
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

        // While Blink don't support "grab" and "grabbing"
        cursors.grab = window.CSS && CSS.supports("cursor", "grab") ? "grab" : "-webkit-grab";
        cursors.grabbing = window.CSS && CSS.supports("cursor", "grabbing") ? "grabbing" : "-webkit-grab";

        // Aliases
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
     * @enum {String}
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
