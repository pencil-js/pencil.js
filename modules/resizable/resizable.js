import Rectangle from "@pencil.js/rectangle";
import Square from "@pencil.js/square";
// import Polygon from "@pencil.js/polygon";
import Position from "@pencil.js/position";
import "@pencil.js/draggable";
import MouseEvent from "@pencil.js/mouse-event";

/**
 * @typedef {Object} ResizableOptions
 * @prop {Boolean} [x=true] - Can be resize horizontally
 * @prop {Boolean} [y=true] - Can be resize vertically
 * @prop {Vector} [constrain] -
 */

/**
 * Enable resize on a rectangle
 * @param {ResizableOptions} options - Additional options
 * @return {DraggableAPI}
 */
Rectangle.prototype.resizable = function resizable (options) {
    this.isResizable = true;
    const mergedOptions = Object.assign({
        x: true,
        y: true,
    }, options);

    if (!(mergedOptions.x && mergedOptions.y) && this instanceof Square) {
        throw new TypeError("Square should be resizable in both x and y axis.");
    }

    const size = 15;
    const bottomRight = (new Position(this.width, this.height)).subtract(size);
    // let points = [
    //     bottomRight,
    //     bottomRight.subtract(new Position(0, size)),
    //     bottomRight.subtract(new Position(size, 0))
    // ];
    // let handle = new Polygon(points, {
    //     fill: "gold",
    //     cursor: "se-resize"
    // });
    const handle = new Square(bottomRight, size, {
        fill: "gold",
        cursor: "se-resize",
    });
    this.addChild(handle);
    const api = handle.draggable({
        x: mergedOptions.x,
        y: mergedOptions.y,
        constrain: mergedOptions.constrain,
    });
    const shape = this;
    handle.on("drag", function resizableDragCallback (event) {
        const before = {
            width: shape.width,
            height: shape.height,
        };
        if (shape instanceof Square) {
            shape.size = ((this.position.x + this.position.y) / 2) + size;
            this.position.x = shape.size - size;
            this.position.y = shape.size - size;
        }
        else {
            if (mergedOptions.x) {
                shape.width = this.position.x + size;
            }
            if (mergedOptions.y) {
                shape.height = this.position.y + size;
            }
        }

        if (shape.width !== before.width || shape.height !== before.height) {
            shape.fire(new MouseEvent(shape, "resize", event));
        }
    }, true);

    return api;
};
