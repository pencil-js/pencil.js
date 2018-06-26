import Component from "@pencil.js/component";
import MouseEvent from "@pencil.js/mouse-event";
import Polygon from "@pencil.js/polygon";
import Rectangle from "@pencil.js/rectangle";
import Square from "@pencil.js/square";
import "@pencil.js/draggable";

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
    const handle = new Polygon([this.width, this.height], [
        [0, 0],
        [-size, 0],
        [0, -size],
    ], {
        fill: "gold",
        cursor: Component.cursors.seResize,
    });
    this.add(handle);
    const api = handle.draggable({
        x: mergedOptions.x,
        y: mergedOptions.y,
        constrain: mergedOptions.constrain,
    });
    handle.on(MouseEvent.events.drag, (event) => {
        const before = {
            width: this.width,
            height: this.height,
        };
        if (this instanceof Square) {
            this.size = ((handle.position.x + handle.position.y) / 2) + size;
            handle.position.x = this.size;
            handle.position.y = this.size;
        }
        else {
            if (mergedOptions.x) {
                this.width = handle.position.x;
            }
            if (mergedOptions.y) {
                this.height = handle.position.y;
            }
        }

        if (this.width !== before.width || this.height !== before.height) {
            this.fire(new MouseEvent(this, MouseEvent.events.resize, event));
        }
    }, true);

    return api;
};
