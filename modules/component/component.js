import Container from "@pencil.js/container";
import Position from "@pencil.js/position";
import OffScreenCanvas from "@pencil.js/offscreen-canvas";

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
    constructor (positionDefinition, options = {}) {
        super(positionDefinition, options);

        this.options.shadow = {
            ...Component.defaultOptions.shadow,
            ...options.shadow,
        };
        this.options.shadow.position = Position.from(this.options.shadow.position);

        /**
         * @type {Path2D}
         */
        this.path = null;
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
     * Return the relative origin position of draw
     * @return {Position}
     */
    getOrigin () {
        return Position.from(this.options.origin);
    }

    /**
     * Set variables of the context according to specified options
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {[Boolean, Boolean]} The pair (will fill) and (will stroke)
     */
    setContext (ctx) {
        const willFill = this.options.fill;
        const willStroke = this.options.stroke && this.options.strokeWidth > 0;

        const origin = this.getOrigin();
        ctx.translate(origin.x, origin.y);

        if (this.options.shadow.color) {
            ctx.shadowColor = this.options.shadow.color.toString();
            ctx.shadowBlur = this.options.shadow.blur;
            ctx.shadowOffsetX = this.options.shadow.position.x;
            ctx.shadowOffsetY = this.options.shadow.position.y;
        }

        if (willFill) {
            ctx.fillStyle = this.options.fill.toString(ctx);
        }

        if (willStroke) {
            ctx.lineJoin = this.options.join;
            ctx.lineCap = this.options.cap;
            ctx.strokeStyle = this.options.stroke.toString(ctx);
            ctx.lineWidth = this.options.strokeWidth;
        }

        return [willFill, willStroke];
    }

    /**
     * Make the path and trace it
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Component} Itself
     */
    makePath (ctx) {
        ctx.save();

        const [willFill, willStroke] = this.setContext(ctx);

        if (willFill || willStroke) {
            const path = new window.Path2D();
            this.trace(path);
            this.path = path;

            if (willFill) {
                ctx.fill(path);
            }

            if (willStroke) {
                ctx.stroke(path);
            }
        }

        ctx.restore();

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
     * @param {PositionDefinition} positionDefinition - Any position
     * @param {CanvasRenderingContext2D} [ctx] - Context use for calculation
     * @returns {Boolean}
     */
    isHover (positionDefinition, ctx = (new OffScreenCanvas()).ctx) {
        if (!this.options.shown) {
            return false;
        }

        const relative = Position.from(positionDefinition).clone().subtract(this.position);
        const rotated = relative.clone().rotate(-this.options.rotation, this.options.rotationCenter);

        ctx.save();
        const [willFill, willStroke] = this.setContext(ctx);

        if (!willFill && !willStroke) {
            ctx.restore();
            return false;
        }

        if (!this.path) {
            this.path = new window.Path2D();
            this.trace(this.path);
        }

        let result = (willFill && ctx.isPointInPath(this.path, rotated.x, rotated.y)) ||
            (willStroke && ctx.isPointInStroke(this.path, rotated.x, rotated.y));

        if (this.options.clip) {
            const clipper = this.options.clip === Container.ITSELF ? this : this.options.clip;
            result = result && clipper.isHover(relative, ctx);
        }

        ctx.restore();

        return result;
    }

    /**
     * @typedef {Object} ShadowOptions
     * @prop {Number} [blur=0] - Spread of the shadow around the component
     * @prop {PositionDefinition} [position=new Position()] - Position of the shadow relative to the component
     * @prop {String|ColorDefinition} [color=null] - Color of the shadow
     */
    /**
     * @typedef {Object} ComponentOptions
     * @extends ContainerOptions
     * @prop {String|ColorDefinition} [fill="#000"] - Color used to fill, set to null for transparent
     * @prop {String|ColorDefinition} [stroke=null] - Color used to stroke, set to null for transparent
     * @prop {Number} [strokeWidth=1] - Stroke line thickness in pixels
     * @prop {String} [cursor=Component.cursors.default] - Cursor to use when hover
     * @prop {String} [join=Component.joins.miter] - How lines join between them
     * @prop {PositionDefinition} [origin=new Position()] - Relative offset
     * @prop {ShadowOptions} [shadow] - Set of options to set a shadow
     */
    /**
     * @return {ComponentOptions}
     */
    static get defaultOptions () {
        return {
            ...super.defaultOptions,
            fill: "#000",
            stroke: null,
            strokeWidth: 2,
            cursor: Component.cursors.default,
            join: Component.joins.miter,
            origin: new Position(),
            shadow: {
                blur: 0,
                position: new Position(),
                color: null,
            },
        };
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
